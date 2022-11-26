import React, { useState } from "react";
import "./NewGroupChat.css";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  setBodyViewPage,
} from "../../App Redux/features/userSlice";
import UserAddedToGroupBadge from "./UserAddedToGroupBadge";

const NewGroupChat = () => {
  const stateData = useSelector(selectUser);
  const dispatch = useDispatch();

  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchUsersHandler = (query) => {
    setSearch(query);
    if (!query) return;

    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${stateData.userMongoDB.token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(`http://localhost:3000/api/user?search=${query}`, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        setSearchResults(JSON.parse(result));
        // console.log(searchResults);
      })
      .catch((error) => console.log("error", error));
  };

  const submitHandler = () => {
    console.log(selectedUsers.map((u) => u._id));
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${stateData.userMongoDB.token}`);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      name: groupChatName,
      users: JSON.stringify(selectedUsers.map((u) => u._id)),
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:3000/api/chat/group", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(JSON.parse(result));
        dispatch(setBodyViewPage("chats"));
      })
      .catch((error) => console.log("error", error));
  };

  const removeUsersFromGroup = (delUser) => {
    setSelectedUsers(
      selectedUsers.filter((selUsr) => selUsr._id !== delUser._id)
    );
  };

  return (
    <div className="newGroupChat">
      <div className="addGrpChat__container">
        <h2 className="addNewGroupChatHeader">Create New Group Chat </h2>
        <div className="grpInputFields">
          <input
            key="grpChtName"
            className="grpCN"
            type="name"
            placeholder="Group Chat Name"
            //opens typing keyboard on load
            autoFocus="autofocus"
            onChange={(e) => setGroupChatName(e.target.value)}
          />
          <input
            key="grpChtSrchUsrs"
            className="grpCN"
            type="name"
            placeholder="🔍 Search users"
            onChange={(e) => searchUsersHandler(e.target.value)}
          ></input>
          {selectedUsers.length > 0 && (
            <div className="selectedUsers_Tab">
              {selectedUsers?.map((user) => (
                <UserAddedToGroupBadge
                  handleDelFunc={() => {
                    removeUsersFromGroup(user);
                  }}
                  key={user._id}
                  user={user}
                />
              ))}
            </div>
          )}
          <div className="searchResultUsers">
            {searchResults?.map((usr) => (
              <div
                key={usr._id}
                className="grpChat__Container"
                onClick={() => {
                  if (selectedUsers.some((u) => u._id === usr._id)) return;

                  setSelectedUsers([usr, ...selectedUsers]);
                }}
              >
                <div className="hover__grpContainerEffect">
                  <div className="grpChatTab__picture">
                    <img
                      loading="lazy"
                      className="grpChatTab__image"
                      alt={usr.name}
                      src={usr.pic}
                    />
                  </div>
                  <div className="grpChatTab__body">
                    <h4>{usr.name}</h4>
                    <h5>{usr.email}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="grpChatSubmit grpCN"
            onClick={() => {
              submitHandler();
            }}
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewGroupChat;
