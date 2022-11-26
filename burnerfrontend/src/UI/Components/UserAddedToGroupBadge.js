import React from "react";
import "./UserAddedToGroupBadge.css";

const UserAddedToGroupBadge = ({ user, handleDelFunc }) => {
  return (
    <div className="userAddedToGroupBadge" onClick={handleDelFunc}>
      <div className="selectedUser__diplayContainer">
        <img
          loading="lazy"
          className="grpChatSelected__image"
          alt={user.name}
          src={user.pic}
        />
        <span className="tooltiptext">Ⅹ</span>
      </div>
    </div>
  );
};

export default UserAddedToGroupBadge;
