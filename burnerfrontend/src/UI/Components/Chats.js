import React, { useEffect } from "react";
import "./Chats.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  selectUser,
  setBodyViewPage,
  setChats,
  setSelectedChat,
} from "../../App Redux/features/userSlice";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import moment from "moment";

export const renderFromObject = (chat, paraFind, paraY, paraX) => {
  return !chat.isGroupChat
    ? chat.users[1]
      ? chat.users[1]._id === paraY
        ? chat.users[0][paraFind]
        : chat.users[1][paraFind]
      : chat.users[0][paraFind]
    : chat[paraX];
};

const Chats = () => {
  const stateData = useSelector(selectUser);
  const dispatch = useDispatch();

  const chats = stateData.chats;

  const fetchChats = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${stateData.userMongoDB.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("http://localhost:3000/api/chat", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        // console.log(result);
        dispatch(setChats(JSON.parse(result)));
      })
      .catch((error) => console.error("error", error));
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const oneOnOneChatOpenHandler = (chat) => {
    dispatch(setSelectedChat(chat));
    dispatch(setBodyViewPage("oneOnOne"));
  };

  return (
    <div className="chatsContainer">
      <h2 className="not__selectable">Recent Chats </h2>

      {chats.length > 1 &&
        chats.map((chat, i) => {
          return (
            <div
              key={i}
              className="chat__Container heightClipChats"
              onClick={() => oneOnOneChatOpenHandler(chat)}
            >
              <div className="hover__containerEffect">
                <div className="chatTab__picture">
                  <img
                    loading="lazy"
                    className="chatTab__image"
                    alt={renderFromObject(
                      chat,
                      "name",
                      "chatName",
                      stateData.userMongoDB._id
                    )}
                    src={
                      renderFromObject(
                        chat,
                        "pic",
                        stateData.userMongoDB._id
                      ) || `https://ui-avatars.com/api/?name=${chat.chatName}`
                    }
                  />
                </div>
                <div className="chatTab__body">
                  <div
                    className="groupLogoYorN"
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "flex-end",
                    }}
                  >
                    <div className="chatBodyTabStyles">
                      <h3>
                        {renderFromObject(
                          chat,
                          "name",
                          stateData.userMongoDB._id,
                          "chatName"
                        )}
                      </h3>
                      <div
                        className="chatBodyTabStyles"
                        style={{ paddingLeft: "0.5rem" }}
                      >
                        {chat.isGroupChat === true && (
                          <div className="groupLogo__stylesChatPage">
                            <GroupRoundedIcon fontSize="small" />
                            <p>
                              {chat?.latestMessage?.content &&
                                chat.users.length}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <h4
                    className="chatBodyTab__innerStyles"
                    style={{
                      color: `${
                        chat?.latestMessage?.content
                          ? chat?.latestMessage?.sender._id ===
                            stateData.userMongoDB._id
                            ? "black"
                            : "blue"
                          : "grey"
                      }`,
                    }}
                  >
                    {chat?.latestMessage?.content ? (
                      chat?.latestMessage?.sender._id ===
                      stateData.userMongoDB._id ? (
                        <div className="displayTimeContainer">
                          <div className="chatMessaheContainer__chatPage">
                            <>
                              <DoneRoundedIcon
                                fontSize="small"
                                sx={{ p: 0.2 }}
                              />
                              {chat?.latestMessage?.content.length > 18
                                ? `${chat?.latestMessage?.content.slice(
                                    0,
                                    18
                                  )}...`
                                : chat?.latestMessage?.content}
                            </>
                          </div>
                          <div className="displayTimeChatTab_momentsContainer">
                            {moment(
                              new Date(chat.latestMessage.createdAt)
                            ).fromNow()}
                          </div>
                        </div>
                      ) : (
                        <div className="displayTimeContainer">
                          <div className="chatMessaheContainer__chatPage">
                            {chat?.latestMessage?.content.length > 18
                              ? `${chat?.latestMessage?.content.slice(
                                  0,
                                  18
                                )}...`
                              : chat?.latestMessage?.content}
                          </div>
                          <div className="displayTimeChatTab_momentsContainer">
                            {moment(
                              new Date(chat.latestMessage.createdAt)
                            ).fromNow()}
                          </div>
                        </div>
                      )
                    ) : chat.isGroupChat === true ? (
                      `${chat.users.length} members`
                    ) : (
                      renderFromObject(chat, "email", stateData.userMongoDB._id)
                    )}
                  </h4>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Chats;
