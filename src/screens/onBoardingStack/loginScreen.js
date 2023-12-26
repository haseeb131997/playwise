import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Appearance,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Linking
} from "react-native";
import { Colors, getDarkTheme, getLightTheme } from "../../utils/colors";
import { Routes } from "../../utils/routes";
import logo from "../../../assets/logo/logo.png";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
// import * as Linking from "expo-linking";
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
import { ApiCollection, envConfig } from "../../configs/envConfig";
import axios from "axios";
import LoadingModal from "../../components/loadingModal";
import { useDispatch } from "react-redux";
import { setActiveUser } from "../../features/userSlice";
import GoogleAuth from "../../configs/socialAuth/googleAuth";
import FacebookAuth from "../../configs/socialAuth/facebookAuth";
import DiscordAuth from "../../configs/socialAuth/discordAuth";
import authVector from "../../../assets/vectors/authVector.png";
import AppleAuth from "../../configs/socialAuth/appleAuth";
import { DarkModeStatus } from "../../app/useStore";
import WhatsAppLoginButton from "./../../configs/socialAuth/whatsAppLoginButton";

export default function LoginScreen({ navigation, route }) {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passHidden, setPassHidden] = useState(true);
  const mode = DarkModeStatus();

  const dispatch = useDispatch();

  const contactIsEmail = (contact) => {
    //Validates the email address
    var emailRegex =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return emailRegex.test(contact);
  };

  const contactIsPhone = (contact) => {
    //Validates the phone number
    var phoneRegex = /^(\+91-|\+91|0)?\d{10}$/; // Change this regex based on requirement
    return phoneRegex.test(contact);
  };

  const contactType = () => {
    if (contactIsEmail(contact) == false) {
      return contactIsPhone(contact) ? "phone" : "invalid";
    } else return "email";
  };

  const login = async () => {
    if (contact === "" || password === "") {
      Alert.alert("Login", "Please fill all the fields");
    } else {
      setLoading(true);
      await axios
        .post(ApiCollection.authController.login, {
          contact: contactType()=='email'? contact.toLowerCase():contact,
          password: password,
        })
        .then((response) => {
          const apiResponse = response.data;
          if (apiResponse.success) {
            if (apiResponse.data.isOnBoarding == true) {
              dispatch(
                setActiveUser({
                  userToken: apiResponse.data.accessToken,
                  loggedIn: true,
                  userId: apiResponse.data.id,
                })
              );
              setLoading(false);
              navigation.replace(Routes.drawerStack.drawerTag);
            } else {
              setLoading(false);
              if (contactType() == "phone") {
                navigation.navigate(Routes.onBoardingStack.userNameScreen, {
                  token: apiResponse.data.accessToken,
                  userId: apiResponse.data.id,
                  phone: contact,
                  email: null,
                  loginType: "custom",
                });
              } else {
                navigation.navigate(Routes.onBoardingStack.userNameScreen, {
                  token: apiResponse.data.accessToken,
                  userId: apiResponse.data.id,
                  phone: null,
                  email: contact,
                  loginType: "custom",
                });
              }
            }
          } 
          // else {
          //   Alert.alert("Login", response.message);
          //   console.log("error", )
          // }
        })
        .catch((err) => {
          setLoading(false);
          console.log(ApiCollection.authController.login);
          console.log(err.response.data);
          Alert.alert(
            "Login",
            err.response.data.message
              ? err.response.data.message
              : "No Internet connection !"
          );
          // console.log(err.response.data);
          if (
            err.response.data?.data?.isVerified !== undefined &&
            contactType() == "phone"
          ) {
            if (err.response.data.data.isVerified == false) {
              navigation.navigate(Routes.onBoardingStack.phoneVerify, {
                phoneNumber: contact,
              });
            }
          }
        });
    }
  };

  const socialLoginAllowed = () => {
    if (envConfig.env == "prod" && Platform.OS == "android") {
      return true;
    } else if (envConfig.env == "dev" && Platform.OS == "android") {
      return true;
    } else if (envConfig.env == "dev" && Platform.OS == "ios") {
      return true;
    } else if (envConfig.env == "prod" && Platform.OS == "ios") {
      return false;
    }
  };
  // useEffect(() => {
  //   const linkingEvent = Linking.addEventListener('url', handleDeepLink);
  //   Linking.getInitialURL().then(url => {
  //        if (url) { handleDeepLink({url});}
  //       });
  //       return () => { 
  //        linkingEvent.remove();
  //       };
  // }, [handleDeepLink]);
    
  //   const handleDeepLink = async url => {
  //   const waId = new URLSearchParams(url.query).get('waId');
  // };
  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <LoadingModal modalVisible={loading} />
      <View style={[styles.page, mode ? getDarkTheme : getLightTheme]}>
        <Text style={[styles.textStyle, mode ? getDarkTheme : getLightTheme]}>
          WELCOME TO
        </Text>
        <Image source={logo} style={{ width: "70%", height: 40 , marginBottom:10}} />

        

        <Text style={[styles.logoText1, mode ? getDarkTheme : getLightTheme]}>
          LOGIN
        </Text>
        <TextInput
          style={[
            styles.input,
            mode ? styles.inputDarkBgColor : styles.inputLightBgColor,
          ]}
          placeholder="Email or Phone"
          keyboardType="email-address"
          onChangeText={(text) => setContact(text)}
        />

        <View
          style={[
            styles.input,
            {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            },
            mode ? styles.inputDarkBgColor : styles.inputLightBgColor,
          ]}
        >
          <TextInput
            style={[
              styles.pwdInput,
              mode ? styles.inputDarkBgColor : styles.inputLightBgColor,
            ]}
            placeholder="Password"
            secureTextEntry={passHidden}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity onPress={() => setPassHidden(!passHidden)}>
            {passHidden ? (
              <AntDesign
                name="eyeo"
                size={22}
                color={mode ? "black" : "grey"}
              />
            ) : (
              <AntDesign name="eye" size={22} color={mode ? "white" : "grey"} />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(Routes.onBoardingStack.forgetPassword)
          }
        >
          <Text
            style={{
              fontWeight: "500",
              fontSize: 16,
              marginVertical: 10,
              marginBottom: 30,
              color: Colors.primary,
            }}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={login}
          style={[styles.button,  styles.buttonLtBg]}
        >
          <Text
            style={{
              textAlign: "center",
              fontWeight: "500",
              fontSize: 16,
              color: "white",
            }}
          >
            Login
          </Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            width: "80%",
            alignItems: "center",
            marginVertical: 30,
          }}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
          <View>
            <Text
              style={[
                { width: 50, textAlign: "center" },
                { color: mode ? "white" : "black" },
              ]}
            >
              OR
            </Text>
          </View>
          <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
        </View>

        {socialLoginAllowed() && (
          <View
            style={{
              flexDirection: "row",
              width: "50%",
              alignContent:"center",
              justifyContent:"center",
              alignItems:"center"
            }}
          >
            <GoogleAuth />
            {/* <FacebookAuth /> */}
            {/* <WhatsAppLoginButton /> */}
            {Platform.OS === "ios" && <AppleAuth />}
          </View>
        )}

        <TouchableOpacity
          onPress={() =>
            navigation.navigate(Routes.onBoardingStack.signUpScreen)
          }
          style={{ marginTop: 20 }}
        >
          <Text style={[{ fontSize: 15 }, { color: mode ? "white" : "black" }]}>
            Don't have an account ?{" "}
            <Text style={{ color: Colors.primary }}>Sign up </Text>{" "}
          </Text>
        </TouchableOpacity>

        {/* {envConfig.env == "dev" && (
        //   <View
        //     style={{
        //       padding: 10,
        //       borderRadius: 10,
        //       paddingHorizontal: 30,
        //       borderColor: Colors.primary,
        //       backgroundColor: Colors.primary,
        //       borderWidth: 2,
        //       position: "absolute",
        //       bottom: 100,
        //       justifyContent: "center",
        //       alignItems: "center",
        //     }}
        //   >
        //     <Text style={{ fontSize: 15, color: "white" }}>
        //       DEV Env | Staging App
        //     </Text>
        //   </View>
        )} */}

        {!mode && (
          <View
            style={{
              width: Dimensions.get("screen").width,
              height: 400,
              position: "absolute",
              bottom: 10,
              zIndex: -10,
              opacity: 0.4,
            }}
          >
            <Image
              source={authVector}
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  input: {
    marginVertical: 10,
    borderColor: "grey",
    borderWidth: 1,
    padding: 10,
    width: "80%",
    fontSize: 16,
    borderRadius: 5,
  },
  pwdInput: {
    fontSize: 16,
    width: "80%",
  },
  button: {
    // backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 15,
    width: "80%",
    ...envConfig.PlatformShadow,
  },
  buttonLtBg: {
    backgroundColor: Colors.primary,
  },
  buttonDrBg: {
    backgroundColor: "grey",
  },
  socialLoginButton: {
    margin: 3,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  textStyle: {
    fontWeight: "700",
    fontSize: 16,
  },
  logoText: {
    fontWeight: "700",
    fontSize: 22,
    marginTop: 45,
    marginBottom: 15,
  },
  logoText1: {
    fontWeight: "700",
    fontSize: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  inputDarkBgColor: {
    backgroundColor: "grey",
    color: "white",
  },
  inputLightBgColor: {
    backgroundColor: "white",
    color: "grey",
  },
});
