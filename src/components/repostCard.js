import React, { createRef, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Share,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
  Linking,
  Platform,
  ActivityIndicator,
} from "react-native";
import { envConfig, ScreenWidthResponser } from "../configs/envConfig";
import { Colors, getDarkTheme, getLightTheme } from "../utils/colors";
import Entypo from "@expo/vector-icons/Entypo";
import IonIcons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Routes } from "../utils/routes";
import { BottomSheet } from "./BottomSheet";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { ApiCollection } from "../configs/envConfig";
import { DarkModeStatus, UserId, UserToken } from "../app/useStore";
import LoaderPng from "../../assets/loader.png";
import LoadingModal from "./loadingModal";
import { CustomIcon } from "./customIconPack";
import VideoPlayer from "./VideoPlayer";
import DoubleClick from "react-native-double-tap";
import DoubleClickAnimated from "react-native-double-click-instagram";
import { showCutomizedToast } from "./customToast";
import PostCard from "./postCard";

export default function RePostCard(props) {
  const OptionsBottomSheetRef = createRef();
  const navigation = useNavigation();

  const mode = DarkModeStatus();

  const propPostData = props.post;
  const basePost = propPostData.postId;

  const shareBottomSheetRef = createRef();

  const [isLiked, setIsLiked] = useState(propPostData.isLiked);
  const [likeCount, setLikeCount] = useState(propPostData.likeCount);
  const [isFollowing, setIsFollowing] = useState(propPostData.isFollowing);
  const [postVisibity, setPostVisibility] = useState(propPostData.visibility);
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [fullCaptionHidden, setFullCaptionHidden] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(1);

  const [modalVisible, setModalVisible] = useState(false);
  const [task, setTask] = useState("Loading....");
  const [sheetMode, setSheetMode] = useState("options");
  const [reportType, setReportType] = useState(null);

  const token = UserToken();
  const currentUserId = UserId();

  const postId = propPostData._id;

  var lastTap = null;

  const likePost = async () => {
    if (isLiked && likeCount > 0) {
      setIsLiked(false);
      setLikeCount(likeCount - 1);
      await axios.put(
        `${ApiCollection.postController.likePost}/${postId}/like`,
        {},
        { headers: { Authorization: "Bearer " + token } }
      );
    } else {
      setIsLiked(true);
      setLikeCount(likeCount + 1);
      await axios.put(
        `${ApiCollection.postController.likePost}/${postId}/like`,
        {},
        { headers: { Authorization: "Bearer " + token } }
      );
    }
  };

  const doubleTapLike = async () => {
    if (isLiked == false && likeCount >= 0) {
      setIsLiked(true);
      setLikeCount(likeCount + 1);
      await axios.put(
        `${ApiCollection.postController.likePost}/${postId}/like`,
        {},
        { headers: { Authorization: "Bearer " + token } }
      );
    }
  };

  const changeCrousalDots = (event) => {
    const currentImageIndexLocal = Math.ceil(
      event.nativeEvent.contentOffset.x /
        event.nativeEvent.layoutMeasurement.width
    );
    if (currentImageIndexLocal <= 0) {
      setCurrentImageIndex(1);
    } else {
      setCurrentImageIndex(currentImageIndexLocal);
    }
  };

  const changePostVisibity = async () => {
    setVisibilityLoading(true);
    console.log(postId);

    let body = postVisibity == "public" ? "followers" : "public";

    await axios
      .patch(
        `${ApiCollection.postController.changePostVisibility}/${postId}`,
        { visibility: `${body}` },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((response) => {
        if (postVisibity == "public") {
          setPostVisibility("followers");
        }
        if (postVisibity == "followers") {
          setPostVisibility("public");
        }
        setVisibilityLoading(false);
      })
      .catch((error) => {
        setVisibilityLoading(false);
        Alert.alert(
          "Error",
          error.response.data.message
            ? error.response.data.message
            : `Post visibility could not be changed | Something went wrong`
        );
      });
  };

  const openComments = () => {
    navigation.push(Routes.tabBarHiddenScreens.postStack.tag, {
      target: Routes.tabBarHiddenScreens.postStack.commentScreen,
      postId: postId,
    });
  };

  const openLikes = () => {
    navigation.push(Routes.tabBarHiddenScreens.postStack.tag, {
      target: Routes.tabBarHiddenScreens.postStack.postLikes,
      postId: postId,
    });
  };

  function findHashtags(searchText) {
    var regexp = /\B\#\w\w+\b/g;
    let result = searchText.match(regexp);
    return result ? result : [];
  }

  function findUsername(searchText) {
    var regexp = /\B\@\w\w+\b/g;
    let result = searchText.match(regexp);
    return result ? result : [];
  }

  const captionParser = (postCaption) => {
    let fromattedCaption = postCaption.split("#")[0];
    let hashtags = `${findHashtags(postCaption)}`;
    let usernames = `${findUsername(postCaption)}`;

    const caption = {
      caption: fromattedCaption,
      hashtags: hashtags,
      usernames: usernames,
    };
    return caption;
  };

  const openUserProfile = () => {
    navigation.navigate(Routes.tabBarHiddenScreens.playerStack.tag, {
      userId: propPostData.userId._id,
    });
  };

  const closeSheet = () => {
    setSheetMode("options");
    setReportType(null);
    OptionsBottomSheetRef.current.close();
  };

  const report = async (reason) => {
    setTask("Reporting...");
    setModalVisible(true);
    closeSheet();

    const url =
      reportType == "post"
        ? `${ApiCollection.postController.reportPost}/${postId}`
        : `${ApiCollection.postController.reportUser}/${propPostData.user._id}`;

    await axios
      .post(
        url,
        { reason: reason },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((response) => {
        showCutomizedToast(
          `${
            reportType == "post" ? "Post" : propPostData.username
          } reported successfully,\nour team will review it and take appropriate action`,
          "success"
        );
        setModalVisible(false);
      })
      .catch((error) => {
        showCutomizedToast(
          error.response.data.message
            ? error.response.data.message
            : `${reportType} could not be reported | Something went wrong`,
          "error"
        );
        setModalVisible(false);
      });
  };

  const showDeleteAlert = () =>
    Alert.alert(
      "Delete Post !",
      "Are you sure you want to delete this post ?",
      [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        { text: "Delete", onPress: () => deletePost(), style: "destructive" },
      ],
      { cancelable: true, onDismiss: () => null }
    );

  // Author / Creator Only option
  const deletePost = async () => {
    OptionsBottomSheetRef?.current?.close();
    setTask("Deleting...");
    setModalVisible(true);

    await axios
      .delete(`${ApiCollection.postController.deletePost}/${postId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        propPostData.onDelete();
        showCutomizedToast("Post deleted successfully", "success");
        setModalVisible(false);
        //navigation.navigate(Routes.tabBarHiddenScreens.homeStack.tag)
      })
      .catch((error) => {
        showCutomizedToast(
          error.response.data.message
            ? error.response.data.message
            : "Post could not be deleted | Something went wrong",
          "error"
        );
        setModalVisible(false);
      });
  };

  const editPostHandler = () => {
    OptionsBottomSheetRef.current.close();
    navigation.push(Routes.tabBarHiddenScreens.postStack.tag, {
      postId: postId,
      target: Routes.tabBarHiddenScreens.postStack.editPostScreen,
    });
  };

  let sharePostHandler = async () => {
    try {
      const result = await Share.share({
        message: `https://www.playwise.gg/\n`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const followUser = async () => {
    if (isFollowing == false) {
      setFollowLoading(true);
      await axios
        .put(
          `${ApiCollection.userController.followUser}/${propPostData.user._id}`,
          {},
          { headers: { Authorization: "Bearer " + token } }
        )
        .then((response) => {
          setFollowLoading(false);
          setIsFollowing(true);
          showCutomizedToast("User followed successfully", "success");
        })
        .catch((error) => {
          setFollowLoading(false);
          showCutomizedToast(
            error.response.data.message
              ? error.response.data.message
              : "User could not be followed | Something went wrong",
            "error"
          );
        });
    }
  };

  const blockUser = async () => {
    setTask("Blocking...");
    setModalVisible(true);
    closeSheet();
    await axios
      .patch(
        `${ApiCollection.userController.blockUser}/${propPostData.user._id}`,
        {},
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((response) => {
        showCutomizedToast("User blocked successfully", "success");
        setModalVisible(false);
      })
      .catch((error) => {
        showCutomizedToast(
          error.response.data.message
            ? error.response.data.message
            : "User could not be blocked | Something went wrong",
          "error"
        );
        setModalVisible(false);
      });
  };

  const openUserDetailsByName = (userName) => {
    navigation.navigate(Routes.tabBarHiddenScreens.playerStack.tag, {
      userName: userName,
    });
  };

  return (
    propPostData !== null && (
      <DoubleClickAnimated
        containerStyle={{ justifyContent: "center", alignItems: "center" }}
        icon
        delay={200}
        size={100}
        timeout={800}
        color={"red"}
        doubleClick={doubleTapLike}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: mode
                ? getDarkTheme.backgroundColor
                : getLightTheme.backgroundColor,
            },
          ]}
        >
          <View style={{ width: "100%", padding: 15, marginBottom: 10 }}>
            <View style={[styles.subHeader]}>
              <TouchableOpacity
                onPress={() => props.redirectUser && openUserProfile()}
                activeOpacity={1}
                style={styles.userHolder}
              >
                <Image
                  style={{
                    resizeMode: "cover",
                    width: 45,
                    height: 45,
                    borderRadius: 50,
                  }}
                  source={{ uri: propPostData.userId.profilePic }}
                />
                <View
                  style={{
                    width: 120,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      color: mode ? getDarkTheme.color : getLightTheme.color,
                      width: "100%",
                    }}
                  >
                    {propPostData.userId.username}
                  </Text>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{
                      fontSize: 11,
                      color: mode ? getDarkTheme.color : getLightTheme.color,
                      paddingTop: 2,
                    }}
                  >
                    {moment(propPostData.createdAt).fromNow()}
                  </Text>
                </View>
              </TouchableOpacity>

              <View
                style={{
                  flex: 3,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                {propPostData.userId._id != currentUserId &&
                isFollowing == false ? (
                  !followLoading ? (
                    <TouchableOpacity
                      onPress={followUser}
                      style={[styles.followButton]}
                    >
                      <CustomIcon name="follow" size={20} active={true} />
                      <Text style={{ color: Colors.primary, marginLeft: 5 }}>
                        Follow
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={[styles.followButton]}>
                      <ActivityIndicator size={20} color={Colors.primary} />
                    </View>
                  )
                ) : (
                  <></>
                )}
                {propPostData.userId._id == currentUserId && (
                  <TouchableOpacity
                    onPress={changePostVisibity}
                    style={{
                      padding: 7,
                      marginRight: 15,
                      borderRadius: 5,
                      marginTop: -10,
                    }}
                  >
                    {!visibilityLoading ? (
                      postVisibity == "public" ? (
                        <Entypo name="globe" size={24} color={Colors.primary} />
                      ) : (
                        <IonIcons
                          name="people"
                          size={24}
                          color={Colors.primary}
                        />
                      )
                    ) : (
                      <ActivityIndicator
                        size={"small"}
                        color={Colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => {
                    OptionsBottomSheetRef.current.open();
                  }}
                  style={{ marginRight: 10 }}
                >
                  <CustomIcon
                    name="options"
                    size={20}
                    active={true}
                    style={{ marginTop: -10, marginRight: 5 }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                width: "100%",
                flexWrap: "wrap",
                marginTop: propPostData.caption == "" ? 0 : 15,
              }}
            >
              {propPostData.caption.split(" ").map((word, index) => {
                if (word.split("@").length > 1) {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={{ marginBottom: 2 }}
                      onPress={() => openUserDetailsByName(word.split("@")[1])}
                    >
                      <Text
                        style={{ fontWeight: "700", color: Colors.primary }}
                      >{`@${word.split("@")[1]} `}</Text>
                    </TouchableOpacity>
                  );
                } else if (word.split("#").length > 1) {
                  return <Text key={index}></Text>;
                } else if (/\r|\n/.exec(word)) {
                  return <Text key={index}>{""}</Text>;
                } else {
                  return (
                    <Text
                      key={index}
                      style={{
                        marginBottom: 2,
                        color: mode ? getDarkTheme.color : getLightTheme.color,
                      }}
                    >{`${word} `}</Text>
                  );
                }
              })}
            </View>
          </View>

          <PostCard
            post={basePost}
            visibility={basePost.visibility}
            postId={basePost._id}
            views={basePost.views}
            caption={basePost.caption}
            commentCount={basePost.comments}
            likeCount={basePost.likeCount}
            navigation={navigation}
            mediaType={
              basePost.mediaType ? basePost.mediaType : basePost.typeOfPost
            }
            media={basePost.media}
            username={basePost.userId.username}
            userId={basePost.userId._id}
            user={basePost.userId}
            profilePic={basePost.userId.profilePic}
            createdAt={basePost.createdAt}
            isLiked={basePost.isLiked}
            showFollow={!basePost.isFollowing}
            isFollowing={basePost.isFollowing}
            showFooter={false}
            redirectUser={true}
            onDelete={null}
          />

          {props.showFooter && (
            <View style={styles.footer}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={likePost}
                style={styles.likeButton}
              >
                <View
                  style={{
                    backgroundColor: Colors.primary,
                    padding: 10,
                    paddingRight: 15,
                    flexDirection: "row",
                    alignItems: "center",
                    borderBottomRightRadius: 10,
                  }}
                >
                  <AntDesign
                    name={isLiked ? "heart" : "hearto"}
                    size={22}
                    color={"white"}
                  />
                  {likeCount > 0 ? (
                    <TouchableOpacity onPress={openLikes}>
                      <Text style={{ marginLeft: 5, color: "white" }}>
                        {likeCount} {likeCount > 1 ? "Likes" : "Like"}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={{ marginLeft: 5, color: "white" }}>
                      {likeCount} {likeCount > 1 ? "Likes" : "Like"}
                    </Text>
                  )}
                </View>
                <View style={styles.likeTriangleCorner}></View>
              </TouchableOpacity>

              <TouchableOpacity onPress={openComments} style={styles.comment}>
                <CustomIcon name="comment" active={false} size={20} />
                <Text
                  style={{
                    marginLeft: 7,
                    color: mode ? getDarkTheme.color : getLightTheme.color,
                  }}
                >
                  Comment
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => shareBottomSheetRef.current.open()}
                style={styles.comment}
              >
                <CustomIcon name="share" active={false} size={20} />
                <Text
                  style={{
                    marginLeft: 6,
                    color: mode ? getDarkTheme.color : getLightTheme.color,
                  }}
                >
                  Share
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <BottomSheet
          modeType={mode}
            ref={OptionsBottomSheetRef}
            height={350}
            heading={sheetMode == "options" ? "Options" : "Reason for report"}
            
          >
            {propPostData.userId._id !== currentUserId &&
              sheetMode == "options" && (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setReportType("post");
                      setSheetMode("reason");
                    }}
                    style={{ padding: 5, width: "100%", paddingVertical: 10 ,}}
                  >
                    <Text style={{ fontSize: 16 }}>Report Post</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setReportType("user");
                      setSheetMode("reason");
                    }}
                    style={{ padding: 5, width: "100%", paddingVertical: 10 }}
                  >
                    <Text style={{ fontSize: 16 }}>Report User</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      blockUser();
                    }}
                    style={{ padding: 5, width: "100%", paddingVertical: 10 }}
                  >
                    <Text style={{ fontSize: 16 }}>Block User</Text>
                  </TouchableOpacity>
                </>
              )}

            {propPostData.userId._id !== currentUserId &&
              sheetMode == "reason" && (
                <>
                  <TouchableOpacity
                    onPress={() => report("Nudity")}
                    style={{ padding: 5, width: "100%", paddingVertical: 10 }}
                  >
                    <Text style={{ fontSize: 16 }}>Nudity</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => report("Harrasment")}
                    style={{ padding: 5, width: "100%", paddingVertical: 10 }}
                  >
                    <Text style={{ fontSize: 16 }}>Harrasment</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => report("Voilence")}
                    style={{ padding: 5, width: "100%", paddingVertical: 10 }}
                  >
                    <Text style={{ fontSize: 16 }}>Voilence</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => report("Other")}
                    style={{ padding: 5, width: "100%", paddingVertical: 10 }}
                  >
                    <Text style={{ fontSize: 16 }}>Other</Text>
                  </TouchableOpacity>
                </>
              )}

            {propPostData.userId._id == currentUserId && (
              <>
                <TouchableOpacity
                  onPress={editPostHandler}
                  style={{ padding: 5, width: "100%", paddingVertical: 10 }}
                >
                  <Text style={{ fontSize: 16 }}>Edit Post</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={showDeleteAlert}
                  style={{ padding: 5, width: "100%", paddingVertical: 10 }}
                >
                  <Text style={{ fontSize: 16 }}>Delete Post</Text>
                </TouchableOpacity>
              </>
            )}
          </BottomSheet>

          <BottomSheet
            modeType={mode}
            ref={shareBottomSheetRef}
            height={350}
            heading={"Share Post"}
          >
            <TouchableOpacity
              onPress={sharePostHandler}
              style={{ padding: 5, width: "100%", paddingVertical: 10 }}
            >
              <Text style={{ fontSize: 16 }}>Share post</Text>
            </TouchableOpacity>
          </BottomSheet>
        </View>
      </DoubleClickAnimated>
    )
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop:10,
    width: Dimensions.get("screen").width - 30,
    marginBottom: 15,
    borderRadius: 10,
    flexDirection: "column",
    borderWidth: 0.2,
    borderColor: "lightgrey",
    borderColor: Colors.primary,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  subHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  userHolder: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "50%",
  },
  followButton: {
    width: 80,
    padding: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: -10,
  },
  footer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    overflow: "hidden",
  },

  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    marginRight: 40,
  },

  comment: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },

  likeTriangleCorner: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 0,
    borderRightWidth: 35,
    borderTopWidth: 42.5,
    marginRight: 10,
    borderRightColor: "transparent",
    borderTopColor: Colors.primary,
    position: "absolute",
    right: -40,
    zIndex: -10,
    //borderTopColor:'blue',
  },

  headerTriangleCorner: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 0,
    borderRightWidth: 35,
    borderTopWidth: Platform.OS == "android" ? 47 : 44,
    marginRight: 10,
    borderRightColor: "transparent",

    position: "absolute",
    right: ScreenWidthResponser(-25, -36, 10),
    // ----- Debug Values
    // borderTopColor:'blue',
    // zIndex:10,

    // ----- Prod Values
    zIndex: -10,
    borderTopColor: Colors.primary,
  },

  footerBody: {
    backgroundColor: "black",
    padding: 10,
    paddingVertical: 15,
  },

  bodyContent: {
    width: "100%",
    padding: 5,
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  video: {
    alignSelf: "center",
    width: 320,
    height: 200,
  },
});
