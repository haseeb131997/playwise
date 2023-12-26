import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  ImageBackground,
  Linking,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Colors, getDarkTheme, getLightTheme } from "../utils/colors";
import PwLogo from "../../assets/logo/icon.png";
import { StatusBar } from "expo-status-bar";
import {
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { setUserLogOutState, toggleDarkMode, setUserInfo } from "../features/userSlice";
import { Routes } from "../utils/routes";
import axios from "axios";
import { UserId, UserToken, UserInfo, DarkModeStatus } from "../app/useStore";
import { ApiCollection } from "../configs/envConfig.js";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { AuthenticationListner } from "./authenticationListner";
import { AppUpdateListner } from "./appUpdateListner";

const CustomDrawer = (props) => {
  const token = UserToken();
  const userInfo = UserInfo();
  const navigation = useNavigation();
  const mode = DarkModeStatus();

  const logoutAndClear = () => {
    axios.post(ApiCollection.notificationController.setExpoToken, {
      expoToken: null,
      id: currentUserId,
    });
    dispatch(setUserLogOutState());
    navigation.replace(Routes.onBoardingStack.tag);
  };

  useEffect(() => {
    getProfile();
  }, []);

  useEffect(() => {
    AuthenticationListner(token, logoutAndClear);
    AppUpdateListner();
  }, []);

  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [internetConnection, setInternetConnection] = useState(true);

  const currentUserId = UserId();
  const authToken = UserToken();
  const dispatch = useDispatch();

  const logOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: null,
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          dispatch(toggleDarkMode(!mode));
          logoutAndClear();
        },
      },
    ]);
  };

  const getProfile = async () => {
    //setIsLoading(true);
    await axios
      .get(
        `${ApiCollection.userController.getMyBasic}/${currentUserId}/basic`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.success) {
          console.log(res.data);
          setProfileData(res.data.data);

          const userInfoApi = {
            coverPic: res.data.data.coverPic,
            profilePic: res.data.data.profilePic,
            name: res.data.data.name,
            username: res.data.data.username,
          };

          //alert(JSON.stringify(userInfoApi))

          dispatch(setUserInfo({ userInfo: userInfoApi }));
        }

        setIsLoading(false);
      })
      .catch((err) => {
        console.log(token);
        setIsLoading(false);
      });
  };

  const reportBug = () => {
    let desc = `Please describe the bug you found in the app.`;
    Linking.openURL(
      `mailto:support@playwise.gg?subject=Bug Report in Playwise mobile app&body=${desc}`
    ).catch((err) => {
      Alert.alert(
        "Report a bug !",
        "Please send an email to support@playwise.gg"
      );
    });
  };

  const suggestion = () => {
    let desc = `Your Suggestions here.`;
    Linking.openURL(
      `mailto:support@playwise.gg?subject=Suggestions for Playwise Mobile&body=${desc}`
    ).catch((err) => {
      Alert.alert(
        "Suggestions !",
        "Please send an email to support@playwise.gg"
      );
    });
  };

  return !isLoading ? (
    profileData != null ? (
      <View
        style={{
          position: "absolute",
          top: Platform.OS == "android" ? -40 : -55,
          flex: 1,
          backgroundColor: mode?getDarkTheme.backgroundColor:getLightTheme.backgroundColor,
          justifyContent: "flex-start",
          width: "100%",
          height: "105%",
        }}
      >
        <DrawerContentScrollView
          {...props}
          style={mode ? getDarkTheme : getLightTheme}
        >
          <ImageBackground
            source={{
              uri: `${
                userInfo !== null ? userInfo?.coverPic : profileData.coverPic
              }`,
            }}
            style={styles.banner}
          >
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.9)"]}
              style={{
                width: "100%",
                height: "100%",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: 10,
              }}
            >
              <View style={{ width: "100%", alignItems: "flex-end" }}>
                <Image source={PwLogo} style={{ width: 100, height: 100 }} />
              </View>
              <View style={{ padding: 5, paddingTop: 0 }}>
                <Image
                  source={{
                    uri: `${
                      userInfo !== null
                        ? userInfo.profilePic
                        : profileData.profilePic
                    }`,
                  }}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: "white",
                  }}
                />
                <Text style={{ color: "white", fontSize: 18, marginTop: 10 }}>
                  {userInfo !== null
                    ? userInfo.name
                    : profileData.name
                    ? profileData.name
                    : "Cant connect to server"}
                </Text>
                <Text style={{ color: "white", fontSize: 13, marginTop: 5 }}>
                  {userInfo !== null ? userInfo.username : profileData.username}
                </Text>
              </View>
            </LinearGradient>
          </ImageBackground>
          <DrawerItemList {...props} />
          <TouchableOpacity style={styles.logoutBtn} onPress={reportBug}>
            <Ionicons name="bug" size={25} color={"grey"} />
            <Text style={{ fontSize: 15, marginLeft: 15, color: "grey" }}>
              Report a bug
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={suggestion}>
            <Ionicons name="mail" size={22} color={"grey"} />
            <Text style={{ fontSize: 15, marginLeft: 15, color: "grey" }}>
              Suggestions
            </Text>
          </TouchableOpacity>
        </DrawerContentScrollView>
        <TouchableOpacity style={[styles.logoutBtn,mode && {backgroundColor:getDarkTheme.backgroundColor}]} onPress={logOut}>
          <AntDesign name="logout" size={20} color={"red"} />
          <Text style={{ fontSize: 15, marginLeft: 15, color: "red" }}>
            Logout
          </Text>
        </TouchableOpacity>

        <StatusBar style="auto" />
      </View>
    ) : (
      <View
        style={{
          position: "absolute",
          top: -40,
          flex: 1,
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        <DrawerContentScrollView {...props}>
          <ImageBackground
            source={{ uri: "https://wallpaperaccess.com/full/763844.jpg" }}
            style={[styles.banner, { height: 220 }]}
          >
            <Text style={{ color: "white", fontSize: 18, marginTop: 10 }}>
              Session Expired{" "}
            </Text>
          </ImageBackground>
          <TouchableOpacity style={styles.logoutBtn} onPress={reportBug}>
            <Ionicons name="bug" size={25} color={"grey"} />
            <Text style={{ fontSize: 15, marginLeft: 15, color: "grey" }}>
              Report a bug
            </Text>
          </TouchableOpacity>
        </DrawerContentScrollView>
        <TouchableOpacity style={styles.logoutBtn} onPress={logOut}>
          <AntDesign name="logout" size={20} color={"red"} />
          <Text style={{ fontSize: 15, marginLeft: 15, color: "red" }}>
            Logout
          </Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </View>
    )
  ) : (
    <View
      style={{
        position: "absolute",
        top: -40,
        flex: 1,
        justifyContent: "flex-start",
        width: "100%",
      }}
    >
      <DrawerContentScrollView {...props}>
        <ImageBackground source={{ uri: undefined }} style={styles.banner}>
          <ActivityIndicator color={"white"} />
          <Text style={{ color: "white", fontSize: 18, marginTop: 10 }}>
            Loading ....
          </Text>
        </ImageBackground>
        <DrawerItemList {...props} />
        <TouchableOpacity style={styles.logoutBtn} onPress={reportBug}>
          <Ionicons name="bug" size={25} color={"grey"} />
          <Text style={{ fontSize: 15, marginLeft: 15, color: "grey" }}>
            Report a bug
          </Text>
        </TouchableOpacity>
      </DrawerContentScrollView>
      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: "whitesmoke" }]}
        onPress={logOut}
      >
        <AntDesign name="logout" size={20} color={"red"} />
        <Text style={{ fontSize: 15, marginLeft: 15, color: "red" }}>
          Logout
        </Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  banner: {
    justifyContent: "center",
    alignItems: "flex-start",
    resizeMode: "stretch",
    height: 260,
    paddingTop: 60,
    backgroundColor: Colors.gradientPack[1],
    borderBottomColor: Colors.primary,
    borderBottomWidth: 2,
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 15,

    marginBottom: 10,
  },
});
