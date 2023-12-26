import React, { useState, useEffect, useCallback } from "react";
import { Routes } from "../../../utils/routes";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  Alert,
} from "react-native";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { ApiCollection } from "../../../configs/envConfig";
import { DarkModeStatus, UserToken } from "../../../app/useStore";
import axios from "axios";
import LoadingModal from "../../../components/loadingModal.js";
import {
  Loading,
  NoData,
  ServerError,
} from "../../../components/exceptionHolders";
import { useDispatch } from "react-redux";
import { setNewNotification } from "../../../features/userSlice";
import { showCutomizedToast } from "../../../components/customToast";
import moment from "moment";

export default function NotificationScreen({ navigation }) {
  useEffect(() => {
    getNotifications();
  }, []);
  // bool for darkmode theme/color
  const mode = DarkModeStatus();

  const dipatch = useDispatch();

  const token = UserToken();

  const [notificationList, setNotificationList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const getNotifications = async () => {
    setIsLoading(true);
    await axios
      .get(ApiCollection.notificationController.getNotificationList, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        setIsLoading(false);
        dipatch(setNewNotification({ newNotification: false }));
        setNotificationList(response.data.data);
        //setNotificationList(response.data.data)
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const openUser = (userId) => {
    navigation.navigate(Routes.tabBarHiddenScreens.playerStack.tag, {
      userId: userId,
    });
  };

  const openPost = (postId) => {
    navigation.navigate(Routes.tabBarHiddenScreens.postStack.tag, {
      postId: postId,
    });
  };

  const openTournamnet = (item) => {
    console.warn(item.data.tournamentId);

    const data = {
      _id: item.data.tournamentId,
    };

    navigation.push(Routes.tabStack.tournamentStack.tournamentDetailScreen, {
      tournament: data,
    });
  };

  const acceptRequest = async (userId) => {
    setIsModalLoading(true);
    await axios
      .put(`${ApiCollection.notificationController.accetReq}/${userId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        setIsModalLoading(false);
        showCutomizedToast("Request Accepted", "success");
        getNotifications();
      })
      .catch((err) => {
        setIsModalLoading(false);
        showCutomizedToast("Request Accept Failed", "error");
      });
  };

  const declineRequest = async (userId) => {
    setIsModalLoading(true);
    await axios
      .put(`${ApiCollection.notificationController.rejectReq}/${userId}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        setIsModalLoading(false);
        showCutomizedToast("Request Rejected", "success");
        getNotifications();
      })
      .catch((err) => {
        setIsModalLoading(false);
        showCutomizedToast("Request Reject Failed", "error");
      });
  };

  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Original Title",
      body: "And here is the body!",
      data: { someData: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  const NotificationBar = ({ item }) => {
    console.log(item);

    // const mode = DarkModeStatus();

    return (
      <View style={[styles.notificationBar]}>
        <View style={styles.header}>
          {item.type == "other" && (
            <>
              <TouchableOpacity onPress={() => openUser(item.sender._id)}>
                <Image
                  style={{ width: 35, height: 35, borderRadius: 50 }}
                  source={{ uri: `${item.sender.profilePic}` }}
                />
              </TouchableOpacity>

              <View
                style={[
                  { marginLeft: 10, width: "90%" },
                  item.type !== "other" && { flex: 3 },
                ]}
              >
                <TouchableOpacity onPress={() => openUser(item.sender._id)}>
                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: 2,
                      fontWeight: "500",
                      color: mode ? getDarkTheme.color : getLightTheme.color,
                    }}
                  >
                    {item.sender.username}
                  </Text>
                </TouchableOpacity>
                <Text style={{ color: "grey", fontSize: 13 }}>
                  {item.content}
                </Text>
                <Text style={{ color: "grey", fontSize: 13, marginTop: 8 }}>
                  {moment(item.createdAt).fromNow()}
                </Text>
              </View>
            </>
          )}

          {item.type != "other" && (
            <>
              <TouchableOpacity onPress={() => openUser(item.sender._id)}>
                <Image
                  style={{ width: 35, height: 35, borderRadius: 50 }}
                  source={{ uri: `${item.sender.profilePic}` }}
                />
              </TouchableOpacity>

              <View
                style={[
                  { marginLeft: 10 },
                  item.type !== "other" && { flex: 3 },
                ]}
              >
                <TouchableOpacity onPress={() => openUser(item.sender._id)}>
                  <Text
                    style={{
                      fontSize: 14,
                      marginBottom: 2,
                      fontWeight: "500",
                      color: mode ? getDarkTheme.color : getLightTheme.color,
                    }}
                  >
                    {item.sender.username}
                  </Text>
                </TouchableOpacity>

                <Text style={{ color: "grey", fontSize: 13 }}>
                  {item.title}
                </Text>
                <Text style={{ color: "grey", fontSize: 13, marginTop: 8 }}>
                  {moment(item.createdAt).fromNow()}
                </Text>
              </View>
            </>
          )}

          <View
            style={{
              flex: 3,
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            {item.type == "followReq" && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TouchableOpacity
                  onPress={() => acceptRequest(item.sender._id)}
                  style={[
                    styles.followButton,
                    { backgroundColor: Colors.primary, paddingHorizontal: 10 },
                  ]}
                >
                  <AntDesign name="check" color={"white"} size={20} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => declineRequest(item.sender._id)}
                  style={[
                    styles.followButton,
                    { backgroundColor: "white", paddingHorizontal: 10 },
                  ]}
                >
                  <Entypo name="cross" color={Colors.primary} size={20} />
                </TouchableOpacity>
              </View>
            )}
            {item.type == "post" && (
              <TouchableOpacity
                style={{
                  borderRadius: 5,
                  borderColor: Colors.primary,
                  borderWidth: 1,
                  padding: 5,
                }}
                onPress={() => openPost(item.data.postId)}
              >
                {/* <Image style={{width:60,height:40,borderRadius:2,marginRight:12}} source={{uri:`${item.data.media.url}`}}/> */}
                <Text style={{ color: Colors.primary }}>View Post</Text>
              </TouchableOpacity>
            )}

            {item.type == "tournament" && (
              <TouchableOpacity
                style={{
                  borderRadius: 5,
                  borderColor: Colors.primary,
                  borderWidth: 1,
                  padding: 5,
                }}
                onPress={() => openTournamnet(item)}
              >
                {/* <Image style={{width:60,height:40,borderRadius:2,marginRight:12}} source={{uri:`${item.data.media.url}`}}/> */}
                <Text style={{ color: Colors.primary, textAlign: "center" }}>
                  View{"\n"}Tournament
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const onRefresh = useCallback(() => {
    getNotifications();
  }, []);

  return (
    <View style={[styles.page, mode ? getDarkTheme : getLightTheme]}>
      <LoadingModal modalVisible={isModalLoading} />
      {!isLoading ? (
        notificationList !== null ? (
          notificationList.length != 0 ? (
            <FlatList
              refreshControl={
                <RefreshControl
                  tintColor={Colors.primary}
                  colors={[Colors.primary]}
                  refreshing={isLoading}
                  onRefresh={onRefresh}
                />
              }
              data={notificationList}
              renderItem={NotificationBar}
            />
          ) : (
            <NoData
              onRefresh={onRefresh}
              iconName="notifications"
              title="No Notifications right now !"
            />
          )
        ) : (
          <ServerError onRefresh={onRefresh} />
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
  notificationBar: {
    width: "100%",
    padding: 5,
    flexDirection: "row",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 0.8,
    jussifyContent: "flex-start",
  },
  header: {
    width: "100%",
    padding: 10,
    paddingTop: 15,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  followButton: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.primary,
    borderRadius: 5,
    borderWidth: 1,
    marginRight: 12,
  },
});
