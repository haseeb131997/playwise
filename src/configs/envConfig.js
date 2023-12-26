import { Platform, Dimensions } from "react-native";

const shadowAndroid = {
  shadowColor: "black",
  shadowOpacity: 1,
  elevation: 6,
};

const shadowIos = {
  shadowColor: "grey",
  shadowOpacity: 0.4,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
};

export const Screen = {
  height: Dimensions.get("window").height,
  width: Dimensions.get("window").width,
};

export const envConfig = {
  env: "prod",
  apiHeaddev: "https://playwisebackendtest.azurewebsites.net/api/mobile/v1",
  // apiHeaddev: "https://pw-backend-dun.vercel.app/api/mobile/v1",
  // apiHeaddev:"https://playwisebackendtest.azurewebsites.net/api/mobile/v1",
  apiHeadProd: "https://playwisebackend.azurewebsites.net/api/mobile/v1",
  secondHead: "https://pb22.herokuapp.com/api/v1/gaming",
  PlatformShadow: Platform.OS == "android" ? shadowAndroid : shadowIos,
};

export const DeepLinkHead =
  envConfig.env == "dev" ? "exp://192.168.1.5:19000/--/" : "playwise://";

const ApiHead = () => {
  return envConfig.env == "dev" ? envConfig.apiHeaddev : envConfig.apiHeadProd;
};

