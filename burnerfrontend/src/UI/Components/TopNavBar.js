import React, { useEffect, useState } from "react";
import burnerLogoPng from "../../images/burnerLogo.png";
import "./TopNavBar.css";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import Badge from "@mui/material/Badge";
import { useDispatch } from "react-redux";
import {
  setNotifications,
  toggleNotificationsOpen,
  toggleShowSearchPage,
} from "../../App Redux/features/userSlice";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
import { useSelector } from "react-redux";
import { selectUser } from "../../App Redux/features/userSlice";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket;

const TopNavBar = () => {
  const dispatch = useDispatch();
  const stateData = useSelector(selectUser);

  const searchHandler = () => {
    dispatch(toggleShowSearchPage());
  };

  const openNotificationsHandler = () => {
    dispatch(toggleNotificationsOpen());
  };

  const [iconName, setIconName] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", stateData.userMongoDB);
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (stateData.notification.includes(newMessageRecieved)) return;
      dispatch(setNotifications(newMessageRecieved));
    });
  });

  useEffect(() => {
    setIconName(stateData.showSearchPage);
  }, [stateData.showSearchPage]);

  return (
    <div className="topNavBar">
      <div className="topNavBar__container not__selectable">
        <div className="iconPack_btmNav " onClick={searchHandler}>
          {!iconName && (
            <PersonSearchRoundedIcon sx={{ color: "white", fontSize: 30 }} />
          )}
          {iconName && (
            <ArrowBackRoundedIcon sx={{ color: "white", fontSize: 30 }} />
          )}
        </div>
        <div className="logoContainer not__selectable ">
          <img
            loading="lazy"
            className="mainLogoBurner"
            src={burnerLogoPng}
            alt="burner"
          />
          <h1 className="mainLogoText newColor not__selectable">Burner</h1>
        </div>
        <div className="iconPack_btmNav not__selectable">
          <Badge
            onClick={openNotificationsHandler}
            badgeContent={stateData.notification?.length}
            max={10}
            sx={{
              "& .MuiBadge-badge": {
                color: "black",
                backgroundColor: "#bbffd3",
              },
            }}
          >
            <NotificationsRoundedIcon sx={{ color: "white", fontSize: 30 }} />
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default TopNavBar;
