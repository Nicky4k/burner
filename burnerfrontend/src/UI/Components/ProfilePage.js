import React from "react";
import "./ProfilePage.css";
import { useSelector } from "react-redux";
import {
  selectUser,
  setBodyViewPage,
} from "../../App Redux/features/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import defaultAvatar from "../../images/user-profile-avatar.png";

const ProfilePage = () => {
  const stateData = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(setBodyViewPage("chats"));
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  return (
    <div className="profilePage">
      <div className="profileImageHolder">
        <img
          loading="lazy"
          src={stateData.userMongoDB.pic || defaultAvatar}
          alt="user"
          className="imageProfilePageStyles"
        />
      </div>
      <h1 className="userNameProfilePage">{stateData.userMongoDB.name}</h1>
      <h2 className="userEmailProfilePage">
        {stateData.userMongoDB.email || stateData.localStoredUser.emailSignIn}
      </h2>
      <button onClick={logoutHandler} className="userLogout__button">
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
