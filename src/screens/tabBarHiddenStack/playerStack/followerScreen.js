import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import axios from "axios";
import { DarkModeStatus, UserToken } from "../../../app/useStore";
import { ApiCollection } from "../../../configs/envConfig";
import { Routes } from "../../../utils/routes";
import { useNavigation } from "@react-navigation/native";
import {
  Loading,
  NoData,
  ServerError,
} from "../../../components/exceptionHolders";
import { get } from "react-native/Libraries/Utilities/PixelRatio";

const ListingTab = ({ item }) => {
  const navigation = useNavigation();
  const mode = DarkModeStatus();
  return (
    <TouchableOpacity
      style={[
        styles.contactSlab,
        {
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        },
      ]}
      onPress={() => {
        navigation.push(Routes.tabBarHiddenScreens.playerStack.tag, {
          userId: item._id,
          username: item.username,
        });
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        }}
      >
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
            style={{ fontSize: 12, marginTop: 2, width: "100%", color: "grey" }}
          >
            {item.name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const FollowerTab = ({ route, navigation }) => {
  useEffect(() => {
    getFollowers();
  }, []);

  // const mode = DarkModeStatus();

  const token = UserToken();
  const [followers, setFollowers] = useState(null);
  const [loading, setLoading] = useState(true);

  const getFollowers = async () => {
    setLoading(true);
    await axios
      .get(
        `${ApiCollection.userController.getFollowers}/${route.params.userId}`
      )
      .then((res) => {
        setFollowers(res.data.data.followersList);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const renderItem = ({ item }) => {
    return <ListingTab item={item} />;
  };
  const mode = DarkModeStatus();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: mode
          ? getDarkTheme.backgroundColor
          : getLightTheme.backgroundColor,
      }}
    >
      {!loading ? (
        followers != null ? (
          followers.length != 0 ? (
            <FlatList data={followers} renderItem={renderItem} />
          ) : (
            <NoData
              iconName="people"
              title="No Followers"
              onRefresh={() => getFollowers()}
            />
          )
        ) : (
          <ServerError onRefresh={() => getFollowers()} />
        )
      ) : (
        <Loading />
      )}
    </View>
  );
};

const FollowingTab = ({ route, navigation }) => {
  useEffect(() => {
    getFollowings();
  }, []);

  const token = UserToken();
  const [followings, setFollowings] = useState(null);
  const [loading, setLoading] = useState(true);

  const mode = DarkModeStatus();

  const getFollowings = async () => {
    setLoading(true);
    await axios
      .get(
        `${ApiCollection.userController.getFollowings}/${route.params.userId}`
      )
      .then((res) => {
        setFollowings(res.data.data.followingList);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const renderItem = ({ item }) => {
    return <ListingTab item={item} />;
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: mode
          ? getDarkTheme.backgroundColor
          : getLightTheme.backgroundColor,
      }}
    >
      {!loading ? (
        followings != null ? (
          followings.length != 0 ? (
            <FlatList data={followings} renderItem={renderItem} />
          ) : (
            <NoData
              iconName="people"
              title="No Followings"
              onRefresh={() => getFollowings()}
            />
          )
        ) : (
          <ServerError onRefresh={() => getFollowings()} />
        )
      ) : (
        <Loading />
      )}
    </View>
  );
};

const Tab = createMaterialTopTabNavigator();

export default function FollowerScreen({ route }) {
  const mode = DarkModeStatus();
  const tabOptions = {
    tabBarIndicatorStyle: { backgroundColor: Colors.primary },
  };

  return (
    <Tab.Navigator
      initialRouteName={route.params.type}
      screenOptions={{
        tabBarActiveTintColor: mode ? getDarkTheme.color : getLightTheme.color,
        tabBarStyle: {
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        },
      }}
    >
      <Tab.Screen
        initialParams={{ userId: route.params.userId }}
        name="Followers"
        component={FollowerTab}
        options={tabOptions}
      />
      <Tab.Screen
        initialParams={{ userId: route.params.userId }}
        name="Following"
        component={FollowingTab}
        options={tabOptions}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  contactSlab: {
    width: Dimensions.get("window").width,
    flexDirection: "row",
    borderWidth: 0.5,
    padding: 10,
    paddingVertical: 15,
    borderColor: "whitesmoke",
    borderRadius: 5,
    justifyContent: "space-between",
  },
});
