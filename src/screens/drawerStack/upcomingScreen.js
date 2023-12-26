import React from "react";
import { View, Image, StyleSheet, ScrollView, Dimensions } from "react-native";
import { UpcomingPoster } from "../../../assets/upcoming/upcomingIndex";
import { DarkModeStatus } from "../../app/useStore";
import { envConfig } from "../../configs/envConfig";
import { Colors, getDarkTheme, getLightTheme } from "../../utils/colors";

export default function UpcomingScreen() {
  const mode = DarkModeStatus();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 40,
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        }}
      >
        {UpcomingPoster.map((poster, index) => (
          <Image key={index} source={poster} style={styles.image} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  image: {
    width: Dimensions.get("screen").width * 0.9,
    borderRadius: 5,
    height: 350,
    resizeMode: "cover",
    borderColor: Colors.primary,
    borderWidth: 1,
    margin: 10,
  },
});
