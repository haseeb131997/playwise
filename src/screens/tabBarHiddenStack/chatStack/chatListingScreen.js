import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { Routes } from "../../../utils/routes";
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
} from "firebase/database";
import {
  UserId,
  UserChat,
  UserToken,
  DarkModeStatus,
} from "../../../app/useStore";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import moment from "moment";
import {
  DefaultDisplay,
  Loading,
  NoData,
} from "../../../components/exceptionHolders";
import axios from "axios";
import { ApiCollection } from "../../../configs/envConfig";

export default function ChatListingScreen({ navigation }) {
  const mode = DarkModeStatus();

  const token = UserToken();

  useEffect(() => {
    getMyProfile();
  }, []);

  const getMyProfile = async () => {
    setIsLoading(true);
    await axios
      .get(ApiCollection.userController.getMyProfile, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        setIsLoading(false);
        if (response.data.success) {
          getChatListing();
        }
      })
      .catch((error) => {
        setIsLoading(false);
        Alert.alert("Session Expired", "Please Login again !");
      });
  };

  const [chatList, setChatList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const db = getDatabase();
  const currentUserID = UserId();

  const getChatListing = async () => {
    setIsLoading(true);
    const reference = ref(db, "chats/");
    onValue(reference, (snapshot) => {
      let listings = [];
      if (snapshot.val()) {
        const values = Object.values(snapshot.val());
        values.forEach((chatObject, index) => {
          if (chatObject.chats == undefined) {
            return;
          }
          chatObject.members.forEach((member, index) => {
            if (member.id == currentUserID) {
              let temp = {
                chatId: chatObject.chatId,
                chatLength: chatObject?.chats.length,
                showBadge: member.readLatest == false ? true : false,
                updatedAt: chatObject.updatedAt,
                lastChat: {
                  sender: chatObject.chats[0].author.id,
                  message:
                    chatObject.chats[0].type == "text"
                      ? chatObject.chats[0].text
                      : "Sent Image",
                  time: chatObject.chats[0].createdAt,
                },
                members: chatObject.members,
              };
              listings.push(temp);
            }
          });
        });
      }
      const ordered = listings.sort(
        (a, b) => parseFloat(b.updatedAt) > parseFloat(a.updatedAt)
      );
      setChatList(ordered);
      setIsLoading(false);
    });
  };

  const ListingTab = ({ item }) => {
    const displayChatUser = () => {
      let chatMember = {};
      item.members.forEach((member) => {
        if (member.id !== currentUserID) {
          chatMember = member;
        }
      });
      return chatMember;
    };

    const openMessages = () => {
      const routeData = {
        name: displayChatUser().name,
        id: displayChatUser().id,
        username: displayChatUser().username,
        profilePic: displayChatUser().avatar,
        chatId: item.chatId,
      };
      navigation.navigate(
        Routes.tabBarHiddenScreens.chatStack.chatMessageScreen,
        { user: routeData }
      );
    };

    return (
      <TouchableOpacity
        style={[styles.contactSlab, mode ? getDarkTheme : getLightTheme,mode && {borderColor:'transparent'}]}
        onPress={() => openMessages(item)}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", width: "70%" }}
        >
          <View>
            {item.showBadge == true && (
              <View
                style={{
                  borderRadius: 50,
                  padding: 7,
                  borderColor: "white",
                  borderWidth: 1,
                  backgroundColor: Colors.primary,
                  position: "absolute",
                  top: -2,
                  left: -1,
                  zIndex: 10,
                }}
              ></View>
            )}

            <Image
              source={{ uri: `${displayChatUser().avatar}` }}
              style={{ width: 40, height: 40, borderRadius: 50 }}
            />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={{ fontSize: 16, color: mode ? "white" : "Black" }}>
              {displayChatUser().username}
            </Text>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[
                {
                  fontSize: 12,
                  marginTop: 2,
                  textAlign: "left",
                  width: Dimensions.get("screen").width * 0.56,
                  color: mode ? "white" : "grey",
                },
                item.showBadge == true && {
                  fontWeight: "bold",
                  color: "black",
                  color: Colors.primary,
                },
              ]}
            >
              {item.lastChat.sender == currentUserID && "You : "}
              {item.lastChat.message}
            </Text>
          </View>
        </View>
        <Text style={{ color: mode ? "white" : "Black" }}>
          {moment(item.lastChat.time).fromNow()}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.page, mode ? getDarkTheme : getLightTheme]}>
      {!isLoading ? (
        chatList.length != 0 ? (
          <FlatList
            data={chatList}
            renderItem={ListingTab}
            keyExtractor={(item, index) => index.toString()}
            style={{ width: "100%" }}
          />
        ) : (
          <NoData
            iconName="chat"
            title="No chats right now !"
            onRefresh={() => getMyProfile()}
          />
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
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    width: Dimensions.get("window").width,
  },
  contactSlab: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
    borderWidth: 0.5,
    padding: 10,
    paddingVertical: 15,
    borderColor: "whitesmoke",
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "space-between",
  },
});
