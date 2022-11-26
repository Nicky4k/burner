import React from "react";
import "./SearchresultsChatTabView.css";
import { useSelector } from "react-redux";
import {
  selectUser,
  setBodyViewPage,
  setChats,
  setSelectedChat,
  toggleShowSearchPage,
} from "../../App Redux/features/userSlice";
import { useDispatch } from "react-redux";

const SearchresultsChatTabView = ({ props }) => {
  const stateData = useSelector(selectUser);
  const dispatch = useDispatch();

  const userid = props.id;
  const chats = stateData.chats;

  const openChatHandler = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${stateData.userMongoDB.token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      userId: userid,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:3000/api/chat", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        if (!chats.find((c) => c._id === JSON.parse(result)._id))
          dispatch(setChats([JSON.parse(result), ...chats]));
        dispatch(setSelectedChat(JSON.parse(result)));
        dispatch(toggleShowSearchPage());
        dispatch(setBodyViewPage("chats"));
      })
      .catch((error) => console.error("error", error));
  };
  return (
    <div
      key={props.id}
      className="searchresultsChatTabView"
      onClick={openChatHandler}
    >
      <div className="chat__Container">
        <div className="hover__containerEffect">
          <div className="chatTab__picture">
            <img
              loading="lazy"
              className="chatTab__image"
              alt={props.name}
              src={props.pic}
            />
          </div>
          <div className="chatTab__body">
            <h3>{props.name}</h3>
            <h4>{props.email}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchresultsChatTabView;
