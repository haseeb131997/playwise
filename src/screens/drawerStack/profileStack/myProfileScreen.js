import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  RefreshControl,
  Platform,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import { LinearGradient } from "expo-linear-gradient";
import Entypo from "@expo/vector-icons/Entypo";
import IonIcons from "@expo/vector-icons/Ionicons";
import { ApiCollection, envConfig } from "../../../configs/envConfig";
import { Routes } from "../../../utils/routes";
import PostCard from "../../../components/postCard";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import PWCard from "../../../components/PWCard";
import Modal from "react-native-modal";
import {
  UserId,
  UserToken,
  UserInfo,
  DarkModeStatus,
} from "../../../app/useStore";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserLogOutState, setUserInfo } from "../../../features/userSlice";
import { showCutomizedToast } from "../../../components/customToast";

import * as ImagePicker from "expo-image-picker";
import MyStatsTab from "./myProfileTabs/myStatsTab";
import MyPostsTab from "./myProfileTabs/MyPostsTab";
import MyAboutTab from "./myProfileTabs/MyAboutTab";
import MyDevicesTab from "./myProfileTabs/MyDevicesTab";
import MyGalleryTab from "./myProfileTabs/MyGalleryTab";
import CustomButton from "../../../components/customButtons";
import { Loading, ServerError } from "../../../components/exceptionHolders";

