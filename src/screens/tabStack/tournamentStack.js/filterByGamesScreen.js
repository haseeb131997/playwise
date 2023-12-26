import React, { useState, useEffect, useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import { CustomIcon } from "../../../components/customIconPack";
import {
  ApiCollection,
  envConfig,
  ScreenWidthResponser,
} from "../../../configs/envConfig";
import BGMI from "../../../../assets/images/tournamentBGMI.jpeg";
import FreeFireMax from "../../../../assets/images/tournamentFreeFiremax.jpeg";
import CODMobile from "../../../../assets/images/tournamentCODM.jpeg";
import Valorant from "../../../../assets/images/tournamentValorant.jpeg";
import FreeFire from "../../../../assets/images/tournamentFreefire.jpeg";
import { Routes } from "../../../utils/routes";
import { DarkModeStatus } from "../../../app/useStore";

export default function FilterByGamesScreen({ navigation }) {
  const games = [
    { name: "BGMI", value: "bgmi", poster: BGMI },
    { name: "Free Fire Max", value: "freeFireMax", poster: FreeFireMax },
    { name: "Call of Duty - Mobile", value: "codMobile", poster: CODMobile },
    { name: "Valorant", value: "valorant", poster: Valorant },
    // {name:"Call of Duty - Warzone",value:'codWarzone'},
    // {name:"PUBG",value:'pubg'},
    { name: "Free Fire", value: "freeFire", poster: FreeFire },
    // {name:"Apex Legends",value:'apexLegends'},
    // {name:"Clash of Clans",value:'coc'},
    // {name:"Fortnite",value:'fortnite'},
    // {name:'PUBG PC',value:'pubgPC'},
    // {name:"Pokemon Unite",value:'pokemonUnite'},
  ];

  const dark = DarkModeStatus();

  return (
    <SafeAreaView
      style={[
        styles.page,
        {
          backgroundColor: dark
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        },
      ]}
    >
        <View style={{ width: "100%", padding: 20, backgroundColor: dark
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor, marginBottom:-40,marginTop:40,paddingBottom:30}}>
        <View
            style={{
                flexDirection: "row",
                marginBottom: 20,
                justifyContent: "space-between",
                alignItems: "center",
                paddingRight: 10,
                backgroundColor: dark
                ? getDarkTheme.backgroundColor
                : getLightTheme.backgroundColor,
            }}
        >
    <TouchableOpacity
        onPress={() =>
            navigation.navigate(
            Routes.tabStack.tournamentStack.tournamentScreen,
            )
        }
        style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        }}
    >
        {/* <Octicons name="filter" size={25} color={Colors.primary} /> */}
        <Text
        style={{
            fontSize: 16,
            color: Colors.primary,
            fontWeight: "bold",
            marginLeft: 10,
        }}
        >
        Sort by
        </Text>
        </TouchableOpacity>
            <TouchableOpacity
                style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                }}
            >
                {/* <Octicons name="filter" size={25} color={Colors.primary} /> */}
                <Text
                style={{
                    fontSize: 16,
                    color: Colors.primary,
                    fontWeight: "bold",
                    marginLeft: 10,
                }}
                >
                Filter By Game Name
                </Text>
            </TouchableOpacity>
        </View>
    </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
          width: Dimensions.get("screen").width * 0.9,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          paddingVertical: 20,
        }}
      >
        {games.map((game, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              navigation.navigate(
                Routes.tabStack.tournamentStack.tournamentListScreen,
                { game: game.value, name: game.name }
              )
            }
            style={styles.tournamentCard}
          >
            <Image
              source={game.poster}
              style={{ width: "100%", height: "100%" }}
            />
            <LinearGradient
              colors={["rgba(0,0,0,0.2)", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.7)"]}
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "flex-end",
                alignItems: "flex-start",
                position: "absolute",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                  margin: 10,
                }}
              >
                {game.name}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  tournamentCard: {
    width: "46%",
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
});