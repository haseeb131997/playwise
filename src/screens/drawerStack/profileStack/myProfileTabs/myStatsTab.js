import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
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
  CocPosterBlack,
  ApexLegendsPosterBlack,
  CSgoPosterBlack,
  FortnitePosterBlack,
} from "../../../../../assets/images";
import { ApiCollection } from "../../../../configs/envConfig";
import axios from "axios";
import { DarkModeStatus, UserId } from "../../../../app/useStore";
import { styles } from "./TabStyle";

const MyStatsCard = (props) => {
  useEffect(() => {
    getPlayerCreds();
  }, []);

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
      navigation.navigate(Routes.tabStack.profileStack.myStats.pubg, {
        userId: userId,
      });
    } else if (props.slug == "coc") {
      navigation.navigate(Routes.tabStack.profileStack.myStats.coc, {
        userId: userId,
      });
    } else if (props.slug == "fortnite") {
      navigation.navigate(Routes.tabStack.profileStack.myStats.fortnite, {
        userId: userId,
      });
    } else if (props.slug == "apexLegends") {
      navigation.navigate(Routes.tabStack.profileStack.myStats.apex, {
        userId: userId,
      });
    } else if (props.slug == "csgo") {
      navigation.navigate(Routes.tabStack.profileStack.myStats.csgo, {
        userId: userId,
      });
    }
  };

  return (
    <TouchableOpacity style={styles.statsCard} onPress={openStatScreen}>
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
        {/* {isConnected && <MaterialIcons name='check-circle' size={20} color='white' />} */}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default function MyStatsTab(props) {
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
    <View
      style={{
        padding: 10,
        paddingBottom: 50,
        backgroundColor: mode
          ? getDarkTheme.backgroundColor
          : getLightTheme.backgroundColor,
      }}
    >
      <Text style={styles.tabHead}>My Stats</Text>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-start",
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
