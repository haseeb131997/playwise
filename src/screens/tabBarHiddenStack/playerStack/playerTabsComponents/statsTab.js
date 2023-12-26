import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import { Routes } from "../../../../utils/routes";
import { envConfig } from "../../../../configs/envConfig";
import { Colors, getDarkTheme, getLightTheme } from "../../../../utils/colors";
import { useNavigation } from "@react-navigation/native";
import {
  PubgPoster,
  CocPoster,
  ApexLegendsPoster,
  CSgoPoster,
  FortnitePoster,
  PubgPosterBlack,
} from "../../../../../assets/images";
import { ApiCollection } from "../../../../configs/envConfig";
import axios from "axios";
import { DarkModeStatus, UserToken } from "../../../../app/useStore";


const StatsCard = (props) => {
  const mode =DarkModeStatus();
  const navigation = useNavigation();
  const userId = props.userId;

  const openStatScreen = () => {
    if (props.slug == "pubg") {
      navigation.navigate(
        Routes.tabBarHiddenScreens.playerStack.playerStats.pubg,
        { userId: userId }
      );
    } else if (props.slug == "coc") {
      navigation.navigate(
        Routes.tabBarHiddenScreens.playerStack.playerStats.coc,
        { userId: userId }
      );
    } else if (props.slug == "fortnite") {
      navigation.navigate(
        Routes.tabBarHiddenScreens.playerStack.playerStats.fortnite,
        { userId: userId }
      );
    } else if (props.slug == "apexLegends") {
      navigation.navigate(
        Routes.tabBarHiddenScreens.playerStack.playerStats.apex,
        { userId: userId }
      );
    } else if (props.slug == "csgo") {
      navigation.navigate(
        Routes.tabBarHiddenScreens.playerStack.playerStats.csgo,
        { userId: userId }
      );
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.statsCard,
        {
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        },
      ]}
      onPress={openStatScreen}
    >
      <Image
        style={{ width: "100%", height: "100%", resizeMode: "cover" }}
        source={props.poster}
      />
      <LinearGradient
        colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.8)"]}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding: 10,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: "700", color: "white" }}>
          {props.title}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default function StatsTab(props) {
  useEffect(() => {
    getPlayerCreds();
  }, []);

  const mode = DarkModeStatus();

  const token = UserToken();

  const userId = props.userId;

  const [gameList, setGameList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const data = [
    {
      title: "PUBG PC",
      slug: "pubg",
      connected: true,
      poster: PubgPoster,
      posterBlack: PubgPosterBlack,
    },
    {
      title: "Clash of clans",
      slug: "coc",
      connected: false,
      poster: CocPoster,
    },
    {
      title: "Apex legends",
      slug: "apexLegends",
      connected: true,
      poster: ApexLegendsPoster,
    },
    {
      title: "Fortnite",
      slug: "fortnite",
      connected: false,
      poster: FortnitePoster,
    },
    { title: "CS:GO", slug: "csgo", connected: true, poster: CSgoPoster },
  ];

  const getPlayerCreds = async () => {
    let temp = [];
    setIsLoading(true);
    data.forEach(async (game) => {
      await axios
        .get(`${ApiCollection.gamesController.getUserGames}/${userId}`)
        .then((res) => {
          console.log(res.data);
          let unique = [...new Set(res.data.data)];
          let pubgIndex = unique.indexOf("pubg");
          if (pubgIndex > -1) {
            unique.splice(pubgIndex, 1);
          }
          setGameList(unique);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          setGameList(null);
        });
    });
  };

  const cardData = (slug) => {
    let index = data.findIndex((game) => game.slug == slug);
    return data[index];
  };

  return (
    <View
      style={{
        padding: 10,
        paddingBottom: 50,
        backgroundColor: mode
          ? getDarkTheme.backgroundColor
          : getLightTheme.backgroundColor,
      }}
    >
      <Text style={styles.tabHead}>Stats</Text>
      {!isLoading ? (
        gameList !== null ? (
          gameList.length > 0 ? (
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              {gameList.map((item, index) => (
                <StatsCard
                  key={index}
                  userId={userId}
                  slug={cardData(item).slug}
                  title={cardData(item).title}
                  poster={cardData(item).poster}
                />
              ))}
            </View>
          ) : (
            <View>
              <Text style={{ marginLeft: 15, color: "grey", fontSize: 16 }}>
                The user hasn't filled his game stats yet!
              </Text>
            </View>
          )
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: mode
                ? getDarkTheme.backgroundColor
                : getLightTheme.backgroundColor,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                marginVertical: 15,
                color: mode ? getDarkTheme.color : getLightTheme.color,
              }}
            >
              Can't connect to server !
            </Text>
          </View>
        )
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: mode
              ? getDarkTheme.backgroundColor
              : getLightTheme.backgroundColor,
          }}
        >
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text
            style={{
              fontSize: 16,
              marginVertical: 15,
              color: mode ? getDarkTheme.color : getLightTheme.color,
            }}
          >
            Loading Games...
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    width: Dimensions.get("window").width / 2.4,
    height: 130,
    ...envConfig.PlatformShadow,
    borderRadius: 10,
    margin: 10,
    overflow: "hidden",
  },
  tabHead: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    margin: 15,
  },
});
