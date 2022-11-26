import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    userMongoDB: {},
    localStoredUser: null,
    showSearchPage: false,
    bodyViewPage: "chats",
    selectedChat: "",
    chats: [],
    isNotoficationsOpen: false,
    notification: [],
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    toggleShowSearchPage: (state) => {
      state.showSearchPage = !state.showSearchPage;
    },
    setBodyViewPage: (state, action) => {
      state.bodyViewPage = action.payload;
    },
    setLocalStorageUser: (state, action) => {
      state.localStoredUser = action.payload;
    },
    setMongoDBUser: (state, action) => {
      state.userMongoDB = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    toggleNotificationsOpen: (state, action) => {
      action.payload
        ? (state.isNotoficationsOpen = action.payload)
        : (state.isNotoficationsOpen = !state.isNotoficationsOpen);
    },
    setNotifications: (state, action) => {
      state.notification.push(action.payload);
    },
    sliceNotifications: (state, action) => {
      state.notification.splice(action.payload, 1);
    },
    clearNotifications: (state) => {
      state.notification = [];
    },
  },
});

export const {
  login,
  logout,
  toggleShowSearchPage,
  setBodyViewPage,
  setLocalStorageUser,
  setMongoDBUser,
  setSelectedChat,
  setChats,
  toggleNotificationsOpen,
  setNotifications,
  sliceNotifications,
  clearNotifications,
} = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;
