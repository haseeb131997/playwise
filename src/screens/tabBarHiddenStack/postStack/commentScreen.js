import React, { useEffect, useState, createRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  Linking,
} from "react-native";
import PostCard from "../../../components/postCard";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import { Routes } from "../../../utils/routes";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import { ApiCollection } from "../../../configs/envConfig";
import {
  UserToken,
  UserId,
  UserInfo,
  DarkModeStatus,
} from "../../../app/useStore";
import moment from "moment";
import LoadingModal from "../../../components/loadingModal";
import Entypo from "@expo/vector-icons/Entypo";
import { BottomSheet } from "../../../components/BottomSheet";
import { DefaultDisplay, Loading } from "../../../components/exceptionHolders";
import { showCutomizedToast } from "../../../components/customToast";
import MentionsTextInput from "react-native-mentions";
import { color, greaterThan } from "react-native-reanimated";

export default function CommentScreen({ route, navigation }) {
  useEffect(() => {
    if (token == null) {
      navigation.replace(Routes.onBoardingStack.tag);
      return;
    }

    getPostDetails();
  }, []);

  const mode = DarkModeStatus();

  const BottomSheetRef = createRef();

  const [isUiRender, setIsUiRender] = useState(false);

  const postId = route.params.postId;
  const token = UserToken();
  const currentUserId = UserId();
  const myProfile = UserInfo();

  const [postData, setPostData] = useState(null);
  const [comments, setComment] = useState([]);

  const [repliesList, setRepliesList] = useState([]);

  const [selectedIndex, setSelectedIndex] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isModalLoading, setIsModalLoading] = useState(false);
  const [modalTask, setModalTask] = useState("Loading...");

  const [commentInput, setCommentInput] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [selectedReply, setSelectedReply] = useState(null);
  const [commetForReport, setCommetForReport] = useState(null);
  const [inputType, setInputType] = useState("comment");

  const [userList, setUserList] = useState([]);

  const [page, setPage] = useState(1);

  const commentLikeCount = (item) => {
    if (!item.isLiked) {
      item.isLiked = true;
      item.likes = item.likes + 1;
    } else {
      item.isLiked = false;
      item.likes = item.likes - 1;
    }
    setComment(comments);
    setIsUiRender(!isUiRender);
    commentLikes(item);
  };
  const replyCount = (item) => {
      item.replies = item.replies;
  };

  const commentLikes = async (commentData) => {
    let commentId = commentData._id;
    console.log(
      `${ApiCollection.postController.postCommentLike}/${commentId}/like`,
      "url"
    );
    console.log(token, "authToken");
    await axios
      .put(
        `${ApiCollection.postController.postCommentLike}/${commentId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        console.log(res, "res of comment like");
        console.log(err.response.data, "response erorrrrrrrrrrrrr");
      })
      .catch((err) => {
        console.log(err, "commentLike error");
      });
  };

  const getPostDetails = async () => {
    setIsLoading(true);
    await axios
      .get(`${ApiCollection.postController.getPostById}/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          setPostData(res.data.post);
          axios
            .get(
              `${ApiCollection.postController.getPostComments}/${postId}/?page=${page}`,
              { headers: { Authorization: `Bearer ${token}` } }
            )
            .then((res) => {
              // console.log(res.data.comments, "ressssssss");
              let commentData = res.data.comments;

              // for(let item of commentData){
              //   item.isLike = false
              //   item.isLikeCount = 0
              // }
              // console.log(commentData, 'Comment Data')
              setComment(commentData);
              setIsLoading(false);
            })
            .catch((err) => {
              setIsLoading(false);
            });
        }
      })
      .catch((err) => {
        setPostData(null);
        setIsLoading(false);
      });
  };
  const getReplies = async (commentData) => {
    setRepliesList([]);
    let commentId = commentData._id;
    await axios
      .get(
        `${ApiCollection.postController.getCommentReplies}/${commentId}/?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log(res.data, "res of repliessssssssssssssss");
        if (res.data.success) {
          setRepliesList(res.data.comments);
        } else {
          setRepliesList([]);
        }
      })
      .catch((err) => {
        setRepliesList([]);
        console.log(err, "error of replyyy");
      });
  };

  function findUsernames(comment) {
    var regexp = /\B\@\w\w+\b/g;
    let result = comment.match(regexp);
    result = result?.map((item) => item.replace("@", ""));
    return result ? result : [];
  }

  const addComment = async () => {
    if (commentInput.trim() == "") {
      return;
    }

    const taggedUser = findUsernames(commentInput);

    const commentBodyTemp = {
      _id: currentUserId,
      comment: commentInput,
      createdAt: new Date(),
      likes: [],
      replies: [],
      taggedUsers: taggedUser.length !== 0 ? taggedUser : null,
      postId: postId,
      userId: {
        _id: currentUserId,
        username: myProfile.username,
        profilePic: myProfile.profilePic,
      },
    };

    setAddingComment(true);
    await axios
      .post(
        `${ApiCollection.postController.addComment}/${postId}/comment`,
        {
          comment: commentInput,
          taggedUsers: taggedUser.length !== 0 ? taggedUser : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log(res, "comment Response");
        if (res.data.success) {
          setComment([...comments, commentBodyTemp]);
        }
        setCommentInput("");
        setAddingComment(false);
      })
      .catch((err) => {
        setAddingComment(false);
        console.log(err, "comment Error");
      });
  };

  const replyComment = async (commentData) => {
    let commentId = commentData._id;
    if (commentInput.trim() == "") {
      return;
    }
    const taggedUser = findUsernames(commentInput);

    const replyBodyTemp = {
      _id: currentUserId,
      comment: commentInput,
      createdAt: new Date(),
      likes: 0,
      replies: 0,
      taggedUsers: taggedUser.length !== 0 ? taggedUser : null,
      postId: postId,
      userId: {
        _id: currentUserId,
        username: myProfile.username,
        profilePic: myProfile.profilePic,
      },
    };

    setAddingComment(true);
    await axios
      .post(
        `${ApiCollection.postController.replyComment}/${commentId}`,
        {
          content: commentInput,
          // taggedUsers: taggedUser.length !== 0 ? taggedUser : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log(res.data, "reply responsel");
        if (res.data.success) {
          setRepliesList([...repliesList, replyBodyTemp]);
        }
        setCommentInput("");
        setSelectedReply(null);
        setAddingComment(false);
        setInputType("comment");
      })
      .catch((err) => {
        setAddingComment(false);
        console.log(err, "reply errorr");
        setInputType("comment");
        setSelectedReply(null);
        setCommentInput("");
      });
  };

  const deleteComment = async (commentId, deleteType) => {
    setIsModalLoading(true);
    setModalTask("Deleting...");

    await axios
      .delete(
        `${ApiCollection.postController.deleteComment}/${postId}/comment?commentId=${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.success) {
          Alert.alert(
            `Delete ${deleteType === "comment" ? "Comment" : "Reply"}`,
            `${
              deleteType === "comment" ? "Comment" : "Reply"
            } deleted successfully`
          );
          if (deleteType === "comment") {
            setComment(comments.filter((comment) => comment._id !== commentId));
          } else {
            setRepliesList(
              repliesList.filter((reply) => reply._id !== commentId)
            );
          }
        }
        setIsModalLoading(false);
      })
      .catch((err) => {
        setIsModalLoading(false);
        console.log(err);
        Alert.alert("Delete Comment", "Something went wrong");
      });
  };

  const showDeleteAlert = (commentId, deleteType) =>
    Alert.alert(
      `Delete ${deleteType === "comment" ? "Comment" : "Reply"} !`,
      `Are you sure you want to delete this ${
        deleteType === "comment" ? "comment" : "reply"
      } ?`,
      [
        { text: "Cancel", onPress: () => null, style: "cancel" },
        {
          text: "Delete",
          onPress: () => deleteComment(commentId, deleteType),
          style: "destructive",
        },
      ],
      { cancelable: true, onDismiss: () => null }
    );

  const handleEditPress = async (commentBody) => {
    if (commentInput.trim() == "") {
      return;
    }

    setAddingComment(true);
    await axios
      .put(
        `${ApiCollection.postController.updateComment}/${postId}/comment`,
        { comment: commentInput, commentId: commentBody._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const commentIndex = comments.findIndex(
          (comment) => comment._id === commentBody._id
        );
        if (commentIndex !== -1) comments[commentIndex].comment = commentInput;
        setComment(comments);
        setCommentInput("");
        setSelectedComment(null);
        setAddingComment(false);
      })
      .catch((err) => {
        setAddingComment(false);
      });
  };

  const handleSubmittion = async () => {
    if (inputType === "comment") {
      if (selectedComment == null) {
        addComment();
      } else {
        handleEditPress(selectedComment);
      }
    } else {
      replyComment(selectedReply);
    }
  };

  const closeSheet = () => {
    setCommetForReport("");
    BottomSheetRef.current.close();
  };

  const reportComment = async (givenReason) => {
    const commenId = commetForReport;
    const postId = route.params.postId;
    let reason = givenReason;

    closeSheet();
    setIsModalLoading(true);
    setModalTask("Reporting...");
    await axios
      .post(
        `${ApiCollection.postController.reportComment}/${postId}?commentId=${commenId}`,
        { reason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.success) {
          showCutomizedToast("Comment reported successfully", "success");
        }
        setIsModalLoading(false);
      })
      .catch((err) => {
        setIsModalLoading(false);
        Alert.alert(
          "Report Comment",
          err.response.data.message
            ? err.response.data.message
            : "Something went wrong"
        );
      });
  };
  const deletePostHandler = (postId) => {
    setPostData(postData.filter((post) => post._id !== postId));
  };

  const openUserProfile = (userId) => {
    navigation.navigate(Routes.tabBarHiddenScreens.playerStack.tag, {
      userId: userId,
    });
  };

  const openUserDetailsByName = (userName) => {
    navigation.navigate(Routes.tabBarHiddenScreens.playerStack.tag, {
      userName: userName,
    });
  };

  const onClickReply = (item, index) => {
    setSelectedIndex(index);
    setSelectedReply(item);
    setInputType("reply");
    getReplies(item);
  };
  const onClickShowReplies = (item, index) => {
    getReplies(item);
    setSelectedIndex(index);
    // setSelectedReply(item);
  }

  const _renderComments = ({ item, index }) => {
    return (
      <View style={[styles.header, mode ? getDarkTheme : getLightTheme]}>
        <TouchableOpacity onPress={() => openUserProfile(item.userId._id)}>
          <Image
            style={{ width: 35, height: 35, borderRadius: 5 }}
            source={{
              uri: `${item.userId.profilePic ? item.userId.profilePic : ""}`,
            }}
          />
        </TouchableOpacity>

        <View style={{ marginLeft: 10, flex: 3 }}>
          <>
            <View style={{flexDirection:"row"}}>
              <TouchableOpacity
              style={{ marginBottom: 5 }}
              onPress={() => openUserProfile(item.userId._id)}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: Colors.primary,
                }}
              >
                {item.userId.username}
              </Text>
              
            <View style={{flexDirection:"row"}}>
            <Text style={{ color: "grey" }}>{item.replies} {item.replies > 1 ? "replies" : "reply"}</Text>
            <Text style={{ marginLeft: 5, marginRight: 5, fontWeight: "400" }}>|</Text>
            <TouchableOpacity
              style={{ marginBottom: 5, flexDirection:"row" }}
              onPress={() => onClickShowReplies(item, index)}
            >
            <Text style={{ color: "grey", fontWeight:"600" }}>Show replies</Text>

            </TouchableOpacity>
            </View>

            </TouchableOpacity>
            </View>
          </>
          <>
            <TouchableOpacity
              onPress={() => {
                commentLikeCount(item);
              }}
              style={{ marginRight: 10 }}
            >
              <View
                style={{
                  flexDirection: "column",
                  position: "absolute",
                  top: -20,
                  right: 20,
                }}
              >
                <AntDesign
                  name={item.isLiked ? "heart" : "hearto"}
                  size={20}
                  color={"red"}
                />
                <Text
                  style={{ marginLeft: 8, color: mode ? "white" : "black" }}
                >
                  {item.likes}
                </Text>
              </View>
            </TouchableOpacity>
          </>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <Text style={{ color: mode ? "white" : "black" }}>
              {item?.comment &&
                item.comment.split(" ").map((word, index) => {
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
                            fontWeight: "700",
                            color: Colors.primary,
                          }}
                        >
                          {`@${word.split("@")[1]} `}{" "}
                        </Text>
                      </TouchableWithoutFeedback>
                    );
                  } else if (word.split("#").length > 1) {
                    return (
                      <Text
                        key={index}
                        style={{
                          fontWeight: "700",
                          color: Colors.primary,
                        }}
                      >{`#${word.split("#")[1]} `}</Text>
                    );
                  } else if (/\r|\n/.exec(word)) {
                    return <Text key={index}>{`${word} `}</Text>;
                  } else {
                    return `${word} `;
                  }
                })}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: 15,
              marginRight: 10,
            }}
          >
            <Text style={{ color: mode ? "white" : "grey", marginRight: 10 }}>
              {moment(item.createdAt).fromNow()} |{" "}
            </Text>

            {item.userId._id !== currentUserId && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setCommetForReport(item._id);
                    BottomSheetRef.current.open();
                  }}
                  style={{ marginRight: 10 }}
                >
                  <Text style={{ color: "grey" }}>Report</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    onClickReply(item, index);
                  }}
                  style={{ marginRight: 10 }}
                >
                  <Text style={{ color: "grey" }}>Reply</Text>
                </TouchableOpacity>
              </>
            )}

            {item.userId._id == currentUserId && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedComment(item);
                    setCommentInput(item.comment);
                  }}
                  style={{ marginRight: 10 }}
                >
                  <Text style={{ color: "grey" }}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => showDeleteAlert(item._id, "comment")}
                  style={{ marginRight: 10 }}
                >
                  <Text style={{ color: "grey" }}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    onClickReply(item, index);
                  }}
                  style={{ marginRight: 10 }}
                >
                  <Text style={{ color: "grey" }}>Reply</Text>
                </TouchableOpacity>

              </>
            )}
          </View>
          {selectedIndex === index &&
            repliesList &&
            repliesList.map((data, childIndex) =>
              _renderCommentsReplies(data, childIndex)
            )}
        </View>

        <BottomSheet ref={BottomSheetRef} heading={"Reason"}>
          <TouchableOpacity
            onPress={() => reportComment("Nudity")}
            style={{ padding: 5, width: "100%", paddingVertical: 10 }}
          >
            <Text style={{ fontSize: 16 }}>Nudity</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => reportComment("Harrasment")}
            style={{ padding: 5, width: "100%", paddingVertical: 10 }}
          >
            <Text style={{ fontSize: 16 }}>Harrasment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => reportComment("Voilence")}
            style={{ padding: 5, width: "100%", paddingVertical: 10 }}
          >
            <Text style={{ fontSize: 16 }}>Voilence</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => reportComment("Other")}
            style={{ padding: 5, width: "100%", paddingVertical: 10 }}
          >
            <Text style={{ fontSize: 16 }}>Other</Text>
          </TouchableOpacity>
        </BottomSheet>
      </View>
    );
  };

  const _renderCommentsReplies = (item, index) => {
    return (
      <View
        key={index.toString()}
        style={[styles.header, mode ? getDarkTheme : getLightTheme]}
      >
        <TouchableOpacity onPress={() => openUserProfile(item.userId._id)}>
          <Image
            style={{ width: 35, height: 35, borderRadius: 5 }}
            source={{
              uri: `${item.userId.profilePic ? item.userId.profilePic : ""}`,
            }}
          />
        </TouchableOpacity>
        <View style={{ marginLeft: 10, flex: 3 }}>
          <>
            <TouchableOpacity
              style={{ marginBottom: 5 }}
              onPress={() => openUserProfile(item.userId._id)}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: Colors.primary,
                }}
              >
                {item.userId.username}
              </Text>
            </TouchableOpacity>
          </>
          <>
            <TouchableOpacity
              onPress={() => {
                commentLikeCount(item);
              }}
              style={{ marginRight: 10 }}
            >
              <View
                style={{
                  flexDirection: "column",
                  position: "absolute",
                  top: -20,
                  right: 20,
                }}
              >
                <AntDesign
                  name={item.isLiked ? "heart" : "hearto"}
                  size={20}
                  color={"red"}
                />
                <Text
                  style={{ marginLeft: 8, color: mode ? "white" : "black" }}
                >
                  {item.likes}
                </Text>
              </View>
            </TouchableOpacity>
          </>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            {/* <Text>{item.comment}</Text> */}
            <Text style={{ color: mode ? "white" : "black" }}>
              {item?.comment &&
                item?.comment.split(" ").map((word, index) => {
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
                            fontWeight: "700",
                            color: Colors.primary,
                          }}
                        >
                          {`@${word.split("@")[1]} `}{" "}
                        </Text>
                      </TouchableWithoutFeedback>
                    );
                  } else if (word.split("#").length > 1) {
                    return (
                      <Text
                        key={index}
                        style={{
                          fontWeight: "700",
                          color: Colors.primary,
                        }}
                      >{`#${word.split("#")[1]} `}</Text>
                    );
                  } else if (/\r|\n/.exec(word)) {
                    return <Text key={index}>{`${word} `}</Text>;
                  } else {
                    return `${word} `;
                  }
                })}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: 6,
              marginRight: 10,
            }}
          >
            <Text
              style={{ color: mode ? "whitesmoke" : "grey", marginRight: 10 }}
            >
              {moment(item.createdAt).fromNow()}
            </Text>
            {item.userId._id == currentUserId && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedComment(item);
                    setCommentInput(item.comment);
                  }}
                  style={{ marginRight: 10 }}
                >
                  <Text style={{ marginLeft: -3, marginRight: 5, fontWeight: "400" }}>|</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => showDeleteAlert(item._id, "reply")}
                  style={{ marginRight: 6 }}
                >
                  <Text style={{ color: "grey" }}>Delete</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  const searchUser = async (searchText) => {
    const query = searchText.replace("@", "");
    if (searchText == "@") {
      setUserList([]);
      return;
    }
    await axios
      .get(`${ApiCollection.userController.userSearch}?search=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUserList(res.data.data))
      .catch((err) => console.log(err));
  };

  const ListingTab = ({ item }) => {
    const userPress = () => {
      const lastIndexOfSpace = commentInput.lastIndexOf(" ");
      const newCommentInput = commentInput.substring(0, lastIndexOfSpace);
      setCommentInput(newCommentInput + ` @${item.username}`);
    };

    return (
      <TouchableOpacity onPress={userPress} style={styles.contactSlab}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: mode ? "black" : "white",
          }}
        >
          <Image
            source={{ uri: item.profilePic }}
            style={{ width: 40, height: 40, borderRadius: 50 }}
          />
          <View style={{ marginLeft: 10, marginTop: -5 }}>
            <Text style={{ fontSize: 16, color: mode ? "white" : "black" }}>
              {item.username}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 12,
                marginTop: 2,
                width: "100%",
                color: mode ? "white" : "black",
              }}
            >
              {item.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  console.log(comments, "comments");

  return (
    <View style={[styles.page, mode ? getDarkTheme : getLightTheme]}>
      <LoadingModal modalVisible={isModalLoading} task={modalTask} />
      {!isLoading ? (
        postData != null ? (
          <>
            <FlatList
              contentContainerStyle={{ paddingBottom: 20 }}
              ListHeaderComponentStyle={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
              }}
              ListHeaderComponent={
                <>
                  <PostCard
                    post={postData}
                    views={postData.views}
                    visibility={postData.visibility}
                    postId={postData._id}
                    caption={postData.caption}
                    commentCount={postData.comments}
                    likeCount={postData.likeCount}
                    mediaType={
                      postData.mediaType
                        ? postData.mediaType
                        : postData.typeOfPost
                    }
                    media={postData.media}
                    username={postData.userId.username}
                    userId={postData.userId._id}
                    user={postData.userId}
                    profilePic={postData.userId.profilePic}
                    createdAt={postData.createdAt}
                    isLiked={postData.isLiked}
                    showFollow={!postData.isFollowing}
                    isFollowing={postData.isFollowing}
                    showFooter={true}
                    showFullCaption={true}
                    redirectUser={true}
                    onDelete={() => deletePostHandler(postData._id)}
                  />
                  <>
                    <Text
                      style={{
                        fontSize: 17,
                        textAlign: "left",
                        width: "95%",
                        marginBottom: 20,
                        color: Colors.primary,
                        fontWeight: "700",
                      }}
                    >
                      Comments
                    </Text>
                  </>
                </>
              }
              data={comments}
              renderItem={_renderComments}
            />

            <View style={{ width: "100%" }}>
              {selectedComment !== null && (
                <View
                  style={{
                    width: "100%",
                    padding: 10,
                    backgroundColor: "whitesmoke",
                    borderTopColor: "lightgrey",
                    borderTopWidth: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text>Editng comment - {selectedComment.comment}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedComment(null);
                      setCommentInput("");
                    }}
                  >
                    <Entypo name="cross" size={20} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              )}
              {selectedReply !== null && (
                <View
                  style={{
                    width: "100%",
                    padding: 10,
                    backgroundColor: "whitesmoke",
                    borderTopColor: "lightgrey",
                    borderTopWidth: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text>Repling to - {selectedReply.userId.username}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedReply(null);
                      setInputType("comment");
                      setCommentInput("");
                    }}
                  >
                    <Entypo name="cross" size={20} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.commentInputHolder}>
                <View style={[{ width: "85%" }]}>
                  <MentionsTextInput
                    textInputStyle={{
                      ...styles.input,
                      color: mode ? getDarkTheme.color : getLightTheme.color,
                    }}
                    suggestionsPanelStyle={
                      userList.length !== 0 && {
                        backgroundColor: mode ? "black" : "white",
                        marginBottom: 20,
                        height: 130,
                      }
                    }
                    loadingComponent={() =>
                      userList.length !== 0 && (
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            backgroundColor: mode ? "black" : "white",
                            alignItems: "center",
                          }}
                        >
                          <ActivityIndicator />
                        </View>
                      )
                    }
                    textInputMinHeight={50}
                    textInputMaxHeight={50}
                    trigger={"@"}
                    placeholder={
                      inputType === "comment" ? "Your comment" : "Your reply"
                    }
                    placeholderTextColor={"grey"}
                    triggerLocation={"new-word-only"} // 'new-word-only', 'anywhere'
                    value={commentInput}
                    onChangeText={(text) => setCommentInput(text)}
                    triggerCallback={(text) => searchUser(text)}
                    renderSuggestionsRow={ListingTab}
                    suggestionsData={userList} // array of objects
                    keyExtractor={(item, index) => index} // this is required when using FlatList
                    suggestionRowHeight={45}
                    horizontal={true} // default is true, change the orientation of the list
                    MaxVisibleRowCount={5} // this is required if horizontal={false}
                  />
                </View>

                {!addingComment ? (
                  <TouchableOpacity
                    disabled={commentInput.trim() == ""}
                    onPress={handleSubmittion}
                    style={{ marginLeft: 2 }}
                  >
                    <MaterialCommunityIcons
                      name="send-circle"
                      size={40}
                      color={
                        commentInput.trim() == "" ? "lightgrey" : Colors.primary
                      }
                    />
                  </TouchableOpacity>
                ) : (
                  <ActivityIndicator size="small" color={Colors.primary} />
                )}
              </View>
            </View>
          </>
        ) : (
          <DefaultDisplay showIcon={false} title={"Post Unavialable !"} />
        )
      ) : (
        <Loading />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  header: {
    width: "100%",
    padding: 10,
    paddingTop: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  input: {
    width: "95%",
    padding: 5,
    fontSize: 16,
    height: 50,
  },
  commentInputHolder: {
    width: Dimensions.get("screen").width,
    padding: 6,
    paddingTop: 0,
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "lightgrey",
    alignItems: "center",
  },
  contactSlab: {
    flexDirection: "row",
    borderWidth: 0.5,
    padding: 10,
    paddingVertical: 15,
    borderColor: "transparent",
    backgroundColor: "transparent",
    borderRadius: 5,
    justifyContent: "space-between",
  },
});
