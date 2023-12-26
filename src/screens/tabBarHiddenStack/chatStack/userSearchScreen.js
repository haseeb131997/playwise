import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  Colors,
  getDarkTheme,
  getLightTheme,
  inputDarkTheme,
} from "../../../utils/colors";
import axios from "axios";
import { ApiCollection } from "../../../configs/envConfig";
import { DarkModeStatus, UserToken } from "../../../app/useStore";
import { Routes } from "../../../utils/routes";
import { UserId } from "../../../app/useStore";
import {
  DefaultDisplay,
  Loading,
  NoData,
} from "../../../components/exceptionHolders";
import { CustomIcon } from "../../../components/customIconPack";
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
// import { darkTheme } from "@flyerhq/react-native-chat-ui";

export default function UserSearchScreen({ navigation }) {
  const token = UserToken();
  const currentUserId = UserId();

  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const db = getDatabase();

  const mode = DarkModeStatus();

  const ListingTab = ({ item }) => {
    const openMessages = () => {
      const routeData = {
        name: item.name,
        id: item._id,
        username: item.username,
        profilePic: item.profilePic,
        chatId: `${currentUserId},${item._id}`,
      };

      const reference = ref(db, "chats/" + routeData.chatId);
      get(reference).then((snapshot) => {
        if (snapshot.exists()) {
          navigation.navigate(
            Routes.tabBarHiddenScreens.chatStack.chatMessageScreen,
            { user: routeData }
          );
        } else {
          routeData.chatId = `${item._id},${currentUserId}`;
          navigation.navigate(
            Routes.tabBarHiddenScreens.chatStack.chatMessageScreen,
            { user: routeData }
          );
        }
      });

      //navigation.navigate(Routes.tabBarHiddenScreens.chatStack.chatMessageScreen,{user:routeData})
    };

    return (
      <TouchableOpacity
        style={[styles.contactSlab, mode ? getDarkTheme : getLightTheme]}
        onPress={() => {
          navigation.navigate(Routes.tabBarHiddenScreens.playerStack.tag, {
            userId: item._id,
            username: item.username,
          });
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            backgroundColor: mode
              ? getDarkTheme.backgroundColor
              : getLightTheme.backgroundColor,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: item.profilePic }}
              style={{ width: 40, height: 40, borderRadius: 50 }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                {item.username}
              </Text>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: 12,
                  marginTop: 2,
                  width: "100%",
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                {item.name}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={{ marginRight: 20 }} onPress={openMessages}>
            <CustomIcon name="chat" active={true} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const searchUser = (query) => {
    setLoading(true);
    setSearch(query);
    axios
      .get(`${ApiCollection.userController.userSearch}?search=${query}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        setLoading(false);
        const filteredSearch = response.data.data.filter(
          (item) => item._id !== currentUserId
        );
        setResult(filteredSearch);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  return (
    <View style={[styles.page, mode ? getDarkTheme : getLightTheme]}>
      <TextInput
        style={[styles.input, mode ? inputDarkTheme : getLightTheme]}
        placeholder="Search users..."
        onChangeText={(text) => searchUser(text)}
      />

      {!loading ? (
        result !== null ? (
          result.length > 0 ? (
            <FlatList
              data={result}
              renderItem={ListingTab}
              keyExtractor={(item, index) => index.toString()}
              style={{ width: "100%" }}
            />
          ) : (
            <DefaultDisplay
              iconName="search"
              title={`No results found for "${search}"`}
            />
          )
        ) : (
          <DefaultDisplay
            iconName="search"
            title="Start typing to search users"
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
  },
  input: {
    marginVertical: 15,
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    width: "90%",
    fontSize: 16,
    borderRadius: 5,
  },
  tabHead: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    margin: 15,
  },
  customTabButtons: {
    width: "50%",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
    padding: 10,
  },
  contactSlab: {
    flexDirection: "row",
    borderWidth: 0.5,
    padding: 10,
    paddingVertical: 15,
    borderColor: "whitesmoke",
    // backgroundColor:'white',
    borderRadius: 5,
    justifyContent: "space-between",
  },
});
