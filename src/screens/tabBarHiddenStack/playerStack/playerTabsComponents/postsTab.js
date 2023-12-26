import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { DarkModeStatus, UserToken } from "../../../../app/useStore";
import PostCard from "../../../../components/postCard";
import { ApiCollection } from "../../../../configs/envConfig";
import { Colors, getDarkTheme, getLightTheme } from "../../../../utils/colors";

export default function PostsTab(props) {
  useEffect(() => {
    getPosts();
  }, []);

  const mode = DarkModeStatus();

  const userId = props.userId;
  const token = UserToken();

  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPosts = async () => {
    setLoading(true);
    await axios
      .get(
        `${ApiCollection.userController.getPlayerUserInfos}/${userId}/posts`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setLoading(false);
        setPosts(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const deletePostHandler = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: mode
          ? getDarkTheme.backgroundColor
          : getLightTheme.backgroundColor,
      }}
    >
      <Text style={styles.tabHead}>Posts</Text>
      <View
        style={{
          width: "100%",
          paddingVertical: 5,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        }}
      >
        {!loading ? (
          posts !== null ? (
            posts.length > 0 ? (
              posts.map((item, index) => (
                <PostCard
                  post={item}
                  views={item.views}
                  visibility={item.visibility}
                  isLiked={item.isLiked}
                  key={index}
                  postId={item._id}
                  caption={item.caption}
                  commentCount={item.commentCount}
                  likeCount={item.likeCount ? item.likeCount : item.likeCount}
                  mediaType={item.mediaType}
                  media={item.media}
                  userId={item.userId._id}
                  user={item.userId}
                  username={
                    item.userId != null ? item.userId.username : "playwise_user"
                  }
                  profilePic={
                    item.userId != null
                      ? item.userId.profilePic
                      : "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
                  }
                  createdAt={item.createdAt}
                  showFollow={false}
                  showFooter={true}
                  redirectUser={false}
                  onDelete={() => deletePostHandler(item._id)}
                />
              ))
            ) : (
              <View
                style={{
                  width: "85%",
                  backgroundColor: mode
                    ? getDarkTheme.backgroundColor
                    : getLightTheme.backgroundColor,
                }}
              >
                <Text
                  style={{
                    width: "100%",
                    textAlign: "left",
                    color: "grey",
                    fontSize: 16,
                  }}
                >
                  The user doesn't have any posts
                </Text>
              </View>
            )
          ) : (
            <View
              style={{
                width: "85%",
                backgroundColor: mode
                  ? getDarkTheme.backgroundColor
                  : getLightTheme.backgroundColor,
              }}
            >
              <Text style={{ width: "100%", textAlign: "left", color: "grey" }}>
                Cant connect to server | Please check your internet connection
              </Text>
            </View>
          )
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: mode
                ? getDarkTheme.backgroundColor
                : getLightTheme.backgroundColor,
            }}
          >
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={{ fontSize: 16, marginVertical: 15, color: "grey" }}>
              Loading Posts...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabHead: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    margin: 15,
  },
});
