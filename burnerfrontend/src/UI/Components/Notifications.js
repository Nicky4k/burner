import React, { useEffect } from "react";
import "./Notifications.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearNotifications,
  selectUser,
  setBodyViewPage,
  setSelectedChat,
  sliceNotifications,
  toggleNotificationsOpen,
} from "../../App Redux/features/userSlice";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import ClearAllRoundedIcon from "@mui/icons-material/ClearAllRounded";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

const Notifications = () => {
  const stateData = useSelector(selectUser);
  const dispatch = useDispatch();

  const toggleNotoficationVisiblity = () => {
    dispatch(toggleNotificationsOpen());
  };

  const clearNotoficationHandler = (index) => {
    dispatch(sliceNotifications(index));
  };
  const openNotoficationHandler = (index, chat) => {
    dispatch(sliceNotifications(index));
    dispatch(setBodyViewPage("oneOnOne"));
    dispatch(setSelectedChat(chat));
    dispatch(toggleNotificationsOpen());
  };

  const swipeClearNotificationHandler = () => {
    dispatch(clearNotifications());
    dispatch(toggleNotificationsOpen());
  };

  return (
    <div className="darkBG" onClick={toggleNotoficationVisiblity}>
      <div className="centered">
        <div
          className="modal"
          onClick={() => {
            dispatch(toggleNotificationsOpen(false));
          }}
        >
          <div className="modalHeader">
            <h5 className="heading">Notifications</h5>
            {stateData.notification.length > 0 && (
              <>
                <Tooltip
                  placement="top"
                  title="Clear"
                  sx={{ cursor: "pointer" }}
                  TransitionComponent={Zoom}
                  arrow
                >
                  <ClearAllRoundedIcon
                    fontSize="large"
                    onClick={swipeClearNotificationHandler}
                  />
                </Tooltip>
              </>
            )}
            <Tooltip
              placement="top"
              title="Close"
              TransitionComponent={Zoom}
              arrow
            >
              <CancelRoundedIcon
                color="black"
                fontSize="large"
                onClick={toggleNotoficationVisiblity}
                sx={{ cursor: "pointer" }}
              />
            </Tooltip>
          </div>
          <div className="notificationStripScrollBody">
            {stateData.notification?.map((noti, index) => (
              <div
                className={
                  index % 2 == 0
                    ? "notofication__stripOdd"
                    : "notofication__stripEven"
                }
              >
                <div className="notiBoxesPic">
                  <img
                    className="notiPicStyles"
                    src={noti.sender.pic}
                    alt={noti.sender.name}
                  />
                </div>
                <div
                  className="notiBoxesBody"
                  onClick={() => openNotoficationHandler(index, noti.chat)}
                >
                  <h4>{noti.sender.name}</h4>
                  <p style={{ color: "black" }}>
                    {noti.content.length > 18
                      ? `${noti.content.slice(0, 18)}...`
                      : noti.content}
                  </p>
                </div>
                <div
                  className="notiBoxesDismiss"
                  onClick={() => clearNotoficationHandler(index)}
                >
                  <ClearRoundedIcon />
                </div>
              </div>
            ))}
            {stateData.notification.length === 0 && (
              <h4>No new notifications.</h4>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
