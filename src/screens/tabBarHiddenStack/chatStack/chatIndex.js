import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Routes } from "../../../utils/routes";
import ChatListingScreen from "./chatListingScreen";
import ChatMessageScreen from "./chatMessageScreen";
import ChatSettingScreen from "./chatSettingsScreen";
import { TouchableOpacity } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import PlayerNavigator from "../playerStack/playerIndex";
import IonIcons from "@expo/vector-icons/Ionicons";
import UserSearchScreen from "./userSearchScreen";
import { DarkModeStatus } from "../../../app/useStore";
import { getDarkTheme, getLightTheme } from "../../../utils/colors";

const ChatStack = createStackNavigator();

const ChatNavigator = ({ route, navigation }) => {

  const mode = DarkModeStatus();
  return (
    <ChatStack.Navigator
      initialRouteName={Routes.tabBarHiddenScreens.chatStack.chatListingScreen}
      screenOptions={{headerStyle: { backgroundColor: mode?'#424240':"white" },
      headerTintColor:  mode ? getDarkTheme.color : getLightTheme.color,}}
    >
      <ChatStack.Screen
        name={Routes.tabBarHiddenScreens.chatStack.chatListingScreen}
        component={ChatListingScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(
                  Routes.tabBarHiddenScreens.chatStack.initiateChatScreen
                );
              }}
            >
              <Entypo
                name="plus"
                size={30}
                style={{ marginHorizontal: 15 }}
                color={"black"}
              />
            </TouchableOpacity>
          ),
        })}
      />

      <ChatStack.Screen
        name={Routes.tabBarHiddenScreens.chatStack.initiateChatScreen}
        component={UserSearchScreen}
      />

      <ChatStack.Screen
        name={Routes.tabBarHiddenScreens.chatStack.chatMessageScreen}
        component={ChatMessageScreen}
        options={({ route, navigation }) => ({
          headerShown: true,
          headerTitle: route.params.user.username,
          // headerLeft:()=>(
          //   <TouchableOpacity onPress={()=>{navigation.goBack()}}>
          //        <IonIcons name="arrow-back" size={28} style={{marginHorizontal:15}} color={'black'} />
          //   </TouchableOpacity>
          // ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(
                  Routes.tabBarHiddenScreens.chatStack.chatSettingsScreen,
                  { user: route.params.user }
                );
              }}
            >
              <Entypo
                name="dots-three-vertical"
                size={22}
                style={{ marginHorizontal: 15 }}
                color={"black"}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <ChatStack.Screen
        name={Routes.tabBarHiddenScreens.chatStack.chatSettingsScreen}
        component={ChatSettingScreen}
        options={{ headerShown: true }}
      />
      <ChatStack.Screen
        name={Routes.tabBarHiddenScreens.playerStack.tag}
        component={PlayerNavigator}
        options={{ headerShown: false }}
      />
    </ChatStack.Navigator>
  );
};

export default ChatNavigator;
