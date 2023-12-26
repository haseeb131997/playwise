import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
} from "react-native";
import PostCard from "../../../components/postCard";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { ApiCollection } from "../../../configs/envConfig";
import { DarkModeStatus, UserToken } from "../../../app/useStore";
import { Routes } from "../../../utils/routes";
import {
  Loading,
  NoData,
  ServerError,
} from "../../../components/exceptionHolders";
import MateriaCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useIsFocused } from "@react-navigation/native";

export default function DiscoverScreen({ navigation, route }) {
  const isFocused = useIsFocused();

  // useEffect(()=>{
  //     if(route.params?.upadtedData){
  //        console.log(route.params.upadtedData)
  //        let temp = discoverFeed.slice(0);

  //         const routePostId = route.params.upadtedData.postId
  //         const routeLikeCount = route.params.upadtedData.likeCount
  //         const routeIsLiked = route.params.upadtedData.isLiked

  //         const postIndex = temp.findIndex(post=>post._id==routePostId)

  //         if(postIndex!=-1){
  //             const newPost ={
  //                 ...temp[postIndex],
  //                 likeCount:routeLikeCount,
  //                 isLiked:routeIsLiked
  //             }
  //             temp[postIndex] = newPost
  //             setDiscoverFeed(temp)
  //         }

  //     }
  // },[route.params?.upadtedData])

  useEffect(() => {
    getDiscoverFeed(filters[filterIndex].filter);
  }, [discoverFeed, isFocused]);

  const token = UserToken();

  const mode = DarkModeStatus();

  const fields = { headers: { Authorization: `Bearer ${token}` } };

  const [discoverFeed, setDiscoverFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterIndex, setFilterIndex] = useState(0);
  const [page, setPage] = useState(2);

  const [filters, setFilters] = useState([
    { name: "Latest", filter: "latest" },
    { name: "Most Liked", filter: "likes" },
    { name: "Most Watched", filter: "views" },
  ]);
  const [filtered, setFiltered] = useState(false);

  const getDiscoverFeed = async (sortLabel) => {
    setIsLoading(true);
    let url = `${ApiCollection.postController.getMyDiscoverFeed}?filter=${sortLabel}`;
    setFiltered(true);

    await axios
      .get(url, fields)
      .then((res) => {
        const feed = res.data.data.filter((item) => item.media.length > 0);
        setDiscoverFeed(feed);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const onRefresh = () => {
    getDiscoverFeed(filters[filterIndex].filter);
  };

  const _renderDiscoverCards = ({ item }) => {
    const user = item.user ? item.user : item.userId;

    const openUserProfile = () => {
      navigation.push(Routes.tabBarHiddenScreens.playerStack.tag, {
        userId: user._id,
      });
    };

    const openPost = () => {
      const postId = item._id;

      let filterFeed = discoverFeed.filter(
        (feedItem) =>
          feedItem.media.length > 0 &&
          feedItem.media[0].type == item.media[0].type
      );
      const index = filterFeed.findIndex((feedItem) => feedItem._id == postId);
      filterFeed = filterFeed.slice(index);
      navigation.push(Routes.tabBarHiddenScreens.postStack.tag, {
        target: Routes.tabBarHiddenScreens.postStack.discoverScrollScreen,
        scrollFeed: filterFeed,
        page: page,
        filter: filters[filterIndex].filter,
      });
    };

    return (
      <TouchableOpacity
        onPress={openPost}
        style={{
          width: Dimensions.get("screen").width * 0.9,
          margin: 5,
          height: 250,
          borderRadius: 10,
          overflow: "hidden",
          borderColor: Colors.primary,
          borderWidth: 1.5,
        }}
      >
        <Image
          style={{ width: "100%", height: "100%" }}
          source={{ uri: `${item.thumbnail}` }}
        />
        <LinearGradient
          colors={[
            "transparent",
            "rgba(0,0,0,0.4)",
            "rgba(0,0,0,0.8)",
          ].reverse()}
          style={styles.header}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={openUserProfile}
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <View>
              <Image
                source={{ uri: user.profilePic }}
                style={{ width: 25, height: 25, borderRadius: 50 }}
              />
            </View>
            <View>
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 15,
                  marginLeft: 10,
                }}
              >
                @{user.username}
              </Text>
            </View>
          </TouchableOpacity>

          {item.media.length > 0 &&
          item.media[0].type.split("/")[0] == "video" ? (
            <Entypo name={"controller-play"} size={25} color={"white"} />
          ) : (
            <Entypo name={"image"} size={22} color={"white"} />
          )}
        </LinearGradient>

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.8)"]}
          style={styles.footer}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                marginRight: 15,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AntDesign
                name={item.isLiked ? "heart" : "hearto"}
                size={18}
                color={item.isLiked ? Colors.primary : "white"}
              />
              <Text style={{ marginLeft: 5, color: "white" }}>
                {item.likeCount}
              </Text>
            </View>

            <View
              style={{
                marginRight: 15,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MateriaCommunityIcons
                name="comment-outline"
                size={20}
                color={"white"}
              />
              <Text style={{ marginLeft: 5, color: "white" }}>
                {item.comments}
              </Text>
            </View>
          </View>

          <View>
            <View
              style={{
                marginRight: 15,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AntDesign name="eyeo" size={22} color={"white"} />
              <Text style={{ marginLeft: 5, color: "white" }}>
                {item.views}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const getMorePosts = async () => {
    let url = `${ApiCollection.postController.getMyDiscoverFeed}?page=${page}`;
    if (filtered) {
      url = `${ApiCollection.postController.getMyDiscoverFeed}?page=${page}&filter=${filters[filterIndex].filter}`;
    } else {
      url = `${ApiCollection.postController.getMyDiscoverFeed}?page=${page}`;
    }

    //const url =  sortLabel=='default'? `${ApiCollection.postController.getMyDiscoverFeed}?page=${page}` :`${ApiCollection.postController.getMyDiscoverFeed}?filter=${sortLabel}?page=${page}`
    await axios
      .get(url, { headers: { Authorization: "Bearer " + token } })
      .then((response) => {
        setPage(page + 1);
        const feed = response.data.data.filter((item) => item.media.length > 0);
        setDiscoverFeed(discoverFeed.concat(feed));
      })
      .catch((error) => {
        setDiscoverFeed(null);
      });
  };

  return (
    <View style={[styles.page, mode ? getDarkTheme : getLightTheme]}>
      {discoverFeed != null ? (
        <>
          <View
            style={{
              width: "100%",
              padding: 20,
              backgroundColor: mode
                ? getDarkTheme.backgroundColor
                : getLightTheme.backgroundColor,
            }}
          >
            {/* <View style={{flexDirection:'row',marginBottom:20,justifyContent:'space-between',alignItems:'center'}}>
                                    <Text style={{fontSize:16,}}>Sort by</Text>
                                </View>
                                 */}
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
              }}
            >
              {filters.map((filter, index) => (
                <TouchableOpacity
                  onPress={() => {
                    setFilterIndex(index);
                    getDiscoverFeed(filter.filter);
                  }}
                  key={index}
                  style={[
                    styles.intSelect,
                    filterIndex == index && { backgroundColor: Colors.primary },
                  ]}
                >
                  <Text
                    style={{
                      color:
                        filterIndex == index ? "#fff" : mode ? "#fff" : "#000",
                      padding: 0,
                      fontWeight: filterIndex == index ? "bold" : "normal",
                    }}
                  >
                    {filter.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {!isLoading ? (
            <FlatList
              refreshControl={
                <RefreshControl
                  tintColor={Colors.primary}
                  colors={[Colors.primary]}
                  refreshing={isLoading}
                  onRefresh={onRefresh}
                />
              }
              showsVerticalScrollIndicator={false}
              data={discoverFeed}
              renderItem={_renderDiscoverCards}
              onEndReached={getMorePosts}
              onEndReachedThreshold={0.5}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={
                <NoData
                  onRefresh={onRefresh}
                  style={{ height: 500 }}
                  iconName="search"
                  title="No posts right now !"
                />
              }
              contentContainerStyle={{
                paddingBottom: 20,
                justifyContent: "center",
                alignItems: "flex-start",
                backgroundColor: mode
                  ? getDarkTheme.backgroundColor
                  : getLightTheme.backgroundColor,
              }}
            />
          ) : (
            <Loading />
          )}
        </>
      ) : (
        <ServerError onRefresh={onRefresh} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: Dimensions.get("window").width,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  intSelect: {
    padding: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 8,
  },
  exploreBody: {
    width: Dimensions.get("window").width,
  },
  header: {
    flexDirection: "row",
    width: "100%",
    paddingRight: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    top: 0,
  },
  footer: {
    flexDirection: "row",
    width: "100%",
    paddingRight: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
  },
});