export default function ProfileScreen({ navigation }) {
  useEffect(() => {
    getMyProfile();
  }, []);

  const mode = DarkModeStatus();

  const token = UserToken();
  const currentUserId = UserId();
  const userInfo = UserInfo();

  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState(0);
  const [showCard, setShowCard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [cardData, setCardData] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const logout = () => {
    dispatch(setUserLogOutState());
    navigation.replace(Routes.onBoardingStack.tag);
  };

  const getMyProfile = async () => {
    setIsLoading(true);
    await axios
      .get(ApiCollection.userController.getMyProfile, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        setIsLoading(false);
        if (response.data.success) {
          setProfile(response.data.data);
          setCardData({
            name: response.data.data.name,
            username: response.data.data.username,
            profilePic: response.data.data.profilePic,
            coverPic: response.data.data.coverPic,
            id: response.data.data._id,
          });
        } else {
          setProfile(null);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setProfile(null);
      });
  };

  const pickImage = async (type) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.cancelled) {
      const imgType = Platform.OS == "android" ? "jpeg" : "jpg";

      const imageData = {
        name: `${Date.now()}`,
        uri: result.uri,
        type: `image/${imgType}`,
      };

      if (type == "profilePic") {
        setProfilePic(imageData.uri);
      }

      if (type == "coverPic") {
        setCoverPic(imageData.uri);
      }

      const bodyFormData = new FormData();
      bodyFormData.append("image", imageData);
      bodyFormData.append("type", type);

      let fields = {
        responseType: "json",
        headers: {
          "content-type": "multipart/form-data",
          accept: "application/json",
          Authorization: "Bearer " + token,
        },
      };
      //setIsLoading(true)
      await axios
        .post(
          ApiCollection.mediaController.uploadProfilePic,
          bodyFormData,
          fields
        )
        .then((res) => {
          setIsLoading(false);

          let userInfoApi = {
            coverPic: userInfo.coverPic,
            profilePic: userInfo.profilePic,
            name: userInfo.name,
            username: userInfo.username,
          };

          if (type == "profilePic") {
            userInfoApi.profilePic = imageData.uri;
          } else {
            userInfoApi.coverPic = imageData.uri;
          }

          dispatch(setUserInfo({ userInfo: userInfoApi }));

          showCutomizedToast(
            `${
              type == "profilePic" ? "Profile" : "Cover"
            } updated sucessfully !`,
            "success"
          );
        })
        .catch((err) => {
          setIsLoading(false);
          showCutomizedToast(
            `${type == "profilePic" ? "Profile" : "Cover"} update failed !`,
            "error"
          );
        });
    }
  };

  const tabList = [
    { name: "stats", component: <MyStatsTab /> },
    { name: "posts", component: <MyPostsTab /> },
    { name: "about", component: <MyAboutTab /> },
    { name: "devices", component: <MyDevicesTab /> },
    { name: "gallery", component: <MyGalleryTab /> },
  ];

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

  const onRefresh = useCallback(() => {
    getMyProfile();
  }, []);

  const followerHandler = (type) => {
    navigation.navigate(Routes.tabStack.profileStack.followerScreen, {
      userId: profile._id,
      accountType: profile.accountType,
      type: type,
    });
  };

  return !isLoading ? (
    profile != null ? (
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
        {/* <Modal isVisible={showCard} onBackButtonPress={()=>setShowCard(false)} onBackdropPress={()=>setShowCard(false)}>
                        <PWCard data={cardData}/>
                    </Modal> */}

        <ScrollView
          refreshControl={
            <RefreshControl
              tintColor={Colors.primary}
              colors={[Colors.primary]}
              refreshing={isLoading}
              onRefresh={onRefresh}
            />
          }
        >
          <View
            style={{
              width: "100%",
              height: 250,
              backgroundColor: mode ? "yellow" : "yellow",
            }}
          >
            <Image
              source={{ uri: coverPic == null ? profile.coverPic : coverPic }}
              style={{ width: "100%", height: "100%" }}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.5)"]}
              style={styles.profileBanner}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  width: "100%",
                  paddingTop: 10,
                  backgroundColor: "transparent",
                }}
              >
                {/* <TouchableOpacity onPress={()=>navigation.goBack()}>
                                {Platform.OS=='android'?
                                    <IonIcons name="arrow-back-outline" size={30} color={'white'}/>
                                    :
                                    <IonIcons name="ios-arrow-back" size={30} color={'white'}/>
                                }
                            </TouchableOpacity> */}

                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "transparent",
                  }}
                >
                  <TouchableOpacity onPress={() => pickImage("coverPic")}>
                    <FontAwesome
                      name="edit"
                      size={25}
                      style={{ marginRight: 20 }}
                      color={"white"}
                    />
                  </TouchableOpacity>

                  {/* <TouchableOpacity onPress={()=>setShowCard(true)}>
                                        <FontAwesome name="qrcode" size={25} style={{marginRight:20}} color={'white'} />
                                    </TouchableOpacity> */}
                </View>
              </View>

              <View
                style={{
                  padding: 5,
                  backgroundColor: "transparent",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    backgroundColor: mode
                      ? getDarkTheme.backgroundColor
                      : getLightTheme.color,
                  }}
                >
                  <Image
                    source={{
                      uri: profilePic == null ? profile.profilePic : profilePic,
                    }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 50,
                      resizeMode: "cover",
                      borderWidth: 2,
                      borderColor: Colors.primary,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => pickImage("profilePic")}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: Colors.primary,
                      padding: 5,
                      borderRadius: 5,
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                    }}
                  >
                    {/* <Text style={{color:'white',marginLeft:5}}>Upload</Text> */}
                    <FontAwesome name="edit" size={20} color={"white"} />
                  </TouchableOpacity>
                </View>

                <View style={{ marginTop: 10 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      backgroundColor: "transparent",
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
                      {profile.name}
                    </Text>
                    {/* {
                                                profile.phone==null || profile.email==null ?<></> : <MaterialIcons name="verified" color={Colors.primary} size={20}/>  
                                            } */}
                  </View>
                  <TouchableOpacity onPress={() => Clipboard.setString(`$profile.username`)}>
                     <View>
                     <Text
                    style={{
                      fontSize: 14,
                      color: "white",
                      marginTop: 5,
                      backgroundColor: "transparent",
                    }}
                  >
                    {profile.username}{" "}
                    {profile.role !== "" && ` |  ${profile.role}`}
                  </Text>
                     </View>
                  </TouchableOpacity>
                  
                </View>
              </View>
            </LinearGradient>
          </View>
          <View style={[styles.socialHolder]}>
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
                <Text style={styles.profileStatsNum}>{profile.followers}</Text>
                <Text style={styles.profileStatsDesc}>Followers</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => followerHandler("Following")}
                style={styles.profileStatsHolder}
              >
                <Text style={styles.profileStatsNum}>{profile.followings}</Text>
                <Text style={styles.profileStatsDesc}>Following</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCurrentTab(1)}
                style={styles.profileStatsHolder}
              >
                <Text style={styles.profileStatsNum}>
                  {profile.numberofPosts}
                </Text>
                <Text style={styles.profileStatsDesc}>Posts</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: "100%",
              padding: 10,
              marginTop: 5,
              backgroundColor: mode
                ? getDarkTheme.backgroundColor
                : getLightTheme.backgroundColor,
            }}
          >
            {profile.socialLinks.map((social, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => openSocialLink(social.link)}
              >
                <MaterialCommunityIcons
                  name={social.website}
                  color={social.link == "" ? "grey" : Colors[social.website]}
                  size={30}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 20,
              backgroundColor: mode
                ? getDarkTheme.backgroundColor
                : getLightTheme.backgroundColor,
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

          <View
            style={{
              marginTop: 20,
              width: "100%",
              backgroundColor: mode
                ? getDarkTheme.backgroundColor
                : getLightTheme.backgroundColor,
            }}
          >
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
                  size={28}
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
            <View
              style={{
                backgroundColor: mode
                  ? getDarkTheme.backgroundColor
                  : getLightTheme.backgroundColor,
              }}
            >
              {tabList[currentTab].component}
            </View>
          </View>
        </ScrollView>
      </View>
    ) : (
      <ServerError onRefresh={() => getMyProfile()} />
    )
  ) : (
    <Loading />
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
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 10,
  },
  profileStatsHolder: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  profileStatsNum: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
  profileStatsDesc: {
    color: "white",
  },
  socialHolder: {
    width: "100%",
    padding: 5,
    backgroundColor: Colors.primary,

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
  statsCard: {
    width: Dimensions.get("window").width / 2.4,
    height: 130,
    ...envConfig.PlatformShadow,
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10,
    overflow: "hidden",
  },
  customTabButtons: {
    padding: 10,
  },
});
