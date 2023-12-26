import React, { createRef, useState, useRef, useEffect } from "react";
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
import {
  DeepLinkHead,
  envConfig,
  Screen,
  ScreenWidthResponser,
} from "../configs/envConfig";
import { Colors, getDarkTheme, getLightTheme } from "../utils/colors";
import Entypo from "@expo/vector-icons/Entypo";
import IonIcons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Routes } from "../utils/routes";
import { BottomSheet } from "./BottomSheet";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import { Link, useNavigation } from "@react-navigation/native";
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
import RePostCard from "./repostCard";

export default function PostCard(props) {
  const OptionsBottomSheetRef = createRef();
  const shareBottomSheetRef = createRef();
  const navigation = useNavigation();

  const mode = DarkModeStatus();

  // useEffect(()=>{

  // },[])

  const [isLiked, setIsLiked] = useState(props.isLiked);
  const [likeCount, setLikeCount] = useState(props.likeCount);
  const [isFollowing, setIsFollowing] = useState(props.isFollowing);
  const [postVisibity, setPostVisibility] = useState(props.visibility);
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

  const postId = props.postId;

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
      userId: props.user._id,
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
        : `${ApiCollection.postController.reportUser}/${props.user._id}`;

    await axios
      .post(
        url,
        { reason: reason },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((response) => {
        showCutomizedToast(
          `${
            reportType == "post" ? "Post" : props.username
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
        props.onDelete();
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
    // const myUrlWithParams = new URL(`${DeepLinkHead}sharedPostView`);
    // myUrlWithParams.searchParams.append("postid", postId);
    // const deepLink = myUrlWithParams

    const shareUrl = `https://playwise.web.app/?type=post#${postId}`;
    console.log(shareUrl);

    try {
      const result = await Share.share({
        message: `${shareUrl}/\n`,
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
          `${ApiCollection.userController.followUser}/${props.user._id}`,
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

  const changePostVisibity = async () => {
    setVisibilityLoading(true);

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

  const blockUser = async () => {
    setTask("Blocking...");
    setModalVisible(true);
    closeSheet();
    await axios
      .patch(
        `${ApiCollection.userController.blockUser}/${props.user._id}`,
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

  const openRepostScreen = () => {
    OptionsBottomSheetRef.current.close();
    //Alert.alert('Repost','Under development !',)

    navigation.navigate(Routes.tabBarHiddenScreens.postStack.tag, {
      target: Routes.tabBarHiddenScreens.postStack.repostScreen,
      postId: postId,
    });
  };

  const singleTapHandler = () => {
    const postData = {
      postId: postId,
      caption: props.caption,
      commentCount: props.commentCount,
      isLiked: isLiked,
      likeCount: likeCount,
      media: props.media,
      mediaType: props.mediaType,
      user: props.user,
      createdAt: props.createdAt,
      views: props.views,
    };

    navigation.push(Routes.tabBarHiddenScreens.postStack.tag, {
      target: Routes.tabBarHiddenScreens.postStack.fullScreenView,
      postData: postData,
    });
  };

  const expandText = () => {
    setFullCaptionHidden(!fullCaptionHidden);
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

  return props.user !== null && props.post.type !== "repost" ? (
    <View
      style={[
        styles.card,
        props.showFooter && { marginBottom: 15 },
        props.showFooter == false && {
          borderColor: Colors.primary,
          borderRightWidth: 0,
          borderLeftWidth: 0,
          borderBottomWidth: 0,
          borderTopWidth: 1.5,
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        },
      ]}
    >
      <View
        style={{
          width: "100%",
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        }}
      >
        <View style={[styles.subHeader, mode ? getDarkTheme : getLightTheme]}>
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.userHolder, mode ? getDarkTheme : getLightTheme]}
            onPress={() => props.redirectUser && openUserProfile()}
          >
            <Image
              style={{
                resizeMode: "cover",
                width: 45,
                height: 45,
                borderRadius: 50,
              }}
              source={{ uri: props.profilePic }}
            />
            <View
              style={[
                {
                  width: 120,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  justifyContent: "center",
                  alignItems: "flex-start",
                },
                { color: mode ? getDarkTheme.color : getLightTheme.color },
              ]}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  { fontSize: 15, fontWeight: "700", width: "100%" },
                  { color: mode ? getDarkTheme.color : getLightTheme.color },
                ]}
              >
                {props.username}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  { fontSize: 11, paddingTop: 2 },
                  { color: mode ? getDarkTheme.color : getLightTheme.color },
                ]}
              >
                {moment(props.createdAt).fromNow()}
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
            {props.user._id != currentUserId && isFollowing == false ? (
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
            {props.post.type == "post" && props.user._id == currentUserId && (
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
                    <IonIcons name="people" size={24} color={Colors.primary} />
                  )
                ) : (
                  <ActivityIndicator size={"small"} color={Colors.primary} />
                )}
              </TouchableOpacity>
            )}
            {props.post.type == "post" && (
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
            )}
          </View>
        </View>

        {props.captionInput && (props.captionInput)}
        
        {
          props.media.length !== 0 && (
          <View
            style={{
              width: "90%",
              paddingHorizontal: 10,
              marginBottom: 20,
            }}
          >
            {/* <Text numberOfLines={undefined} ellipsizeMode='tail'>{props.caption}</Text> */}

            <Text
              style={[
                { width: "100%" },
                { color: mode ? getDarkTheme.color : getLightTheme.color },
              ]}
              numberOfLines={fullCaptionHidden ? undefined : 4}
            >
              {props.caption.split(" ").map((word, index) => {
                if (word.split("@").length > 1) {
                  return (
                    <TouchableWithoutFeedback
                      key={index}
                      style={{ marginBottom: 2 }}
                      onPress={() => openUserDetailsByName(word.split("@")[1])}
                    >
                      <Text
                        style={{
                          fontWeight: "700",
                          color: Colors.primary,
                        }}
                      >{`@${word.split("@")[1]} `}</Text>
                    </TouchableWithoutFeedback>
                  );
                } else if (word.split("#").length > 1) {
                  return (
                    <Text
                      key={index}
                      style={{
                        fontWeight: "700",
                        color: mode ? "white" : Colors.primary,
                      }}
                    >{`#${word.split("#")[1]} `}</Text>
                  );
                }
                // else if(word?.match(/\bhttps?:\/\/\S+/gi)?.length > 0){
                //   return(
                //     <TouchableWithoutFeedback key={index} style={{ marginBottom: 2 }}
                //       onPress={() => Linking.openURL(word?.match(/\bhttps?:\/\/\S+/gi)[0])}>
                //       <Text style={{ fontWeight: "700", color: Colors.primary,}}
                //       >{`${word?.match(/\bhttps?:\/\/\S+/gi)[0]}`}</Text>
                //     </TouchableWithoutFeedback>
                //     )
                // }
                
                else if (/\r|\n/.exec(word)) {
                  return (
                    <Text
                      style={{
                        fontWeight: "700",
                        color: mode ? "white" : Colors.primary,
                      }}
                      key={index}
                    >{`${word} `}</Text>
                  );
                } else {
                  return `${word} `;
                }
              })}
            </Text>

            {props.caption.split(" ").length > 15 && (
              <TouchableOpacity
                onPress={expandText}
                style={{
                  marginTop: 10,
                  backgroundColor: mode
                    ? getDarkTheme.backgroundColor
                    : getLightTheme.backgroundColor,
                }}
              >
                <Text
                  style={{
                    color: mode ? "white" : Colors.primary,
                    textDecorationLine: "underline",
                    fontWeight: "bold",
                  }}
                >
                  {fullCaptionHidden ? "Show Less" : "Read more"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <View
        style={{
          width: "100%",
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        }}
      >
        {props.media.length !== 0 ? (
          <>
            <ScrollView
              scrollEventThrottle={16}
              onScroll={(event) => {
                changeCrousalDots(event);
              }}
              scrollEnabled={props.media.length > 1}
              snapToInterval={styles.card.width}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              contentContainerStyle={{
                flexDirection: "row",
                backgroundColor: "transparent",
              }}
            >
              {props.post.type == "post"
                ? props.media.map((item, index) => (
                    <DoubleClickAnimated
                      icon
                      key={index}
                      delay={200}
                      size={100}
                      timeout={800}
                      color={"red"}
                      doubleClick={doubleTapLike}
                    >
                      <DoubleClick
                        singleTap={singleTapHandler}
                        doubleTap={null}
                        delay={200}
                      >
                        {item.type !== undefined &&
                        item.type.split("/")[0] == "image" ? (
                          <Image
                            loadingIndicatorSource={{
                              uri: `${item.compressedUrl}`,
                            }}
                            source={{ uri: `${item.url}` }}
                            style={{
                              width: styles.card.width,
                              marginRight: 2,
                              minHeight: 350,
                              maxHeight: 400,
                              resizeMode: "contain",
                            }}
                          />
                        ) : (
                          item.type !== undefined && (
                            <VideoPlayer videoUri={`${item.url}`} item={item} />
                          )
                        )}
                      </DoubleClick>
                    </DoubleClickAnimated>
                  ))
                : props.media.map((item, index) => (
                    <TouchableOpacity onPress={singleTapHandler}>
                      {item.type !== undefined &&
                      item.type.split("/")[0] == "image" ? (
                        <Image
                          key={index}
                          loadingIndicatorSource={{
                            uri: `${item.compressedUrl}`,
                          }}
                          source={{ uri: `${item.url}` }}
                          style={{
                            width: styles.card.width,
                            marginRight: 2,
                            minHeight: 350,
                            maxHeight: 400,
                            resizeMode: "contain",
                          }}
                        />
                      ) : (
                        item.type !== undefined && (
                          <VideoPlayer
                            key={index}
                            videoUri={`${item.url}`}
                            item={item}
                          />
                        )
                      )}
                    </TouchableOpacity>
                  ))}
            </ScrollView>
            {props.media.length > 1 && (
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  position: "absolute",
                  top: 0,
                  backgroundColor: mode
                    ? getDarkTheme.backgroundColor
                    : getLightTheme.backgroundColor,
                }}
              >
                {/* {[...Array(props.media.length)].map((e, index) => (
                                        <Entypo key={index} style={{margin:-5}} name='dot-single' size={index==currentImageIndex?40:28} color={index==currentImageIndex?Colors.primary:'grey'}/>
                                    ))} */}
                <View
                  style={{
                    backgroundColor: "#1118",
                    padding: 5,
                    paddingHorizontal: 10,
                    borderRadius: 50,
                    margin: 5,
                  }}
                >
                  <Text style={{ color: "white" }}>
                    {currentImageIndex}/{props.media.length}
                  </Text>
                </View>
              </View>
            )}
          </>
        ) : (
          <DoubleClick singleTap={null} doubleTap={doubleTapLike} delay={200}>
            <View
              style={{
                width: "100%",
                paddingVertical: 20,
                paddingHorizontal: 10,
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              {/* <Text style={{textAlign:'left',fontSize:16}}>{captionParser(props.caption).caption}</Text> */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "100%",
                  flexWrap: "wrap",
                  backgroundColor: mode
                    ? getDarkTheme.backgroundColor
                    : getLightTheme.backgroundColor,
                }}
              >
                <Text numberOfLines={fullCaptionHidden ? undefined : 5}>
                {props.caption.split(" ").map((word, index) => {
                  if (word.split("@").length > 1) {
                    return (
                      <TouchableWithoutFeedback
                        key={index}
                        style={{ marginBottom: 2 }}
                        onPress={() =>
                          openUserDetailsByName(word.split("@")[1])
                        }
                      >
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: "700",
                            color: mode ? "white" : Colors.primary,
                          }}
                        >{`@${word.split("@")[1]} `}</Text>
                      </TouchableWithoutFeedback>
                    );
                  } else if (word.split("#").length > 1) {
                    return (
                      <Text
                        style={{
                          fontWeight: "700",
                          color: mode ? "white" : Colors.primary,
                        }}
                        key={index}
                      ></Text>
                    );
                  } else if (/\r|\n/.exec(word)) {
                    return (
                      <Text
                        key={index}
                        style={{
                          fontSize: 16,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {" "}
                      </Text>
                    );
                  } else {
                    return (
                      <Text
                        key={index}
                        style={{
                          fontSize: 16,
                          marginBottom: 2,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >{`${word} `}</Text>
                    );
                  }
                })}
                </Text>
                {props.caption.split(" ").length > 15 && (
              <TouchableOpacity
                onPress={expandText}
                style={{
                  marginTop: 10,
                  backgroundColor: mode
                    ? getDarkTheme.backgroundColor
                    : getLightTheme.backgroundColor,
                }}
              >
                <Text
                  style={{
                    color: mode ? "white" : Colors.primary,
                    textDecorationLine: "underline",
                    fontWeight: "bold",
                  }}
                >
                  {fullCaptionHidden ? "Show Less" : "Read more"}
                </Text>
              </TouchableOpacity>
            )}
              </View>
              <Text
                style={{
                  textAlign: "left",
                  fontSize: 16,
                  fontWeight: "bold",
                  color: mode ? "white" : Colors.primary,
                  marginTop: 10,
                }}
              >
                {captionParser(props.caption).hashtags}
              </Text>
            </View>
          </DoubleClick>
        )}
        {/* <View style={[styles.footer,{justifyContent:'flex-end',}]} >
                            { props.mediaType =='media' && props.media.length!==0 &&
                                <TouchableOpacity>
                                    <MaterialCommunityIcons name="fullscreen" color={Colors.primary} size={30}/>
                                </TouchableOpacity>
                            }
                        </View> */}

        {props.showFooter && (
          <View
            style={[
              styles.footer,
              {
                backgroundColor: mode
                  ? getDarkTheme.backgroundColor
                  : getLightTheme.backgroundColor,
              },
            ]}
          >
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
                {" "}
                {Screen.width < 300 ? props.commentCount : "Comments"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => shareBottomSheetRef.current.open()}
              style={styles.comment}
            >
              <CustomIcon name="share" active={false} size={20} />
              {Screen.width > 300 && (
                <Text
                  style={{
                    marginLeft: 6,
                    color: mode ? getDarkTheme.color : getLightTheme.color,
                  }}
                >
                  Share
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {props.showFooter && props.mediaType == "media" && (
          <View style={styles.footerBody}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <TouchableOpacity onPress={openComments} style={{ width: "80%" }}>
                {props.commentCount > 0 ? (
                  <Text style={{ color: "lightgrey", marginTop: 5 }}>
                    {props.commentCount}{" "}
                    {props.commentCount > 1 ? "Comments" : "Comment"}
                  </Text>
                ) : (
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={{ color: "lightgrey", marginTop: 5 }}
                  >
                    Be the first one to comment !
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <LoadingModal modalVisible={modalVisible} task={task} />
      <BottomSheet
       modeType={mode}
        ref={OptionsBottomSheetRef}
        height={350}
        heading={sheetMode == "options" ? "Options" : "Reason for report"}
      >
        {props.user._id !== currentUserId && sheetMode == "options" && (
          <>
            <TouchableOpacity
              onPress={() => {
                setReportType("post");
                setSheetMode("reason");
              }}
              style={{ padding: 5, width: "100%", paddingVertical: 10 }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                Report Post
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setReportType("user");
                setSheetMode("reason");
              }}
              style={{ padding: 5, width: "100%", paddingVertical: 10 }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                Report User
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                blockUser();
              }}
              style={{ padding: 5, width: "100%", paddingVertical: 10 }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                Block User
              </Text>
            </TouchableOpacity>
          </>
        )}

        {props.user._id !== currentUserId && sheetMode == "reason" && (
          <>
            <TouchableOpacity
              onPress={() => report("Nudity")}
              style={{ padding: 5, width: "100%", paddingVertical: 10 }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                Nudity
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => report("Harrasment")}
              style={{ padding: 5, width: "100%", paddingVertical: 10 }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                Harrasment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => report("Voilence")}
              style={{ padding: 5, width: "100%", paddingVertical: 10 }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                Voilence
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => report("Other")}
              style={{ padding: 5, width: "100%", paddingVertical: 10 }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                Other
              </Text>
            </TouchableOpacity>
          </>
        )}

        {props.user._id == currentUserId && (
          <>
            <TouchableOpacity
              onPress={editPostHandler}
              style={{ padding: 5, width: "100%", paddingVertical: 10 }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                Edit Post
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={showDeleteAlert}
              style={{ padding: 5, width: "100%", paddingVertical: 10, }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                Delete Post
              </Text>
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
          onPress={openRepostScreen}
          style={{ padding: 5, width: "100%", paddingVertical: 10 }}
        >
          <Text
            style={{
              fontSize: 16,
              color: mode ? getDarkTheme.color : getLightTheme.color,
            }}
          >
            Repost this post
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={sharePostHandler}
          style={{ padding: 5, width: "100%", paddingVertical: 10 }}
        >
          <Text
            style={{
              fontSize: 16,
              color: mode ? getDarkTheme.color : getLightTheme.color,
            }}
          >
            Share post
          </Text>
        </TouchableOpacity>
      </BottomSheet>
    </View>
  ) : (
    <RePostCard post={props.post} showFooter={true} redirectUser={true} />
  );
}

const styles = StyleSheet.create({
  card: {
    width: Dimensions.get("screen").width - 30,

    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "column",
    borderColor: Colors.primary,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  subHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
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
