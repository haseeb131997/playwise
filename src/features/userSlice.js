import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: true,
  userToken: null,
  loggedIn: false,
  userId: null,
  newNotification: false,
  pushNotifications: false,
  userInfo: {
    name: null,
    profilePic: null,
    coverPic: null,
    username: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      state.userToken = action.payload.userToken;
      state.loggedIn = action.payload.loggedIn;
      state.userId = action.payload.userId;
    },

    setNewNotification: (state, action) => {
      state.newNotification = action.payload.newNotification;
    },

    setPushNotifications: (state, action) => {
      state.pushNotifications = action.payload.pushNotifications;
    },

    setUserLogOutState: (state) => {
      state.userToken = null;
      state.loggedIn = false;
      state.userId = null;
      state.newNotification = false;
      state.pushNotifications = false;
      state.userInfo = {
        name: null,
        profilePic: null,
        coverPic: null,
        username: null,
      };
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload.userInfo;
    },
    toggleDarkMode: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const {
  setActiveUser,
  setUserLogOutState,
  setPushNotifications,
  setNewNotification,
  setUserInfo,
  toggleDarkMode,
} = userSlice.actions;
export const selectUserToken = (state) => state.user.userToken;
export const selectLoggedIN = (state) => state.user.loggedIn;
export const selectUserId = (state) => state.user.userId;
export const selectNewNotification = (state) => state.user.newNotification;
export const selectPushNotifications = (state) => state.user.pushNotifications;
export const selectUserInfo = (state) => state.user.userInfo;
export const selectDarkMode = (state) => state.user.mode;
export default userSlice.reducer;
