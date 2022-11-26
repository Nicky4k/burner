import React from "react";
import "./BottomNavBar.css";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import { useDispatch } from "react-redux";
import {
  selectUser,
  setBodyViewPage,
} from "../../App Redux/features/userSlice";
import { useSelector } from "react-redux";
import styled from "styled-components";

const BottomNavBar = () => {
  const stateData = useSelector(selectUser);

  const WrapperA = styled.section`
    padding: 0 0.5rem;
    border-radius: 1rem;
    color: ${stateData.bodyViewPage === "chats" ? "#427eff" : "white"};
  `;
  const WrapperB = styled.section`
    padding: 0 0.5rem;
    border-radius: 1rem;
    color: ${stateData.bodyViewPage === "newGroupChat" ? "#427eff" : "white"};
  `;
  const WrapperC = styled.section`
    padding: 0 0.5rem;
    border-radius: 1rem;
    color: ${stateData.bodyViewPage === "profile" ? "#427eff" : "white"};
  `;

  const dispatch = useDispatch();

  const setBodyViewPageChat = () => {
    dispatch(setBodyViewPage("chats"));
  };
  const setBodyViewPageNewGroupChat = () => {
    dispatch(setBodyViewPage("newGroupChat"));
  };
  const setBodyViewPageProfile = () => {
    dispatch(setBodyViewPage("profile"));
  };

  return (
    <div className="bottomNavBar">
      <div className="bottomNav__container">
        <div className="iconPack_btmNav" onClick={setBodyViewPageChat}>
          <EmailRoundedIcon />
          <WrapperA>
            <h4 className="not__selectable">Chats</h4>
          </WrapperA>
        </div>
        <div className="iconPack_btmNav" onClick={setBodyViewPageNewGroupChat}>
          <GroupAddRoundedIcon />
          <WrapperB>
            <h4 className="not__selectable">New</h4>
          </WrapperB>
        </div>
        <div className="iconPack_btmNav" onClick={setBodyViewPageProfile}>
          <img
            className="bottomNav__userProfilePic not__selectable"
            src={stateData.userMongoDB.pic}
            alt={stateData.userMongoDB.name}
          />
          <WrapperC>
            <h4 className="not__selectable">Profile</h4>
          </WrapperC>
        </div>
      </div>
    </div>
  );
};

export default BottomNavBar;
