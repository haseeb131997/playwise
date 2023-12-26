import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { ApiCollection } from "../../../../configs/envConfig";
import { DarkModeStatus, UserToken } from "../../../../app/useStore";
import axios from "axios";
import { styles } from "./TabStyle";
import { UserId } from "../../../../app/useStore";
import { Colors, getDarkTheme, getLightTheme } from "../../../../utils/colors";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "../../../../utils/routes";

export default function MyGalleryTab(props) {
  useEffect(() => {
    getGallery();
  }, []);

  const mode = DarkModeStatus();

  const token = UserToken();
  const currentUserId = UserId();
  const navigation = useNavigation();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const getGallery = async () => {
    setLoading(true);
    await axios
      .get(
        `${ApiCollection.userController.getPlayerUserInfos}/${currentUserId}/gallery`,
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((res) => {
        setLoading(false);
        setImages(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
        setImages(null);
      });
  };

  const openPost = (postId) => {
    navigation.push(Routes.tabBarHiddenScreens.postStack.tag, {
      postId: postId,
    });
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        backgroundColor: mode
          ? getDarkTheme.backgroundColor
          : getLightTheme.backgroundColor,
      }}
    >
      <Text style={styles.tabHead}>Gallery</Text>
      {!loading ? (
        <View
          style={{
            width: "100%",
            paddingHorizontal: 15,
            paddingBottom: 50,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          {images !== null ? (
            images.length > 0 ? (
              images.map((item, index) => (
                <TouchableOpacity
                  onPress={() => openPost(item.postId)}
                  key={index}
                  style={{
                    width: "47%",
                    height: 120,
                    marginBottom: 10,
                    marginRight: 10,
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={{ uri: `${item.media.url}` }}
                    style={{ width: "100%", height: "100%" }}
                  />
                </TouchableOpacity>
              ))
            ) : (
              <View>
                <Text
                  style={{
                    color: "grey",
                    fontSize: 16,
                    color: mode ? getDarkTheme.color : getLightTheme.color,
                  }}
                >
                  You haven't uploaded any post/photo yet !
                </Text>
              </View>
            )
          ) : (
            <View>
              <Text
                style={{
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                Cant' connect to server
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={[styles.page, { justifyContent: "center" }]}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text
            style={{
              fontSize: 16,
              marginVertical: 15,
              color: mode ? getDarkTheme.color : getLightTheme.color,
            }}
          >
            Loading About...
          </Text>
        </View>
      )}
    </View>
  );
}
