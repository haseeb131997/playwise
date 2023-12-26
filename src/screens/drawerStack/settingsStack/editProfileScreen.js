import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Linking,
  Alert,
  TextInput,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import { ApiCollection, envConfig } from "../../../configs/envConfig";
import axios from "axios";
import { UserToken, UserInfo, DarkModeStatus } from "../../../app/useStore";
import IonIcons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import LoadingModal from "../../../components/loadingModal";
import { setUserInfo } from "../../../features/userSlice";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useDispatch } from "react-redux";
import { Dropdown } from "react-native-element-dropdown";
import { Routes } from "../../../utils/routes";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function EditProfileScreen({ navigation }) {
  useEffect(() => {
    getMyProfile();
  }, []);

  const mode = DarkModeStatus();

  const token = UserToken();
  const userInfo = UserInfo();
  const dispatch = useDispatch();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [oldUsername, setOldUsername] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [accIsPublic, setAccIsPublic] = useState(true);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [city, setCityName] = useState("");
  const [state, setStateName] = useState("");
  const [country, setCountryName] = useState("");

  const [facebook, setFacebook] = useState("");
  const [discord, setDiscord] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const avialableRoles = [
    { label: "Gamer", value: "Gamer" },
    { label: "Assaulter", value: "Assaulter" },
    { label: "Defender", value: "Defender" },
    { label: "Graphic Designer", value: "Graphic Designer" },
    { label: "Coach", value: "Coach" },
    { label: "Game developer", value: "Game developer" },
    { label: "Developer", value: "Developer" },
    { label: "Squad Leader", value: "Squad Leader" },
    { label: "Tournament Organizer", value: "Tournament Organizer" },
    { label: "Other", value: "Other" },
  ];

  const getMyProfile = async () => {
    setIsLoading(true);
    await axios
      .get(ApiCollection.userController.getMyProfile, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        setIsLoading(false);
        if (response.data.success) {
          setProfile(response.data.data);
          setName(response.data.data.name);
          setRole(response.data.data.role);
          setOldUsername(response.data.data.username);
          setUsername(response.data.data.username);
          setBio(response.data.data.bio ? response.data.data.bio : "");
          setAccIsPublic(
            response.data.data.accountType == "public" ? true : false
          );

          setCityName(response.data.data.address.city);
          setStateName(response.data.data.address.state);
          setCountryName(response.data.data.address.country);

          setDateOfBirth(
            response.data.data.dob ? response.data.data.dob.split("T")[0] : null
          );

          const socialArray = response.data.data.socialLinks;

          if (socialArray.length !== 0) {
            const fbIndex = socialArray.findIndex(
              (social) => social.website === "facebook"
            );
            const discordIndex = socialArray.findIndex(
              (social) => social.website === "discord"
            );
            const instaIndex = socialArray.findIndex(
              (social) => social.website === "instagram"
            );
            const youtubeIndex = socialArray.findIndex(
              (social) => social.website === "youtube"
            );
            const linkedinIndex = socialArray.findIndex(
              (social) => social.website === "linkedin"
            );

            setFacebook(socialArray[fbIndex].link);
            setDiscord(socialArray[discordIndex].link);
            setInstagram(socialArray[instaIndex].link);
            setYoutube(socialArray[youtubeIndex].link);
            setLinkedin(socialArray[linkedinIndex].link);
          } else {
            setFacebook("");
            setDiscord("");
            setInstagram("");
            setYoutube("");
            setLinkedin("");
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
        //setProfile(null)
      });
  };

  const usernameAvialable = async (usernamex) => {
    if (oldUsername !== usernamex) {
      await axios
        .post(
          ApiCollection.userController.checkUsername,
          { username: usernamex },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          return true;
        })
        .catch((error) => {
          return false;
        });
    } else {
      return true;
    }
  };

  const showPicker = () => {
    setDatePickerVisible(true);
  };

  const hidePicker = () => {
    setDatePickerVisible(false);
  };

  const handleDOB = (date) => {
    setDateOfBirth(Date(date));
    hidePicker();
  };

  const submit = async () => {
    if (name == "") {
      Alert.alert("Edit Profile", "Please enter your name");
      return;
    }

    if (bio == "") {
      Alert.alert("Edit Profile", "Please enter your bio");
      return;
    }

    if (username == "") {
      Alert.alert("Edit Profile", "Please enter your username");
      return;
    }

    if (dateOfBirth == null) {
      Alert.alert("Edit Profile", "Please enter your date of birth");
      return;
    }

    if (role == "") {
      Alert.alert("Edit Profile", "Please enter your role");
      return;
    }

    const hasWhiteSpace = /\s/g.test(username);
    if (hasWhiteSpace) {
      Alert.alert("Invalid Username", "Username can't contain spaces");
      return;
    }

    setIsLoading(true);
    if (!usernameAvialable(username)) {
      Alert.alert("Edit Profile", "Username not avialable !");
      setIsLoading(false);
      return;
    }

    const socials = [
      { website: "facebook", link: facebook },
      { website: "discord", link: discord },
      { website: "instagram", link: instagram },
      { website: "youtube", link: youtube },
      { website: "linkedin", link: linkedin },
    ];

    const body = {
      name: name,
      username: username.trim(),
      role: role == "Other" ? customRole : role,
      dob: dateOfBirth,
      bio: bio,
      accountType: accIsPublic ? "public" : "private",
      socialLinks: socials,
      address: {
        city: city,
        state: state,
        country: country,
      },
    };

    await axios
      .post(ApiCollection.userController.addUserDetails, body, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        setIsLoading(false);
        if (response.data.success) {
          Alert.alert("Success", "Profile updated successfully");

          const userInfoApi = {
            coverPic: userInfo.coverPic,
            profilePic: userInfo.profilePic,
            name: name,
            username: username,
          };

          dispatch(setUserInfo({ userInfo: userInfoApi }));
          //dispatch(setUserInfo({name:name,username:username,profilePic:userInfo.profilePic,coverPic:userInfo.coverPic}))
          navigation.goBack();
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
        Alert.alert("Error", "Something went wrong !");
      });
  };

  const _renderRoles = (item) => {
    return (
      <View
        style={[
          styles.item,
          {
            backgroundColor: mode
              ? getDarkTheme.backgroundColor
              : getLightTheme.backgroundColor,
          },
        ]}
      >
        <Text
          key={item.label}
          style={[
            styles.textItem,
            { color: mode ? getDarkTheme.color : getLightTheme.color },
          ]}
        >
          {item.label}
        </Text>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.page,
        {
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        },
      ]}
    >
      <LoadingModal modalVisible={isLoading} />
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        style={styles.scrollStyle}
      >
        <View
          style={{
            width: Dimensions.get("window").width,
            paddingVertical: 10,
            paddingBottom: 50,
          }}
        >
          <View style={{ width: "100%", marginTop: 10 }}>
            <Text style={styles.heading}>Full Name *</Text>
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={[
                styles.input,
                { color: mode ? getDarkTheme.color : getLightTheme.color },
              ]}
              placeholder={"Full name"}
              placeholderTextColor={
                mode ? getLightTheme.color : getDarkTheme.color
              }
            />
          </View>

          <View style={{ width: "100%", marginTop: 10 }}>
            <Text style={styles.heading}>Role *</Text>
            <Dropdown
              style={[
                styles.dropdownStyle,
                {
                  backgroundColor: mode
                    ? getDarkTheme.backgroundColor
                    : getLightTheme.backgroundColor,
                },
              ]}
              containerStyle={[
                styles.dropContainer,
                {
                  backgroundColor: mode
                    ? getDarkTheme.backgroundColor
                    : getLightTheme.backgroundColor,
                },
                { borderColor: Colors.primary },
              ]}
              data={avialableRoles}
              selectedTextStyle={{
                fontSize: 14,
                color: mode ? getDarkTheme.color : getLightTheme.color,
              }}
              search={false}
              labelField="label"
              valueField="value"
              value={role}
              showsVerticalScrollIndicator={false}
              placeholder={`${role}`}
              placeholderStyle={{
                color: mode ? getDarkTheme.color : getLightTheme.color,
                fontSize: 14,
              }}
              onChange={(item) => {
                setRole(item.value);
              }}
              renderItem={(item) => _renderRoles(item)}
              textError="Error"
            />
            {role == "Other" && (
              <TextInput
                value={customRole}
                onChangeText={(text) => setCustomRole(text)}
                placeholder={"Enter your role..."}
                style={[
                  styles.input,
                  { color: mode ? getDarkTheme.color : getLightTheme.color },
                ]}
                placeholderTextColor={
                  mode ? getLightTheme.color : getDarkTheme.color
                }
              />
            )}
          </View>

          <View style={{ width: "100%", marginTop: 10 }}>
            <Text style={styles.heading}>UserName *</Text>
            <TextInput
              value={username}
              onChangeText={(text) => setUsername(text)}
              style={[
                styles.input,
                { color: mode ? getDarkTheme.color : getLightTheme.color },
              ]}
              placeholderTextColor={
                mode ? getLightTheme.color : getDarkTheme.color
              }
              placeholder={"User name"}
            />
          </View>

          <View style={{ width: "100%", marginTop: 10 }}>
            <Text style={styles.heading}>Bio *</Text>
            <TextInput
              value={bio}
              multiline={true}
              onChangeText={(text) => setBio(text)}
              style={[
                styles.input,
                { height: 100 },
                { color: mode ? getDarkTheme.color : getLightTheme.color },
              ]}
              placeholderTextColor={
                mode ? getLightTheme.color : getDarkTheme.color
              }
              textAlignVertical="top"
              placeholder={"Bio"}
            />
          </View>
          {!isLoading ? (
            profile != null && (
              <View style={{ width: "100%", marginTop: 10 }}>
                <Text style={styles.heading}>Registered Email</Text>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      padding: 10,
                      paddingTop: 5,
                      color: mode ? getDarkTheme.color : getLightTheme.color,
                    }}
                  >
                    {profile.email}
                  </Text>
                  <TouchableOpacity
                    style={{ marginHorizontal: 10, marginRight: 20 }}
                    onPress={() =>
                      navigation.navigate(
                        Routes.drawerStack.settingStack.updateEmail
                      )
                    }
                  >
                    <AntDesign name="edit" size={20} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            )
          ) : (
            <></>
          )}

          {!isLoading ? (
            profile != null ? (
              profile.phone !== null ? (
                <View style={{ width: "100%", marginTop: 10 }}>
                  <Text style={styles.heading}>Phone Number</Text>
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ padding: 10 }}>{profile.phone}</Text>
                    <TouchableOpacity
                      style={{ marginHorizontal: 10, marginRight: 20 }}
                      onPress={() =>
                        navigation.navigate(
                          Routes.drawerStack.settingStack.updatePhone
                        )
                      }
                    >
                      <AntDesign name="edit" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <></>
              )
            ) : (
              <></>
            )
          ) : (
            <></>
          )}

          <View style={{ width: "100%", marginTop: 10 }}>
            <Text style={styles.heading}>Date of Birth *</Text>
            <TouchableOpacity
              onPress={showPicker}
              style={[
                dateOfBirth == null
                  ? styles.smallButtonsEmpty
                  : styles.smallButtonsFilled,
              ]}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "500",
                  fontSize: 14,
                  color: dateOfBirth == null ? Colors.primary : "white",
                }}
              >
                {dateOfBirth == null ? "Select Date" : `${dateOfBirth}`}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              maximumDate={new Date()}
              isVisible={datePickerVisible}
              mode="date"
              onConfirm={handleDOB}
              onCancel={hidePicker}
            />
          </View>

          <View style={{ width: "100%", marginTop: 20, marginLeft: 10 }}>
            <Text
              style={{
                width: "85%",
                textAlign: "left",
                paddingVertical: 5,
                color: Colors.primary,
              }}
            >
              City Name
            </Text>
            <TextInput
              style={[
                styles.input,
                { color: mode ? getDarkTheme.color : getLightTheme.color },
              ]}
              onChangeText={(text) => setCityName(text)}
              placeholder="Jaipur"
              placeholderTextColor={mode ? "#757572" : "#DBD8C2"}
            />

            <Text
              style={{
                width: "85%",
                textAlign: "left",
                paddingVertical: 5,
                marginTop: 10,
                color: Colors.primary,
              }}
            >
              State Name
            </Text>
            <TextInput
              style={[
                styles.input,
                { color: mode ? getDarkTheme.color : getLightTheme.color },
              ]}
              onChangeText={(text) => setStateName(text)}
              placeholder="Rajasthan"
              placeholderTextColor={mode ? "#757572" : "#DBD8C2"}
            />

            <Text
              style={{
                width: "85%",
                textAlign: "left",
                paddingVertical: 5,
                marginTop: 10,
                color: Colors.primary,
              }}
            >
              Country Name
            </Text>
            <TextInput
              style={[
                styles.input,
                { color: mode ? getDarkTheme.color : getLightTheme.color },
              ]}
              onChangeText={(text) => setCountryName(text)}
              placeholder="India"
              placeholderTextColor={mode ? "#757572" : "#DBD8C2"}
            />
          </View>

          <View style={{ width: "100%", marginTop: 20 }}>
            <Text style={styles.heading}>Account Type</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderColor: Colors.primary,
                borderWidth: 1,
                width: "90%",
                borderRadius: 5,
                marginTop: 5,
                marginLeft: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => setAccIsPublic(true)}
                style={[
                  {
                    width: "50%",
                    padding: 10,
                    paddingVertical: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  },
                  accIsPublic && { backgroundColor: Colors.primary },
                ]}
              >
                <Text style={{ color: accIsPublic ? "white" : Colors.primary }}>
                  Public
                </Text>
                {accIsPublic && (
                  <IonIcons name="checkmark" size={25} color={"white"} />
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setAccIsPublic(false)}
                style={[
                  {
                    width: "50%",
                    padding: 10,
                    paddingVertical: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  },
                  accIsPublic == false && { backgroundColor: Colors.primary },
                ]}
              >
                <Text style={{ color: accIsPublic ? Colors.primary : "white" }}>
                  Private
                </Text>
                {accIsPublic == false && (
                  <IonIcons name="checkmark" size={25} color={"white"} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ width: "90%", marginLeft: 15, marginTop: 30 }}>
            <Text style={styles.heading}>Social</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                marginVertical: 10,
              }}
            >
              <MaterialCommunityIcons
                name="facebook"
                color={Colors.primary}
                size={30}
              />
              <View style={styles.input}>
                <TextInput
                  value={facebook}
                  style={{
                    color: mode ? getDarkTheme.color : getLightTheme.color,
                  }}
                  onChangeText={(text) => setFacebook(text)}
                  placeholder="Facebook profile"
                  placeholderTextColor={mode ? "#757572" : "#DBD8C2"}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                marginVertical: 10,
              }}
            >
              <MaterialCommunityIcons
                name="discord"
                color={Colors.primary}
                size={30}
              />
              <View style={styles.input}>
                <TextInput
                  value={discord}
                  style={{
                    color: mode ? getDarkTheme.color : getLightTheme.color,
                  }}
                  onChangeText={(text) => setDiscord(text)}
                  placeholder="Discord profile"
                  placeholderTextColor={mode ? "#757572" : "#DBD8C2"}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                marginVertical: 10,
              }}
            >
              <MaterialCommunityIcons
                name="youtube"
                color={Colors.primary}
                size={30}
              />
              <View style={styles.input}>
                <TextInput
                  value={youtube}
                  style={{
                    color: mode ? getDarkTheme.color : getLightTheme.color,
                  }}
                  onChangeText={(text) => setYoutube(text)}
                  placeholder="Youtube profile"
                  placeholderTextColor={mode ? "#757572" : "#DBD8C2"}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                marginVertical: 10,
              }}
            >
              <MaterialCommunityIcons
                name="instagram"
                color={Colors.primary}
                size={30}
              />
              <View style={styles.input}>
                <TextInput
                  value={instagram}
                  style={{
                    color: mode ? getDarkTheme.color : getLightTheme.color,
                  }}
                  onChangeText={(text) => setInstagram(text)}
                  placeholder="Instagram profile"
                  placeholderTextColor={mode ? "#757572" : "#DBD8C2"}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                marginVertical: 10,
              }}
            >
              <MaterialCommunityIcons
                name="linkedin"
                color={Colors.primary}
                size={30}
              />
              <View style={styles.input}>
                <TextInput
                  style={{
                    color: mode ? getDarkTheme.color : getLightTheme.color,
                  }}
                  value={linkedin}
                  onChangeText={(text) => setLinkedin(text)}
                  placeholder="Linkedin profile"
                  placeholderTextColor={mode ? "#757572" : "#DBD8C2"}
                />
              </View>
            </View>
          </View>

          <View
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={submit} style={styles.bigButton}>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "500",
                  fontSize: 16,
                  color: "white",
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  button: {
    padding: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderColor: Colors.primary,
    borderWidth: 1,
    margin: 10,
  },
  heading: {
    fontSize: 14,
    fontWeight: "500",
    margin: 10,
    color: Colors.primary,
  },

  input: {
    width: "90%",
    padding: 10,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  bigButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 15,
    marginTop: 30,
    width: "90%",
  },
  smallButtonsFilled: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    width: "60%",
    marginTop: 10,
    margin: 10,
    padding: 10,
  },

  smallButtonsEmpty: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    width: "60%",
    marginTop: 10,
    margin: 10,
    padding: 10,
  },
  dropdownStyle: {
    borderColor: "lightgrey",
    borderWidth: 0.5,
    padding: 7,
    borderRadius: 8,
    width: "85%",
    fontSize: 18,
    color: Colors.primary,
    margin: 10,
    marginLeft: 5,
    shadowColor: "grey",
    elevation: 3,
    marginBottom: 10,
  },

  item: {
    paddingVertical: 17,
    paddingHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },

  dropContainer: {
    borderRadius: 8,
    paddingLeft: 5,
  },
});
