import React, { useEffect } from "react";
import TopNavBar from "../UI/Components/TopNavBar";
import BottomNavBar from "../UI/Components/BottomNavBar";
import { useSelector } from "react-redux";
import SearchPage from "../UI/Components/SearchPage";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../App Redux/features/userSlice";
import BodyViewController from "../UI/Components/BodyViewController";
import Notifications from "../UI/Components/Notifications";

const ChatPage = () => {
  const stateData = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!stateData.localStoredUser) navigate("/");
  }, [stateData.localStoredUser, navigate]);

  return (
    <div>
      {stateData.bodyViewPage !== "oneOnOne" && <TopNavBar />}
      {stateData.showSearchPage && <SearchPage />}
      {!stateData.showSearchPage && <BodyViewController />}
      {stateData.bodyViewPage !== "oneOnOne" && <BottomNavBar />}
      {stateData.isNotoficationsOpen && <Notifications />}
    </div>
  );
};

export default ChatPage;
