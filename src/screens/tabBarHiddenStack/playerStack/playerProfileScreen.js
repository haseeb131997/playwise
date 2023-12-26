import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Dimensions,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import { LinearGradient } from "expo-linear-gradient";
import Entypo from "@expo/vector-icons/Entypo";
import IonIcons from "@expo/vector-icons/Ionicons";
import { Routes } from "../../../utils/routes";
import StatsTab from "./playerTabsComponents/statsTab";
import PostsTab from "./playerTabsComponents/postsTab";
import AboutTab from "./playerTabsComponents/aboutTab";
import DevicesTab from "./playerTabsComponents/devicesTab";
import GalleryTab from "./playerTabsComponents/galleryTab";
import axios from "axios";
import { ApiCollection } from "../../../configs/envConfig";
import { DarkModeStatus, UserToken } from "../../../app/useStore";
import { UserId } from "../../../app/useStore";
import {
  getDatabase,
  ref,
  onValue,
  set,
  orderByValue,
  orderByChild,
  orderByKey,
  orderByPriority,
  child,
  remove,
  get,
} from "firebase/database";
import {
  DefaultDisplay,
  Loading,
  NoData,
} from "../../../components/exceptionHolders";
import CustomButton from "../../../components/customButtons";
import Modal from "react-native-modal";
import { showCutomizedToast } from "../../../components/customToast";

