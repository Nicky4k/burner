import React, { useEffect, useState } from "react";
import "./OneOnOneChatPage.css";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  setBodyViewPage,
  setNotifications,
  setSelectedChat,
} from "../App Redux/features/userSlice";
import { renderFromObject } from "./Components/Chats";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import styled from "@emotion/styled";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import TagFacesOutlinedIcon from "@mui/icons-material/TagFacesOutlined";
import io from "socket.io-client";
import moment from "moment";

const ENDPOINT = "https://burner-tok.herokuapp.com/";
// "https://talk-a-tive.herokuapp.com"; -> After deployment
var socket, selectedChatCompare;

const OneOnOneChatPage = () => {
  const dispatch = useDispatch();
  const stateData = useSelector(selectUser);

  const [showLargeCard, setShowLargeCard] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const FlexHeightBox = styled.section`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 200;
    height: ${!showLargeCard
      ? "5rem"
      : stateData.selectedChat.isGroupChat
      ? `min(${stateData.selectedChat.users.length * 4 + 14.5}rem, 95%)`
      : "14rem"};
    /* max-height: 100%; */
    width: calc(100% - 3rem);
    background-color: #030403;
    color: white;
    margin-top: 1.5rem;
    margin: 0 1.5rem;
    padding-bottom: ${stateData.selectedChat.isGroupChat && showLargeCard
      ? "0rem"
      : ""};
    border-radius: 2rem;

    transition-timing-function: ease-in;
    transition: all 0.5s;
  `;

  const OVoContainer = styled.section`
    display: flex;
    width: 100%;
    height: ${stateData.selectedChat.isGroupChat ? "auto" : "100%"};
    align-items: ${!showLargeCard ? "centre" : "flex-start"};
    padding: 0 1rem 0 1.5rem;
  `;

  const OvoPictureContainer = styled.section`
    display: flex;
    width: ${!showLargeCard ? "3.5rem" : "7.5rem"};
    height: 100%;
    align-items: center;
    margin-top: ${stateData.selectedChat.isGroupChat && showLargeCard
      ? "20px"
      : ""};
    margin-bottom: ${stateData.selectedChat.isGroupChat && showLargeCard
      ? "5px"
      : ""};
  `;

  const OvoPhoto = styled.img`
    height: ${!showLargeCard ? "3.5rem" : "7.5rem"};
    width: ${!showLargeCard ? "3.5rem" : "7.5rem"};
    object-fit: contain;
    border-radius: 100%;
    background-color: #ffffff;
    cursor: pointer;
  `;

  const OvoBodyContainer = styled.section`
    display: flex;
    flex-direction: ${!showLargeCard ? "row" : "column"};
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0 1.5rem;
    padding-bottom: ${!showLargeCard ? "" : "1rem"};
    padding-left: ${!showLargeCard ? "" : "0"};
  `;

  const flexHeightBoxHandler = () => {
    setShowLargeCard(!showLargeCard);
  };

  const oVoBackToChatPageHandler = () => {
    dispatch(setBodyViewPage("chats"));
  };

  const removeUserFromGroupHandler = (delUsr) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${stateData.userMongoDB.token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      chatId: stateData.selectedChat._id,
      userId: delUsr._id,
    });

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:3000/api/chat/groupremove", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        dispatch(setSelectedChat(JSON.parse(result)));
      })
      .catch((error) => console.log("error", error));
  };

  const fetchMessages = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${stateData.userMongoDB.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `http://localhost:3000/api/message/${stateData.selectedChat._id}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        setMessages(JSON.parse(result));
        socket.emit("join chat", stateData.selectedChat._id);
      })
      .catch((error) => console.log("error", error));
  };

  const sendMessageHandler = (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", stateData.selectedChat._id);
      var myHeaders = new Headers();
      myHeaders.append(
        "Authorization",
        `Bearer ${stateData.userMongoDB.token}`
      );
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        content: newMessage,
        chatId: stateData.selectedChat._id,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("http://localhost:3000/api/message", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          setNewMessage("");
          socket.emit("new message", JSON.parse(result));
          setMessages([...messages, JSON.parse(result)]);
        })
        .catch((error) => console.log("error", error));
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", stateData.selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", stateData.selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", stateData.userMongoDB);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = stateData.selectedChat;
  }, [stateData.selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      setMessages([...messages, newMessageRecieved]);
    });
  });

  return (
    <div className="oneOnOneChatPage">
      <FlexHeightBox>
        <div className="groupEditFlipper">
          <OVoContainer>
            <div className="oVoBtn__container">
              <div
                className="oVo__backButton"
                onClick={oVoBackToChatPageHandler}
              >
                <ArrowBackRoundedIcon sx={{ color: "white", fontSize: 30 }} />
              </div>
            </div>
            <OvoBodyContainer>
              <OvoPictureContainer>
                <OvoPhoto
                  onClick={() => {
                    flexHeightBoxHandler();
                  }}
                  loading="lazy"
                  alt={renderFromObject(
                    stateData.selectedChat,
                    "name",
                    stateData.userMongoDB._id,
                    "chatName"
                  )}
                  src={
                    renderFromObject(
                      stateData.selectedChat,
                      "pic",
                      stateData.userMongoDB._id
                    ) ||
                    `https://ui-avatars.com/api/?name=${stateData.selectedChat.chatName}`
                  }
                />
              </OvoPictureContainer>
              <div className="chatTab__body">
                <h3>
                  {renderFromObject(
                    stateData.selectedChat,
                    "name",
                    stateData.userMongoDB._id,
                    "chatName"
                  )}
                </h3>
                <h4>
                  {isTyping ? (
                    <div className="typing__container">
                      <div className="dot-typing"></div>
                      <h3 className="typing__textEffect"> typing</h3>
                    </div>
                  ) : (
                    renderFromObject(
                      stateData.selectedChat,
                      "email",
                      stateData.userMongoDB._id
                    ) || `${stateData.selectedChat.users.length} members`
                  )}
                </h4>
              </div>
            </OvoBodyContainer>
            <div className="oVoBtn__container">
              <div
                className="openOvoProfile__options"
                onClick={() => {
                  flexHeightBoxHandler();
                }}
              >
                {!showLargeCard ? <MoreVertIcon /> : <UnfoldLessIcon />}
              </div>
            </div>
          </OVoContainer>
          <div className="groupUsersPopulate">
            {stateData.selectedChat.isGroupChat &&
              showLargeCard &&
              stateData.selectedChat.users?.map((usr) => (
                <div
                  key={usr._id}
                  className="grpChatCard__Container"
                  onClick={() => {}}
                >
                  <div className="hover__grpCardContainerEffect">
                    <div className="leftSectionGrpCardUsers">
                      <div className="grpChatTab__picture">
                        <img
                          loading="lazy"
                          className="grpChatTab__image"
                          alt={usr.name}
                          src={usr.pic}
                        />
                      </div>
                      <div className="grpChatTabCard__body">
                        <h4>
                          {usr.name}
                          {stateData.selectedChat.groupAdmin._id ===
                            usr._id && (
                            <span className="adminFlagStyles"> - Admin</span>
                          )}
                        </h4>
                        <h5>{usr.email}</h5>
                      </div>
                    </div>
                    <div
                      className="rightSectionGrpDelUsers"
                      onClick={() => {
                        removeUserFromGroupHandler(usr);
                      }}
                    >
                      {stateData.selectedChat.groupAdmin._id !== usr._id && (
                        <DeleteForeverRoundedIcon />
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </FlexHeightBox>

      {/* messages */}

      <div className="messagesBodyContainer">
        {!showLargeCard &&
          messages?.reverse().map((m, i) =>
            stateData.userMongoDB._id === m.sender._id ? (
              <div key={m._id}>
                <div className="chatAlignment__Right not__selectable">
                  <div className="chatSent__Right not__selectable">
                    {m.content}
                    <h6 className="momemts__TimeAgo">
                      {moment(new Date(m.createdAt)).fromNow()}
                    </h6>
                  </div>
                </div>
              </div>
            ) : (
              <div key={m._id}>
                <div className="chatAlignment__Left not__selectable">
                  <div className="chatSent__Left not__selectable">
                    {m.content}
                    <h6 className="momemts__TimeAgo">
                      {moment(new Date(m.createdAt)).fromNow()}
                    </h6>
                  </div>
                </div>
              </div>
            )
          )}
      </div>

      {/* bottom input, submit */}
      {!showLargeCard && (
        <div className="sendMessageBar">
          <div className="sendMessageBar__container">
            <div className="iconEmojiMsg">
              <img
                className="iconEmojiMsg not__selectable"
                src={stateData.userMongoDB.pic}
                alt={stateData.userMongoDB.name}
              />
            </div>
            <input
              className="messageInputBxoOvo"
              type="text"
              placeholder="Message..."
              //opens typing keyboard on load
              autoFocus="autofocus"
              onChange={typingHandler}
              // onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => sendMessageHandler(e)}
              value={newMessage}
            />
            <div
              className="iconSendMsg"
              onClick={() => sendMessageHandler({ key: "Enter" })}
            >
              <SendRoundedIcon style={{ color: "#6DB1E3" }} fontSize="large" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OneOnOneChatPage;
