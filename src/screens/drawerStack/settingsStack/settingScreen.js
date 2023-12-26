import React, { useState } from "react";
import {
  View,
  Appearance,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Switch,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  setUserLogOutState,
  toggleDarkMode,
} from "../../../features/userSlice";
import { Routes } from "../../../utils/routes";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import LoadingModal from "../../../components/loadingModal";
import axios from "axios";
import { ApiCollection } from "../../../configs/envConfig";
import { DarkModeStatus, UserId, UserToken } from "../../../app/useStore";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { color } from "react-native-reanimated";

export default function SettingScreen({ navigation }) {
  const [modalVisible, setModalVisble] = useState(false);

  const token = UserToken();
  const dispatch = useDispatch();
  const currentUserId = UserId();
  const mode = DarkModeStatus();

  const logoutAndClear = () => {
    const userId = currentUserId;
    axios.post(ApiCollection.notificationController.setExpoToken, {
      expoToken: null,
      id: userId,
    });
    dispatch(setUserLogOutState());
    navigation.replace(Routes.onBoardingStack.tag);
  };

  const deleteAccountPrompt = () => {
    Alert.alert(
      "Delete Account ?",
      "Are you sure you want to delete your acoount, this action can't be undone!",
      [
        {
          text: "Cancel",
          onPress: () => {
            return;
          },
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deleteAccount(),
          style: "destructive",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const deleteAccount = async () => {
    setModalVisble(true);
    await axios
      .delete(ApiCollection.userController.deleteAccount, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setModalVisble(false);
        logoutAndClear();
      })
      .catch((err) => {
        setModalVisble(false);
        Alert.alert(
          "Delete Account",
          err.response.data.message
            ? err.response.data.message
            : "Something went wrong !"
        );
      });
  };

  const toggleDark = () => {
    dispatch(toggleDarkMode(!mode));
  };

  return (
    <View style={[styles.page, mode ? getDarkTheme : getLightTheme]}>
      <LoadingModal modalVisible={modalVisible} task={"Deactivating ...."} />
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        style={styles.scrollStyle}
      >
        <View
          style={{
            width: Dimensions.get("window").width,
          }}
        >
          <TouchableOpacity
            style={styles.settingTab}
            onPress={() =>
              navigation.navigate(Routes.drawerStack.settingStack.editProfile)
            }
          >
            <FontAwesome5
              name="user-edit"
              size={20}
              style={[styles.iconStyle, mode ? getDarkTheme : getLightTheme]}
            />
            <Text
              style={[
                styles.settingTabTitle,
                mode ? getDarkTheme : getLightTheme,
              ]}
            >
              Edit Personal Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingTab}
            onPress={() =>
              navigation.navigate(
                Routes.drawerStack.settingStack.editWorkProfile
              )
            }
          >
            <FontAwesome5
              name="suitcase"
              size={20}
              style={[styles.iconStyle, mode ? getDarkTheme : getLightTheme]}
            />
            <Text
              style={[
                styles.settingTabTitle,
                mode ? getDarkTheme : getLightTheme,
              ]}
            >
              Edit Professional Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingTab}
            onPress={() =>
              navigation.navigate(
                Routes.drawerStack.settingStack.editSystemInfo
              )
            }
          >
            <Entypo
              name="game-controller"
              size={20}
              style={[styles.iconStyle, mode ? getDarkTheme : getLightTheme]}
            />
            <Text
              style={[
                styles.settingTabTitle,
                mode ? getDarkTheme : getLightTheme,
              ]}
            >
              Edit System Info
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingTab}
            onPress={() =>
              navigation.navigate(Routes.drawerStack.settingStack.editPref)
            }
          >
            <FontAwesome5
              name="hashtag"
              size={20}
              style={[styles.iconStyle, mode ? getDarkTheme : getLightTheme]}
            />
            <Text
              style={[
                styles.settingTabTitle,
                mode ? getDarkTheme : getLightTheme,
              ]}
            >
              Edit Prefrences
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingTab}
            onPress={() =>
              navigation.navigate(Routes.drawerStack.settingStack.blockedUser)
            }
          >
            <FontAwesome5
              name="user-times"
              size={20}
              style={[styles.iconStyle, mode ? getDarkTheme : getLightTheme]}
            />
            <Text
              style={[
                styles.settingTabTitle,
                mode ? getDarkTheme : getLightTheme,
              ]}
            >
              Blocked Users
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingTab}
            onPress={() =>
              navigation.navigate(
                Routes.drawerStack.settingStack.securityScreen
              )
            }
          >
            <SimpleLineIcons
              name="lock"
              size={20}
              style={[styles.iconStyle, mode ? getDarkTheme : getLightTheme]}
            />
            <Text
              style={[
                styles.settingTabTitle,
                mode ? getDarkTheme : getLightTheme,
              ]}
            >
              Change Password
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingTab}
            onPress={() =>
              navigation.navigate(Routes.drawerStack.settingStack.updateEmail)
            }
          >
            <AntDesign
              name="mail"
              size={20}
              style={[styles.iconStyle, mode ? getDarkTheme : getLightTheme]}
            />
            <Text
              style={[
                styles.settingTabTitle,
                mode ? getDarkTheme : getLightTheme,
              ]}
            >
              Update Email
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingTab}
            onPress={() =>
              navigation.navigate(Routes.drawerStack.settingStack.updatePhone)
            }
          >
            <FontAwesome5
              name="phone-alt"
              size={20}
              style={[styles.iconStyle, mode ? getDarkTheme : getLightTheme]}
            />
            <Text
              style={[
                styles.settingTabTitle,
                mode ? getDarkTheme : getLightTheme,
              ]}
            >
              Update Phone number
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingTab}
            // onPress={() => {
            //   if (mode == true) {
            //     dispatch(toggleDarkMode(false));
            //   } else {
            //     dispatch(toggleDarkMode(false));
            //   }
            // }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <View style={{flexDirection:'row',alignItems:'center'}}>
              <MaterialCommunityIcons
                name="theme-light-dark"
                size={25}
                style={[styles.iconStyle, mode ? getDarkTheme : getLightTheme]}
              />
              <Text style={[styles.settingTabTitle,mode ? getDarkTheme : getLightTheme,]}>Dark Theme</Text>

              </View>
            
              <Switch
                style={{ marginLeft: 20 }}
                onValueChange={toggleDark}
                value={mode}
                
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingTab}
            onPress={() =>
              navigation.navigate(Routes.drawerStack.settingStack.aboutUsScreen)
            }
          >
            <MaterialIcons
              name="info"
              size={20}
              style={[styles.iconStyle, mode ? getDarkTheme : getLightTheme]}
            />
            <Text
              style={[
                styles.settingTabTitle,
                mode ? getDarkTheme : getLightTheme,
              ]}
            >
              About App
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingTab}
            onPress={deleteAccountPrompt}
          >
            <MaterialIcons
              color={"red"}
              name="delete"
              size={20}
              style={[styles.iconStyle, mode ? getDarkTheme : getLightTheme]}
            />
            <Text
              style={[
                [styles.settingTabTitle, mode ? getDarkTheme : getLightTheme],
                { color: "red" },
              ]}
            >
              Delete Account
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.settingTab} onPress={()=>navigation.navigate(Routes.drawerStack.settingStack.aboutUsScreen)} >
                        <MaterialIcons name='info' size={22} style={{marginRight:10}}/>
                        <Text style={[styles.settingTabTitle, mode ? getDarkTheme : getLightTheme]}>About Us</Text>
                    </TouchableOpacity> */}

          {/* <TouchableOpacity style={styles.settingTab} >
                        <MaterialIcons name='delete' size={22} color={'red'} style={{marginRight:10}}/>
                        <Text style={[[styles.settingTabTitle, mode ? getDarkTheme : getLightTheme],{color:'red'}]}>Delete Account</Text>
                    </TouchableOpacity> */}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollStyle: {
    width: "100%",
  },

  settingTab: {
    padding: 15,
    // backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  settingTabTitle: {
    fontSize: 15,
  },
  iconStyle: {
    marginRight: 10,
  },
});