export default function PlayerProfileScreen({ route, navigation }) {
  useEffect(() => {
    getUserProfile();
  }, []);

  const mode = DarkModeStatus();

  const token = UserToken();
  const currentUserId = UserId();
  const db = getDatabase();

  const [userId, setUserId] = useState(
    route.params.userId !== undefined ? route.params.userId : 0
  );
  const [currentTab, setCurrentTab] = useState(0);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [folllowLoading, setFolllowLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("profile");

  const tabList = [
    { name: "stats", component: <StatsTab userId={userId} /> },
    { name: "posts", component: <PostsTab userId={userId} /> },
    { name: "about", component: <AboutTab userId={userId} /> },
    { name: "devices", component: <DevicesTab userId={userId} /> },
    { name: "gallery", component: <GalleryTab userId={userId} /> },
  ];

  const getUserProfile = async () => {
    setLoading(true);
    const url = `${ApiCollection.userController.getUserDetails}/${
      route.params.userId !== undefined
        ? route.params.userId
        : `u/${route.params.userName}`
    }`;
    await axios
      .get(url, { headers: { Authorization: "Bearer " + token } })
      .then((response) => {
        setLoading(false);
        if (response.data.success) {
          if (route.params.userId == undefined) {
            setUserId(response.data.data._id);
          }

          setIsFollowing(response.data.data.isFollowing);
          setUserData(response.data.data);
        } else {
          navigation.setOptions({
            headerTintColor: "black",
            headerTransparent: false,
          });
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const followUser = async () => {
    if (isFollowing == true) {
      setFolllowLoading(true);
      await axios
        .put(
          `${ApiCollection.userController.unFollowUser}/${userData._id}`,
          {},
          { headers: { Authorization: "Bearer " + token } }
        )
        .then((response) => {
          setFolllowLoading(false);
          setIsFollowing(false);
        })
        .catch((error) => {
          console.log(error.response.data);
          setFolllowLoading(false);
          Alert.alert(
            "Unfollow",
            error.response.data.message
              ? error.response.data.message
              : "Some error occured,please try again later !"
          );
        });
    } else {
      setFolllowLoading(true);
      await axios
        .put(
          `${ApiCollection.userController.followUser}/${userData._id}`,
          {},
          { headers: { Authorization: "Bearer " + token } }
        )
        .then((response) => {
          setFolllowLoading(false);
          setIsFollowing(true);
        })
        .catch((error) => {
          setFolllowLoading(false);
          Alert.alert(
            "Follow",
            error.response.data.message
              ? error.response.data.message
              : "Some error occured,please try again later !"
          );
          setIsFollowing(true);
        });
    }
  };

  const openSocialLink = (link) => {
    if (link == "") {
      Alert.alert("Social Link", "Please connect your social account !", [
        {
          text: "Cancel",
          onPress: null,
          style: "cancel",
        },
        {
          text: "Connect",
          onPress: () => {
            navigation.navigate(Routes.tabStack.profileStack.editSocialScreen, {
              links: profile.socialLinks,
            });
          },
        },
      ]);

      return;
    }
    Linking.openURL(link).catch((err) =>
      Alert.alert(
        "Social Links",
        "In-valid social media link, please enter a valid link !",
        [
          {
            text: "Cancel",
            onPress: null,
            style: "cancel",
          },
          {
            text: "Edit",
            onPress: () => {
              navigation.navigate(
                Routes.tabStack.profileStack.editSocialScreen,
                { links: profile.socialLinks }
              );
            },
          },
        ]
      )
    );
  };

  const openMessages = () => {
    const routeData = {
      name: userData.name ? userData.name : userData.username,
      id: userData._id,
      username: userData.username,
      profilePic: userData.profilePic,
      chatId: `${currentUserId},${userData._id}`,
    };

    const reference = ref(db, "chats/" + routeData.chatId);
    get(reference).then((snapshot) => {
      if (snapshot.exists()) {
        navigation.navigate(
          Routes.tabBarHiddenScreens.chatStack.chatMessageScreen,
          { user: routeData }
        );
      } else {
        routeData.chatId = `${userData._id},${currentUserId}`;
        navigation.navigate(
          Routes.tabBarHiddenScreens.chatStack.chatMessageScreen,
          { user: routeData }
        );
      }
    });

    //navigation.navigate(Routes.tabBarHiddenScreens.chatStack.chatMessageScreen,{user:routeData})
  };

  const followerHandler = (type) => {
    if (
      (userData.accountType == "private" && userData.isFollowing) ||
      userData.accountType == "public"
    ) {
      navigation.navigate(
        Routes.tabBarHiddenScreens.playerStack.playerFollowersScreen,
        { userId: userData._id, type: type }
      );
    } else {
      return;
    }
  };

  const imageOpener = (type) => {
    if (type == "profile") {
      setModalType("profile");
      setModalVisible(true);
    } else if (type == "cover") {
      setModalType("cover");
      setModalVisible(true);
    }
  };

  return (
    <View
      style={[
        styles.page,
        {
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        },
      ]}
    >
      {!loading ? (
        userData != null ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <Modal
              isVisible={modalVisible}
              onBackButtonPress={() => setModalVisible(false)}
              onBackdropPress={() => setModalVisible(false)}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: mode
                    ? getDarkTheme.backgroundColor
                    : getLightTheme.backgroundColor,
                }}
              >
                {modalType == "profile" ? (
                  <Image
                    source={{ uri: `${userData.profilePic}` }}
                    style={{
                      width: Dimensions.get("screen").width,
                      height: Dimensions.get("screen").width,
                      borderRadius: 5,
                      borderWidth: 2,
                      borderColor: Colors.primary,
                      backgroundColor: "black",
                      resizeMode: "contain",
                    }}
                  />
                ) : (
                  <Image
                    source={{ uri: `${userData.coverPic}` }}
                    style={{
                      width: Dimensions.get("screen").width,
                      height: 200,
                      borderRadius: 5,
                      borderWidth: 2,
                      borderColor: Colors.primary,
                      backgroundColor: "black",
                      resizeMode: "contain",
                    }}
                  />
                )}
              </View>
            </Modal>

            <View
              style={{ width: Dimensions.get("screen").width, height: 320 }}
            >
              <Image
                source={{ uri: `${userData.coverPic}` }}
                style={{ width: "100%", height: "100%" }}
              />
              <TouchableOpacity
                style={styles.profileBanner}
                activeOpacity={1}
                onPress={() => imageOpener("cover")}
              >
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.8)"]}
                  style={{
                    width: "100%",
                    height: "100%",
                    padding: 20,
                    justifyContent: "flex-end",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => imageOpener("profile")}
                    style={{
                      width: 80,
                      height: 80,
                      overflow: "hidden",
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={{ uri: `${userData.profilePic}` }}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 50,
                        borderWidth: 2,
                        borderColor: Colors.primary,
                      }}
                    />
                  </TouchableOpacity>

                  <View style={{ marginTop: 10 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: "white",
                          fontWeight: "700",
                          marginRight: 10,
                        }}
                      >
                        {userData.name}
                      </Text>
                      {/* <MaterialIcons name="verified" color={Colors.primary} size={20}/>   */}
                    </View>

                    <Text
                      style={{ fontSize: 14, color: "white", marginTop: 5 }}
                    >
                      {userData.username}{" "}
                      {userData.role !== "" && ` |  ${userData.role}`}
                    </Text>
                  </View>

                  {userId != currentUserId && (
                    <View
                      style={{
                        marginTop: 15,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity
                        onPress={followUser}
                        style={[
                          isFollowing
                            ? styles.followingButton
                            : styles.followButton,
                        ]}
                      >
                        {!folllowLoading ? (
                          isFollowing ? (
                            <Text style={{ color: "white" }}>
                              {userData.accountType == "public"
                                ? "Following"
                                : "Follow Request Send !"}
                            </Text>
                          ) : (
                            <Text style={{ color: "white" }}>
                              {userData.accountType == "public"
                                ? "Follow"
                                : "Send Follow Request! "}
                            </Text>
                          )
                        ) : (
                          <ActivityIndicator size="small" color="white" />
                        )}
                      </TouchableOpacity>

                      {userData.accountType == "public" && (
                        <TouchableOpacity
                          style={styles.followButton}
                          onPress={openMessages}
                        >
                          <Text style={{ color: "white" }}>Message</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={styles.socialHolder}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  width: "90%",
                  padding: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => followerHandler("Followers")}
                  style={styles.profileStatsHolder}
                >
                  <Text
                    style={[
                      styles.profileStatsNum,
                      {
                        color: mode ? getDarkTheme.color : getLightTheme.color,
                      },
                    ]}
                  >
                    {userData.followers}
                  </Text>
                  <Text
                    style={{
                      color: mode ? getDarkTheme.color : getLightTheme.color,
                    }}
                  >
                    Followers
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => followerHandler("Following")}
                  style={styles.profileStatsHolder}
                >
                  <Text
                    style={[
                      styles.profileStatsNum,
                      {
                        color: mode ? getDarkTheme.color : getLightTheme.color,
                      },
                    ]}
                  >
                    {userData.followings}
                  </Text>
                  <Text
                    style={{
                      color: mode ? getDarkTheme.color : getLightTheme.color,
                    }}
                  >
                    Following
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.profileStatsHolder}
                  onPress={() => setCurrentTab(1)}
                >
                  <Text
                    style={[
                      styles.profileStatsNum,
                      {
                        color: mode ? getDarkTheme.color : getLightTheme.color,
                      },
                    ]}
                  >
                    {userData.numberOfPosts}
                  </Text>
                  <Text
                    style={{
                      color: mode ? getDarkTheme.color : getLightTheme.color,
                    }}
                  >
                    Posts
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {userData.accountType == "public" && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  width: "100%",
                  padding: 10,
                  marginTop: 5,
                }}
              >
                {userData._id != currentUserId &&
                userData.socialLinks.length > 0
                  ? userData.socialLinks.map(
                      (social, index) =>
                        social.link != "" && (
                          <TouchableOpacity
                            key={index}
                            onPress={() => openSocialLink(social.link)}
                          >
                            <MaterialCommunityIcons
                              name={social.website}
                              color={
                                social.link == ""
                                  ? "grey"
                                  : Colors[social.website]
                              }
                              size={30}
                            />
                          </TouchableOpacity>
                        )
                    )
                  : userData.socialLinks.map((social, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => openSocialLink(social.link)}
                      >
                        <MaterialCommunityIcons
                          name={social.website}
                          color={
                            social.link == "" ? "grey" : Colors[social.website]
                          }
                          size={30}
                        />
                      </TouchableOpacity>
                    ))}
              </View>
            )}

            {userData._id == currentUserId && (
              <View
                style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <CustomButton
                  type="primary"
                  style={{ marginTop: 10, padding: 10, width: "70%" }}
                  label="Edit Profile"
                  onPress={() =>
                    navigation.navigate(Routes.drawerStack.settingStack.tag)
                  }
                />
              </View>
            )}

            {(userData.accountType == "private" && userData.isFollowing) ||
            userData.accountType == "public" ? (
              <View style={{ marginTop: 20, width: "100%" }}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    backgroundColor: mode
                      ? getDarkTheme.backgroundColor
                      : getLightTheme.backgroundColor,
                    borderBottomColor: "whitesmoke",
                    borderBottomWidth: 1,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setCurrentTab(0)}
                    style={[
                      styles.customTabButtons,
                      tabList[currentTab].name == "stats" && {
                        borderBottomColor: Colors.primary,
                        borderBottomWidth: 2,
                      },
                    ]}
                  >
                    <IonIcons
                      name="stats-chart"
                      size={23}
                      color={
                        tabList[currentTab].name == "stats"
                          ? Colors.primary
                          : "lightgrey"
                      }
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setCurrentTab(1)}
                    style={[
                      styles.customTabButtons,
                      tabList[currentTab].name == "posts" && {
                        borderBottomColor: Colors.primary,
                        borderBottomWidth: 2,
                      },
                    ]}
                  >
                    <Entypo
                      name="grid"
                      size={30}
                      color={
                        tabList[currentTab].name == "posts"
                          ? Colors.primary
                          : "lightgrey"
                      }
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setCurrentTab(2)}
                    style={[
                      styles.customTabButtons,
                      tabList[currentTab].name == "about" && {
                        borderBottomColor: Colors.primary,
                        borderBottomWidth: 2,
                      },
                    ]}
                  >
                    <Entypo
                      name="info-with-circle"
                      size={22}
                      color={
                        tabList[currentTab].name == "about"
                          ? Colors.primary
                          : "lightgrey"
                      }
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setCurrentTab(3)}
                    style={[
                      styles.customTabButtons,
                      tabList[currentTab].name == "devices" && {
                        borderBottomColor: Colors.primary,
                        borderBottomWidth: 2,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name="devices"
                      size={25}
                      color={
                        tabList[currentTab].name == "devices"
                          ? Colors.primary
                          : "lightgrey"
                      }
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setCurrentTab(4)}
                    style={[
                      styles.customTabButtons,
                      tabList[currentTab].name == "gallery" && {
                        borderBottomColor: Colors.primary,
                        borderBottomWidth: 2,
                      },
                    ]}
                  >
                    <Entypo
                      name="images"
                      size={22}
                      color={
                        tabList[currentTab].name == "gallery"
                          ? Colors.primary
                          : "lightgrey"
                      }
                    />
                  </TouchableOpacity>
                </View>
                <View>{tabList[currentTab].component}</View>
              </View>
            ) : (
              <View
                style={{
                  marginTop: 20,
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View style={{ width: "90%" }}>
                  <DefaultDisplay
                    showIcon={false}
                    title="This Account is private , Please follow to view the details"
                  />
                </View>
              </View>
            )}
          </ScrollView>
        ) : (
          <DefaultDisplay title="User doenst exist !" />
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
    alignItems: "center",
    justifyContent: "flex-start",
  },
  profileBanner: {
    position: "absolute",
    width: "100%",
    backgroundColor: "#0006",
    height: "100%",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  profileStatsHolder: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  profileStatsNum: {
    fontSize: 20,
    fontWeight: "700",
  },
  socialHolder: {
    width: "100%",
    padding: 5,
    backgroundColor: "Colors.primary",

    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  tabHead: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    margin: 15,
  },
  customTabButtons: {
    padding: 10,
  },
  followButton: {
    paddingHorizontal: 10,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 5,
    marginRight: 12,
  },
  followingButton: {
    paddingHorizontal: 10,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 12,
  },
});
