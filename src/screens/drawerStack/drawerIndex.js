import React, { useEffect } from "react";
import { Routes } from "../../utils/routes";
import { Colors, getDarkTheme, getLightTheme } from "../../utils/colors";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View } from "react-native";
import {
  Ionicons,
  Entypo,
  AntDesign,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import BottomTabNavigator from "../tabStack/tabIndex";
import CustomDrawer from "../../components/customDrawer";
import { Header } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import SettingNavigator from "./settingsStack/settingIndex";
import TermScreen from "./termsScreen";
import PrivacyPolicyScreen from "./privacyPolicyScreen";
import ProfilNavigator from "./profileStack/profileIndex";
import authenticationListner from "../../components/authenticationListner";
import UpcomingScreen from "./upcomingScreen";
import { DarkModeStatus } from "../../app/useStore";

const GradientHeader = (props) => (
  <View style={{ backgroundColor: "red" }}>
    <LinearGradient
      colors={["#F12422", "#F14722", "#F16B22", "#F29923"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[StyleSheet.absoluteFill]}
    />
    <Header {...props} />
  </View>
);

// const mode = DarkModeStatus();
const Drawer = createDrawerNavigator();

function DrawerStack() {
  const mode = DarkModeStatus();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      initialRouteName={Routes.drawerStack.homeScreen}
      screenOptions={{
        headerStyle: {
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        },
        headerTintColor:Colors.primary,
        drawerInactiveTintColor: "grey",
        drawerActiveTintColor: Colors.primary,
        drawerActiveBackgroundColor: mode?getDarkTheme.backgroundColor: "white",
        drawerItemStyle: {
          borderBottomColor:mode?'transparent': "whitesmoke",
          borderBottomWidth: 1,
        },
        drawerLabelStyle: { fontSize: 15, marginHorizontal: -15 },
      }}
    >
      <Drawer.Screen
        name={Routes.drawerStack.homeScreen}
        component={BottomTabNavigator}
        options={{
          headerShown: false,
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name={Routes.drawerStack.profileStack.tag}
        component={ProfilNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <FontAwesome5 name={"user-circle"} size={22} color={color} />
          ),
          title: "My Profile",
          headerShown: false,
          headerShadowVisible: false,
        }}
      />

      <Drawer.Screen
        name={Routes.drawerStack.termOfUse}
        component={TermScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="newspaper" size={22} color={color} />
          ),
          headerShown: true,
          headerShadowVisible: false,
        }}
      />

      <Drawer.Screen
        name={Routes.drawerStack.privacyPolicy}
        component={PrivacyPolicyScreen}
        options={{
          drawerIcon: ({ color }) => (
            <MaterialIcons name="policy" size={22} color={color} />
          ),
          headerShown: true,
          headerShadowVisible: false,
        }}
      />

      <Drawer.Screen
        name={Routes.drawerStack.settingStack.tag}
        component={SettingNavigator}
        options={{
          drawerLabel: "Setting",
          drawerIcon: ({ color }) => (
            <AntDesign name="setting" size={22} color={color} />
          ),
          headerShown: false,
          headerShadowVisible: false,
        }}
      />

      <Drawer.Screen
        name={Routes.drawerStack.upcomingScreen}
        component={UpcomingScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Entypo name="new" size={22} color={color} />
          ),
          headerShown: true,
          headerShadowVisible: false,
        }}
      />
    </Drawer.Navigator>
  );
}

export default DrawerStack;
