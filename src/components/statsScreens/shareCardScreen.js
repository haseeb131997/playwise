import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { Colors, getDarkTheme, getLightTheme } from "../../utils/colors";
import { Routes } from "../../utils/routes";
import CustomButton from "../customButtons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import IonIcons from "@expo/vector-icons/Ionicons";
import { ApiCollection } from "../../configs/envConfig";
import axios from "axios";
import { DarkModeStatus, UserToken } from "../../app/useStore";
import LoadingModal from "../loadingModal";
import * as Sharing from "expo-sharing";

export default function ShareCardScreen({ route, navigation }) {
  const uriFront = route.params.uriFront;
  const uriBack = route.params.uriBack;
  const gameName = route.params.gameName;
  const token = UserToken();

  const mode = DarkModeStatus();

  const [isPublic, setAccIsPublic] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [caption, setCaption] = useState(
    `Hi Guys, Check out my ${gameName} player card ! \n\n #${gameName} #playercard #playwise`
  );

  function findHashtags(searchText) {
    var regexp = /\B\#\w\w+\b/g;
    let result = searchText.match(regexp);
    return result ? result : [];
  }

  const submitPost = async () => {
    if (caption == "") {
      Alert.alert("Share card !", "Please enter a caption");
      return;
    }

    setModalVisible(true);
    const tagsArray = findHashtags(caption);

    const imgType = Platform.OS == "android" ? "jpeg" : "jpg";

    const imageData = {
      name: `${Date.now()}_front`,
      uri: uriFront,
      type: `image/${imgType}`,
    };

    const imageDataBack = {
      name: `${Date.now()}_back`,
      uri: uriBack,
      type: `image/${imgType}`,
    };

    const bodyFormData = new FormData();
    bodyFormData.append("media", imageData);
    bodyFormData.append("media", imageDataBack);
    bodyFormData.append("caption", caption);
    bodyFormData.append("mediaType", "media");
    bodyFormData.append("visibility", isPublic ? "public" : `followers`);
    bodyFormData.append("tags", `${tagsArray}`);

    let fields = {
      responseType: "json",
      headers: {
        "content-type": "multipart/form-data",
        accept: "application/json",
        Authorization: "Bearer " + token,
      },
    };

    await axios
      .post(ApiCollection.postController.addPost, bodyFormData, fields)
      .then((res) => {
        setModalVisible(false);
        if (res.data.success) {
          Alert.alert("Player Card", "Player card shared successfully");
          navigation.replace(Routes.tabStack.homeStack.homeScreen);
        }
      })
      .catch((err) => {
        setModalVisible(false);
        Alert.alert("Player Card", "Something went wrong");
      });
  };

  const shareAsImage = async () => {
    // Cli Code
    // Share.open({
    //     urls: [uriFront, uriBack]
    //   })
    //     .then((res) => {
    //       console.log(res);
    //   })
    //     .catch((err) => {
    //       console.log(err);
    //   });
    await Sharing.shareAsync(uriFront, {
      dialogTitle: "Share Playwise Player Card",
    });
  };

  return (
    <View style={[styles.page, mode ? getDarkTheme : getLightTheme]}>
      <LoadingModal modalVisible={isModalVisible} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 50,
          paddingTop: 30,
        }}
      >
        <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
          <Image
            source={{ uri: uriFront }}
            style={{
              width: Dimensions.get("screen").width - 30,
              height: 300,
              resizeMode: "contain",
            }}
          />
          <Image
            source={{ uri: uriBack }}
            style={{
              width: Dimensions.get("screen").width - 30,
              height: 300,
              resizeMode: "contain",
            }}
          />
        </ScrollView>

        <View
          style={{
            width: "100%",
            marginBottom: 20,
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Text style={styles.heading}>Visibility</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderColor: Colors.primary,
              borderWidth: 1,
              borderRadius: 5,
              marginTop: 5,
              marginLeft: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setAccIsPublic(true)}
              style={[
                {
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
                isPublic && { backgroundColor: Colors.primary },
              ]}
            >
              <Entypo
                name="globe"
                size={21}
                color={isPublic ? "white" : Colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAccIsPublic(false)}
              style={[
                {
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                },
                isPublic == false && { backgroundColor: Colors.primary },
              ]}
            >
              {/* <Text style={{color: isPublic ? Colors.primary:'white'}}>Followers</Text> */}
              <IonIcons
                name="people"
                size={20}
                color={isPublic ? Colors.primary : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("screen").width - 20,
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={{ padding: 10, color: Colors.primary, fontWeight: "700" }}
          >
            Enter Caption
          </Text>
          <TextInput
            value={caption}
            onChangeText={(text) => setCaption(text)}
            placeholder="Share something"
            placeholderTextColor={mode?getDarkTheme.color:getLightTheme.color}
            style={[styles.input, { height: 150 }]}
            textAlignVertical="top"
            multiline={true}
          />
        </View>

        <CustomButton
          label={"Share as Post"}
          onPress={submitPost}
          type="primary"
        />
        <CustomButton
          label={"Share as Image"}
          onPress={shareAsImage}
          type="outline-big"
        />
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
  input: {
    height: 200,
    width: "95%",
    color: "black",
    padding: 10,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  heading: { padding: 10, color: Colors.primary, fontWeight: "700" },
});
