import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Colors, getDarkTheme, getLightTheme } from "../../../../utils/colors";
import { ApiCollection } from "../../../../configs/envConfig";
import PostCard from "../../../../components/postCard";
import { DarkModeStatus, UserToken } from "../../../../app/useStore";
import axios from "axios";
import { styles } from "./TabStyle";
import CustomButton from "../../../../components/customButtons";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "../../../../utils/routes";

export default function MyPostsTab(props) {
  useEffect(() => {
    getPosts();
  }, []);

  const mode = DarkModeStatus();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = UserToken();
  const navigation = useNavigation();

  const getPosts = () => {
    setIsLoading(true);
    axios
      .get(ApiCollection.userController.getMyPosts, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setIsLoading(false);

        if (res.data.success) {
          setPosts(res.data.posts);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setPosts([]);
      });
  };

  const deletePostHandler = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
  };

  const onFollowHandler = () => {
    posts.forEach((post) => {
      post;
    });
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
      <Text style={[styles.tabHead, { paddingHorizontal: 10 }]}>My Posts</Text>
      <View
        style={{
          width: "100%",
          paddingVertical: 5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {!isLoading ? (
          posts.length > 0 ? (
            posts.map((item, index) => (
              <PostCard
                post={item}
                views={item.views}
                visibility={item.visibility}
                key={index}
                postId={item._id}
                isLiked={item.isLiked}
                caption={item.caption}
                commentCount={item.commentCount}
                likeCount={item.likeCount}
                mediaType={item.mediaType}
                media={item.media}
                username={item.userId.username}
                userId={item.userId._id}
                user={item.userId}
                profilePic={item.userId.profilePic}
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
                width: "90%",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "grey",
                  fontSize: 16,
                  marginTop: 20,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                Let's create your first post !
              </Text>
              <CustomButton
                type="outline-small"
                label={"Create Post"}
                onPress={() =>
                  navigation.navigate(
                    Routes.tabStack.addPostStack.addPostScreen
                  )
                }
              />
            </View>
          )
        ) : (
          <View style={[styles.page, { justifyContent: "center" }]}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text
              style={{
                fontSize: 16,
                marginVertical: 15,
                color: mode ? getDarkTheme.color : getLightTheme.color,
              }}
            >
              Loading Posts...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
