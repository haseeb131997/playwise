import React, { useEffect, useState } from "react";
import CustomButton from "./customButtons";
import { CustomIcon } from "./customIconPack";
import { View, ActivityIndicator, Text, Alert } from "react-native";
import { Colors, getDarkTheme, getLightTheme } from "../utils/colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Routes } from "../utils/routes";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setUserLogOutState } from "../features/userSlice";
import { ApiCollection } from "../configs/envConfig";
import { DarkModeStatus, UserToken } from "../app/useStore";
import axios from "axios";
import LoadingModal from "./loadingModal";

export function ServerError(props) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const token = UserToken();

  const mode = DarkModeStatus();

  const [isModalVisible, setIsModalVisible] = useState(false);

  // useEffect(()=>{
  //     verifySession()
  // },[])

  const logoutAndClear = async () => {
    dispatch(setUserLogOutState());
    navigation.replace(Routes.onBoardingStack.tag);
    try {
      await axios.post(
        ApiCollection.notificationController.setExpoToken,
        { expoToken: null },
        { headers: { Authorization: "Bearer " + token } }
      );
    } catch {
      console.log("token clear failed !");
    }
  };

  return (
    <View
      style={[
        {
          flex: 1,
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        },
        props.style,
        mode ? getDarkTheme : getLightTheme,
      ]}
    >
      <LoadingModal modalVisible={isModalVisible} />
      <FontAwesome5 name="server" size={40} color={Colors.primary} />
      <Text
        style={{
          fontSize: 17,
          marginTop: 20,
          textAlign: "center",
          color: mode ? getDarkTheme.color : getLightTheme.color,
        }}
      >
        No Internet Connection{"\n"}Can't connect to server
      </Text>
      <CustomButton
        type="outline-small"
        label="Retry"
        onPress={props.onRefresh}
      />
    </View>
  );
}

export function NoData(props) {
  const mode = DarkModeStatus();
  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        },
        props.style,
      ]}
    >
      <CustomIcon name={props.iconName} size={28} active={true} />
      <Text
        style={{
          fontSize: 18,
          marginTop: 20,
          color: mode ? getDarkTheme.color : getLightTheme.color,
        }}
      >
        {props.title}
      </Text>
      <CustomButton
        type="outline-small"
        label="Refresh"
        onPress={props.onRefresh}
      />
    </View>
  );
}

export function DefaultDisplay(props) {
  const mode = DarkModeStatus();

  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        },
        props.style,
      ]}
    >
      {props.showIcon != false && (
        <CustomIcon name={props.iconName} size={30} active={true} />
      )}
      <Text
        style={{
          fontSize: 18,
          marginTop: 20,
          textAlign: "center",
          color: mode ? getDarkTheme.color : getLightTheme.color,
        }}
      >
        {props.title}
      </Text>
    </View>
  );
}

export function Loading(props) {
  const mode = DarkModeStatus();
  return (
    <View
      style={[
        { flex: 1, justifyContent: "center", alignItems: "center" },
        props.style,
      ]}
    >
      <ActivityIndicator
        size="large"
        color={mode ? getDarkTheme.color : Colors.primary}
      />
    </View>
  );
}