export const ApiCollection = {
  authController: {
    signUp: `${ApiHead()}/user/signup`,
    sendOTp: `${ApiHead()}/user/requestOtp`,
    otpVerify: `${ApiHead()}/user/verify`,
    verifyContact: `${ApiHead()}/user/verifyContact`,
    login: `${ApiHead()}/user/login`,
    resetPassword: `${ApiHead()}/user/resetpassword`, // :token
    checkOTP:`${ApiHead()}/user/checkOtp/`,
    forgetPassword: `${ApiHead()}/user/forgotPassword`,
    changePassword: `${ApiHead()}/user/changePassword`,
    socialLogin: `${ApiHead()}/user/socialLogin`,
    whatsAppLogin:`${ApiHead()}/user/otpLessLogin`,
  },

  userController: {
    checkUsername: `${ApiHead()}/user/checkUsername`,
    addUserDetails: `${ApiHead()}/user/addDetails`,
    changePassword: `${ApiHead()}/user/changePassword`,
    updateUserDetails: `${ApiHead()}/user/updateDetails`,
    followUser: `${ApiHead()}/user/follow`, //:id
    unFollowUser: `${ApiHead()}/user/unfollow`, //:id
    getUserDetails: `${ApiHead()}/user`,
    getMyProfile: `${ApiHead()}/user/me`,
    getMyPosts: `${ApiHead()}/post`,
    getMyAbout: `${ApiHead()}/user/about`,
    editBasicProfile: `${ApiHead()}/user/editProfile`,
    editWorkProfile: `${ApiHead()}/user/editWork`,
    editSystemInfo: `${ApiHead()}/user/editSystem`,
    editPref: `${ApiHead()}/user/editPreferences`,
    userSearch: `${ApiHead()}/user/search`,
    getGallery: `${ApiHead()}/user/gallery`,
    getSystemInfo: `${ApiHead()}user/system`,
    getMyBasic: `${ApiHead()}/user`, //:id/basic
    getPlayerUserInfos: `${ApiHead()}/user`, //:id/posts
    editPhone: `${ApiHead()}/user/editPhone`,
    getFollowers: `${ApiHead()}/user/followers`,
    getFollowings: `${ApiHead()}/user/followings`,
    getPendingRequests: `${ApiHead()}/user/followrequests`,
    blockUser: `${ApiHead()}/user/block`,
    unBlockUser: `${ApiHead()}/user/unblock`,
    getBlockedUsers: `${ApiHead()}/user/blockedList`,
    removeFollower: `${ApiHead()}/user/removeFollower`,
    deleteAccount: `${ApiHead()}/user/deactivateAccount`,
    editSocial: `${ApiHead()}/user/editSocial`,
    checkAuthentication: `${ApiHead()}/user/authorize`,
    editMail: `${ApiHead()}/user/changeEmail`,
  },

  postController: {
    addPost: `${ApiHead()}/post/create`,
    getTimelinePosts: `${ApiHead()}/post/timeline`,
    likePost: `${ApiHead()}/post`, //:id/like,
    getPostById: `${ApiHead()}/post`, //:id
    postCommentLike: `${ApiHead()}/post/comment`, //:id
    getPostComments: `${ApiHead()}/post/fetchComments`, //:id
    getCommentReplies: `${ApiHead()}/post/fetchNestedComments`, //:id
    addComment: `${ApiHead()}/post`, //:id/comment
    replyComment: `${ApiHead()}/post/reply`, //:id/comment reply
    updateComment: `${ApiHead()}/post`, //:id/comment
    deleteComment: `${ApiHead()}/post`, //:id/comment
    getMyDiscoverFeed: `${ApiHead()}/post/discover`,
    reportPost: `${ApiHead()}/post/report`, //:id + reason in body,
    reportUser: `${ApiHead()}/user/report`, //:id + reason in body,
    reportComment: `${ApiHead()}/post/reportComment`, //:id ?commentId=:commentId + reason in body,
    deletePost: `${ApiHead()}/post`, //:id
    editPost: `${ApiHead()}/post`, //:id
    changePostVisibility: `${ApiHead()}/post/changeVisibility`, //:id
    getLikes: `${ApiHead()}/post/fetchLikes`, //:id
    repostPost: `${ApiHead()}/post/repost`,
  },
  mediaController: {
    uploadMedia: `${ApiHead()}/upload/media`,
    uploadProfilePic: `${ApiHead()}/upload/dp`,
  },
  gamesController: {
    leaderboard: `${ApiHead()}/gaming/leaderboard`,
    getGameStats: `${ApiHead()}/gaming/player`,
    getUserGames: `${ApiHead()}/user/games`,
    getPlayerGameCreds: (userId, gameSlug) => {
      return `${ApiHead()}/user/${userId}/gameStats?game=${gameSlug}`;
    },
    getFeedTournamentDetails:`${ApiHead()}/tournament/all?page=1&limit=2`,// list of two tournaments on feed screen
    getTotalTournamentList:`${ApiHead()}/tournament/all?page=1&limit=20`,// list of all game tournaments on tournaments screen
    addGameDetails: `${ApiHead()}/user/updateDetails`, // type:"gameDetails"
    getTournamnetList: `${ApiHead()}/tournament/pc`,
    getTournamentDetails: `${ApiHead()}/tournament/tour/mobile`, //:id
    registerForTournament: `${ApiHead()}/tournament`, //:id/player
    // getPlayersDetails:`${ApiHead()}/getPlayers/63d6ab1f84d4ce5439dc6398/1`, //:players details
    getRoundNumber: `${ApiHead()}/tournament/getPlayers`, //:players details
    getPlayersDetailss:`${ApiHead()}/tournament/tour/stage`, //:players details
  },
  notificationController: {
    getNotificationList: `${ApiHead()}/user/notifications`,
    setExpoToken: `${ApiHead()}/user/setExpo`,
    accetReq: `${ApiHead()}/user/requests/accept`,
    rejectReq: `${ApiHead()}/user/requests/decline`,
    sendNotification: `${ApiHead()}/user/notify`,
    notificationListener: `${ApiHead()}/user/notificationsListener`,
  },
};

export const envConsole = (data) => {
  if (envConfig.env == "dev") {
    console.log(data);
  }
};

/**
 * Listens to the Screen width and returns the given Integer on specified screen sizes
 * use Case -  While setting margins and all dimension work for different screens
 *
 * @param number big - for big screens
 * @param number small - for small screens
 * @param number other - for other screens
 *
 * @returns number - returns the number based on the screen size
 */
export const ScreenHeightResponser = (big, small, other) => {
  if (Screen.height >= 690) {
    return big;
  } else if (Screen.height <= 600) {
    return small;
  } else {
    return other;
  }
};

/**
 * Listens to the Screen height and returns the given Integer on specified screen sizes
 * use Case -  While setting margins and all dimension work for different screens
 *
 * @param number big - for big screens
 * @param number small - for small screens
 * @param number other - for other screens
 *
 * @returns number - returns the number based on the screen size
 */
export const ScreenWidthResponser = (big, small, other) => {
  if (Screen.width >= 400) {
    return big;
  } else if (Screen.width <= 400) {
    return small;
  } else {
    return other;
  }
};

// export const themeSwitcher = (lightCSS,darkCSS) => {
//     const theme = Appearance.getColorScheme();
//     return theme === 'dark' ? darkCSS : lightCSS;
//   }