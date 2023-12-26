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
  Alert,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import axios from "axios";
import { DarkModeStatus, UserId, UserToken } from "../../../app/useStore";
import { ApiCollection } from "../../../configs/envConfig";
import { Routes } from "../../../utils/routes";
import { useNavigation } from "@react-navigation/native";
import {
  Loading,
  NoData,
  ServerError,
} from "../../../components/exceptionHolders";
import CustomButton from "../../../components/customButtons";
import { CustomIcon } from "../../../components/customIconPack";
import LoadingModal from "../../../components/loadingModal";
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

const ListingTab = ({ item, type }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const token = UserToken();
  const userId = item._id;
  const currentUserId = UserId();
  const db = getDatabase();

  const openMessages = () => {
    const routeData = {
      name: item.name ? item.name : item.username,
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

  const unFollowUser = async () => {
    setModalVisible(true);
    await axios
      .put(
        `${ApiCollection.userController.unFollowUser}/${item._id}`,
        {},
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((response) => {
        setModalVisible(false);
        Alert.alert("UnFollow", "User Un-Followed successfully !");
        navigation.goBack();
      })
      .catch((error) => {
        setModalVisible(false);
        Alert.alert("UnFollow", "Some error occured,please try again later !");
      });
  };

  const acceptRequest = async (userId) => {
    setIsModalLoading(true);
    await axios
      .put(`${ApiCollection.notificationController.accetReq}/${item._id}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        setIsModalLoading(false);
        Alert.alert("Success", "Request Accepted");
        navigation.goBack();
      })
      .catch((err) => {
        setIsModalLoading(false);
        Alert.alert("Error", "Something went wrong");
      });
  };

  const removeFollower = async () => {
    setModalVisible(true);
    await axios
      .post(
        `${ApiCollection.userController.removeFollower}/${item._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setModalVisible(false);
        Alert.alert("Success", "Follower Removed");
        navigation.goBack();
      })
      .catch((err) => {
        setModalVisible(false);
        Alert.alert("Error", "Something went wrong");
      });
  };

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
        navigation.navigate(Routes.tabBarHiddenScreens.playerStack.tag, {
          userId: item._id,
          username: item.username,
        });
      }}
    >
      <LoadingModal modalVisible={modalVisible} />
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
          <View
            style={{
              marginLeft: 10,
              backgroundColor: mode
                ? getDarkTheme.backgroundColor
                : getLightTheme.backgroundColor,
            }}
          >
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
                color: "grey",
              }}
            >
              {item.name}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: mode
              ? getDarkTheme.backgroundColor
              : getLightTheme.backgroundColor,
          }}
        >
          <TouchableOpacity style={{ marginRight: 20 }} onPress={openMessages}>
            <CustomIcon name="chat" active={true} />
          </TouchableOpacity>
          {type == "follower" ? (
            <CustomButton
              onPress={removeFollower}
              style={{ marginTop: 0, paddingHorizontal: 8 }}
              type="outline-small"
              label="Remove"
            />
          ) : type == "following" ? (
            <CustomButton
              onPress={unFollowUser}
              style={{ marginTop: 0, paddingHorizontal: 8 }}
              type="outline-small"
              label="Unfollow"
            />
          ) : (
            <CustomButton
              onPress={acceptRequest}
              style={{ marginTop: 0, paddingHorizontal: 8 }}
              type="outline-small"
              label="Accept"
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const FollowerTab = ({ navigation }) => {
  useEffect(() => {
    getFollowers();
  }, []);

  const token = UserToken();
  const currentUserId = UserId();
  const [followers, setFollowers] = useState(null);
  const [loading, setLoading] = useState(true);

  const getFollowers = async () => {
    setLoading(true);
    await axios
      .get(`${ApiCollection.userController.getFollowers}/${currentUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFollowers(res.data.data.followersList);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const mode = DarkModeStatus();
  const renderItem = ({ item }) => {
    return <ListingTab item={item} type="follower" />;
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

const FollowingTab = ({ navigation }) => {
  useEffect(() => {
    getFollowings();
  }, []);

  const mode = DarkModeStatus();
  const token = UserToken();
  const currentUserId = UserId();
  const [followings, setFollowings] = useState(null);
  const [loading, setLoading] = useState(true);

  const getFollowings = async () => {
    setLoading(true);
    await axios
      .get(`${ApiCollection.userController.getFollowings}/${currentUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFollowings(res.data.data.followingList);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const renderItem = ({ item }) => {
    return <ListingTab item={item} type="following" />;
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

const PendingTab = ({ navigation }) => {
  useEffect(() => {
    getPendingReqs();
  }, []);

  const mode = DarkModeStatus();

  const token = UserToken();
  const currentUserId = UserId();
  const [pendingRequests, setPendingRequests] = useState(null);
  const [loading, setLoading] = useState(true);

  const getPendingReqs = async () => {
    setLoading(true);
    await axios
      .get(
        `${ApiCollection.userController.getPendingRequests}/${currentUserId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setPendingRequests(res.data.data == null ? [] : res.data.data.requests);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const renderItem = ({ item }) => {
    return <ListingTab item={item} type="pending" />;
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
        pendingRequests != null ? (
          pendingRequests.length != 0 ? (
            <FlatList data={pendingRequests} renderItem={renderItem} />
          ) : (
            <NoData
              iconName="people"
              title="No Pending Requests"
              onRefresh={() => getPendingReqs()}
            />
          )
        ) : (
          <ServerError onRefresh={() => getPendingReqs()} />
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
    tabBarIndicatorStyle: { backgroundColor: mode ? getDarkTheme.backgroundColor : Colors.primary },
  };

  return (
    <Tab.Navigator
      initialRouteName={route.params.type}
      screenOptions={{
        tabBarActiveTintColor:"white",
        tabBarStyle: {
          backgroundColor: Colors.primary,
        },
      }}
    >
      <Tab.Screen
        name="Followers"
        component={FollowerTab}
        options={tabOptions}
      />
      <Tab.Screen
        name="Following"
        component={FollowingTab}
        options={tabOptions}
      />
      {route.params.accountType == "private" && (
        <Tab.Screen
          name="Pending"
          component={PendingTab}
          options={tabOptions}
        />
      )}
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
