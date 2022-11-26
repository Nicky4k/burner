import React, { useState } from "react";
import "./SearchPage.css";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../../App Redux/features/userSlice";
import SearchresultsChatTabView from "./SearchresultsChatTabView";

const SearchPage = () => {
  const stateData = useSelector(selectUser);
  const [searchString, setSearchString] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchUserHandler = async () => {
    if (!searchString) {
      console.error("Invalid search string");
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${stateData.userMongoDB.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/user?search=${searchString}`,
        config
      );

      setSearchResults([]);
      setSearchResults(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="searchPage">
      <div className="searchComponent">
        <div className="searchPage__container">
          <input
            className="searchPage__searchBox"
            type="text"
            placeholder="Search"
            //opens typing keyboard on load
            autoFocus="autofocus"
            onChange={(e) => {
              setSearchString(e.target.value);
            }}
          />
        </div>
        <div onClick={searchUserHandler} className="searchButton__searchPage">
          <SearchRoundedIcon sx={{ color: "black", fontSize: 30 }} />
        </div>
      </div>
      <div className="bodyView_hrLineB"></div>
      <div className="results__usersTabBody">
        {searchResults.length === 0 && (
          <h4 key="default_SEU" className="defaultSearch__message">
            search existing users
          </h4>
        )}
        {searchResults?.map((el) => (
          <SearchresultsChatTabView
            key={el._id}
            props={{ name: el.name, email: el.email, pic: el.pic, id: el._id }}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
