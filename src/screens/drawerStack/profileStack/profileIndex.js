import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Routes } from "../../../utils/routes";
import ProfileScreen from "./myProfileScreen";
import FollowerScreen from "./followerScreen";
import PlayerNavigator from "../../tabBarHiddenStack/playerStack/playerIndex";
import PubgStatsScreen from "../../../components/statsScreens/pubgStatScreen";
import FortniteStatsScreen from "../../../components/statsScreens/fortniteStatsScreen";
import ApexStatsScreen from "../../../components/statsScreens/apexStatsScreen";
import CocStatsScreen from "../../../components/statsScreens/cocStatScreen";
import CSGoStatsScreen from "../../../components/statsScreens/csgoStatsScreen";
import { View, TouchableOpacity } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from "../../../utils/colors";
import ChatNavigator from "../../tabBarHiddenStack/chatStack/chatIndex";
import ChatMessageScreen from "../../tabBarHiddenStack/chatStack/chatMessageScreen";
import PostNavigator from "../../tabBarHiddenStack/postStack/postIndex";
import EditSocialScreen from "./editSocials";
import ShareCardScreen from "../../../components/statsScreens/shareCardScreen";

const ProfileStack = createStackNavigator();

const ProfilNavigator = () => {
  return (
    <ProfileStack.Navigator
      initialRouteName={Routes.drawerStack.profileStack.profileScreen}
      screenOptions={{
        headerStyle: { backgroundColor: Colors.gradientPack[1] },
        headerTintColor: "white",
      }}
    >
      <ProfileStack.Screen
        name={Routes.drawerStack.profileStack.profileScreen}
        component={ProfileScreen}
        options={({ route, navigation }) => ({
          headerLeft: ({ route }) => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Entypo
                  name="menu"
                  size={28}
                  style={{ marginLeft: 15 }}
                  color={"white"}
                />
              </TouchableOpacity>
            </View>
          ),
          headerShown: true,
          headerTitle: "My Profile",
        })}
      />
      <ProfileStack.Screen
        name={Routes.drawerStack.profileStack.followerScreen}
        component={FollowerScreen}
        options={{ headerShown: true, headerTitle: "" }}
      />
      <ProfileStack.Screen
        name={Routes.drawerStack.profileStack.myStats.pubg}
        component={PubgStatsScreen}
        options={{
          headerShown: false,
          headerTransparent: true,
          headerTitle: "",
        }}
      />
      <ProfileStack.Screen
        name={Routes.drawerStack.profileStack.myStats.fortnite}
        component={FortniteStatsScreen}
        options={{
          headerShown: false,
          headerTransparent: true,
          headerTitle: "",
        }}
      />
      <ProfileStack.Screen
        name={Routes.drawerStack.profileStack.myStats.apex}
        component={ApexStatsScreen}
        options={{
          headerShown: false,
          headerTransparent: true,
          headerTitle: "",
        }}
      />
      <ProfileStack.Screen
        name={Routes.drawerStack.profileStack.myStats.coc}
        component={CocStatsScreen}
        options={{
          headerShown: false,
          headerTransparent: true,
          headerTitle: "",
        }}
      />
      <ProfileStack.Screen
        name={Routes.drawerStack.profileStack.myStats.csgo}
        component={CSGoStatsScreen}
        options={{
          headerShown: false,
          headerTransparent: true,
          headerTitle: "",
        }}
      />
      <ProfileStack.Screen
        name={Routes.drawerStack.profileStack.editSocialScreen}
        component={EditSocialScreen}
        options={{
          headerShown: true,
          headerTransparent: false,
          headerTitle: "Connect Social",
        }}
      />

      <ProfileStack.Screen
        name={Routes.drawerStack.profileStack.myStats.shareCardScreen}
        component={ShareCardScreen}
        options={{ headerShown: true, headerTransparent: false }}
      />

      <ProfileStack.Screen
        name={Routes.tabBarHiddenScreens.playerStack.tag}
        component={PlayerNavigator}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name={Routes.tabBarHiddenScreens.chatStack.chatMessageScreen}
        component={ChatMessageScreen}
        options={({ route }) => ({
          headerShown: true,
          headerTitle: route.params.user.username,
          // headerRight:()=>(
          //   <TouchableOpacity onPress={()=>{navigation.navigate(Routes.tabBarHiddenScreens.chatStack.chatSettingsScreen,{user:route.params.chatPerson})}}>
          //        <Entypo name="dots-three-vertical" size={22} style={{marginHorizontal:15}} color={'black'} />
          //   </TouchableOpacity>
          // )
        })}
      />

      <ProfileStack.Screen
        name={Routes.tabBarHiddenScreens.postStack.tag}
        component={PostNavigator}
        options={{
          headerShown: false,
          headerTransparent: true,
          headerTitle: "",
        }}
      />
    </ProfileStack.Navigator>
  );
};

export default ProfilNavigator;
