import React from "react";
import "./BodyViewController.css";
import Chats from "./Chats";
import NewGroupChat from "./NewGroupChat";
import ProfilePage from "./ProfilePage";
import { useSelector } from "react-redux";
import { selectUser } from "../../App Redux/features/userSlice";
import OneOnOneChatPage from "../OneOnOneChatPage";

const BodyViewController = () => {
  const stateData = useSelector(selectUser);

  return (
    <div className="bodyViewController">
      {stateData.bodyViewPage !== "oneOnOne" && (
        <div className="bodyView_hrLine"></div>
      )}
      <div className="bodyContainer__box">
        {stateData.bodyViewPage === "chats" && <Chats />}
        {stateData.bodyViewPage === "oneOnOne" && <OneOnOneChatPage />}
        {stateData.bodyViewPage === "newGroupChat" && <NewGroupChat />}
        {stateData.bodyViewPage === "profile" && <ProfilePage />}
      </div>
    </div>
  );
};

export default BodyViewController;
