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
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  DefaultDisplay,
  Loading,
  NoData,
} from "../../../components/exceptionHolders";
import { color } from "react-native-reanimated";

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>
  );
};

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>SettingsScreen Screen</Text>
    </View>
  );
};

export default function SearchScreen({ navigation }) {
  const token = UserToken();
  const currentUserID = UserId();

  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);

  const tabList = [
    { name: "users", component: <HomeScreen navigation={navigation} /> },
    { name: "posts", component: <SettingsScreen navigation={navigation} /> },
  ];

  const ListingTab = ({ item }) => {
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{ uri: item.profilePic }}
            style={{ width: 40, height: 40, borderRadius: 50 }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text
              style={[
                { fontSize: 16 },
                {
                  color: mode
                    ? getLightTheme.backgroundColor
                    : getDarkTheme.backgroundColor,
                },
              ]}
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
                color: "grey",
              }}
            >
              {item.name}
            </Text>
          </View>
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
          (item) => item._id !== currentUserID
        );
        setResult(filteredSearch);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  const mode = DarkModeStatus();

  return (
    <View style={[styles.page, mode ? getDarkTheme : getLightTheme]}>
      <TextInput
        style={[styles.input, mode ? inputDarkTheme : getLightTheme]}
        placeholder="Search users..."
        onChangeText={(text) => searchUser(text)}
      />

      {/* <TouchableOpacity onPress={()=>navigation.navigate(Routes.tabBarHiddenScreens.searchStack.scanScreen)} style={{width:'90%',backgroundColor:'whitesmoke',paddingVertical:18,paddingHorizontal:10,borderRadius:5,marginBottom:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
          <Text style={{fontSize:17,fontWeight:'500',color:Colors.primary}}>Scan PW Card</Text>
          <MaterialIcons name="qr-code-scanner" size={30} color={Colors.primary}/>
        </TouchableOpacity> */}

      {/* <View style={{flexDirection:'row',justifyContent:'space-evenly',width:'96%',padding:10}}>
          <TouchableOpacity onPress={()=>setCurrentTab(0)}  style={[styles.customTabButtons,tabList[currentTab].name=='users' && {borderBottomColor:Colors.primary,borderBottomWidth:2}]}>
              <Text style={{textAlign:'center'}}>Users</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={()=>setCurrentTab(1)}  style={[styles.customTabButtons,tabList[currentTab].name=='posts' && {borderBottomColor:Colors.primary,borderBottomWidth:2}]}>
            <Text style={{textAlign:'center'}}>Posts</Text>
          </TouchableOpacity>
        </View> */}
      {/* 
        <View style={{width:'96%'}}>
            {tabList[currentTab].component}
        </View> */}

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
    // backgroundColor: Colors.secondary,
    // color: "white",
  },
  input: {
    marginVertical: 15,
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    width: "90%",
    fontSize: 16,
    borderRadius: 5,
    // backgroundColor: Colors.secondary,
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
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "space-between",
  },
});
