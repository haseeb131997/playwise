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
import { envConfig } from "../../../configs/envConfig";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import { useNavigation } from "@react-navigation/native";
import {
  PubgPoster,
  CocPoster,
  ApexLegendsPoster,
  CSgoPoster,
  FortnitePoster,
  PubgPosterBlack,
  CocPosterBlack,
  ApexLegendsPosterBlack,
  CSgoPosterBlack,
  FortnitePosterBlack,
} from "../../../../assets/images";
import { ApiCollection } from "../../../configs/envConfig";
import axios from "axios";
import { DarkModeStatus, UserId } from "../../../app/useStore";
import { Routes } from "../../../utils/routes";
import { useIsFocused } from "@react-navigation/native";

const MyStatsCard = (props) => {
  const isFocused = useIsFocused();

  useEffect(() => {
    getPlayerCreds();
  }, [isFocused]);

  const navigation = useNavigation();
  const userId = props.userId;

  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getPlayerCreds = async () => {
    setIsLoading(true);

    await axios
      .get(ApiCollection.gamesController.getPlayerGameCreds(userId, props.slug))
      .then((res) => {
        setIsLoading(false);
        setIsConnected(true);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsConnected(false);
      });
  };

  const openStatScreen = () => {
    if (props.slug == "pubg") {
      navigation.navigate(Routes.tabStack.playerCardStack.myStats.pubg, {
        userId: userId,
      });
    } else if (props.slug == "coc") {
      navigation.navigate(Routes.tabStack.playerCardStack.myStats.coc, {
        userId: userId,
      });
    } else if (props.slug == "fortnite") {
      navigation.navigate(Routes.tabStack.playerCardStack.myStats.fortnite, {
        userId: userId,
      });
    } else if (props.slug == "apexLegends") {
      navigation.navigate(Routes.tabStack.playerCardStack.myStats.apex, {
        userId: userId,
      });
    } else if (props.slug == "csgo") {
      navigation.navigate(Routes.tabStack.playerCardStack.myStats.csgo, {
        userId: userId,
      });
    }
  };

  return (
    <TouchableOpacity style={styles.statsCard} onPress={openStatScreen}>
      {isLoading && (
        <View
          style={{
            position: "absolute",
            zIndex: 10,
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color={"white"} />
        </View>
      )}
      <Image
        style={{ width: "100%", height: "100%", resizeMode: "cover" }}
        source={isConnected ? props.poster : props.inActivePoster}
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

export default function GameCardsScreen(props) {
  const userId = UserId();

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
      posterBlack: CocPosterBlack,
    },
    {
      title: "Apex legends",
      slug: "apexLegends",
      connected: true,
      poster: ApexLegendsPoster,
      posterBlack: ApexLegendsPosterBlack,
    },
    {
      title: "Fortnite",
      slug: "fortnite",
      connected: false,
      poster: FortnitePoster,
      posterBlack: FortnitePosterBlack,
    },
    {
      title: "CS:GO",
      slug: "csgo",
      connected: true,
      poster: CSgoPoster,
      posterBlack: CSgoPosterBlack,
    },
  ];
  const mode = DarkModeStatus();

  return (
    <View style={[styles.page, mode ? getDarkTheme : getLightTheme]}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {data.map((item, index) => (
          <MyStatsCard
            key={index}
            userId={userId}
            slug={item.slug}
            title={item.title}
            poster={item.poster}
            inActivePoster={item.posterBlack}
          />
        ))}
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  tabHead: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    margin: 15,
  },
  statsCard: {
    width: Dimensions.get("window").width / 2.4,
    height: 130,
    ...envConfig.PlatformShadow,
    backgroundColor: "white",
    borderRadius: 10,
    margin: 10,
    overflow: "hidden",
  },
});
