import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Colors, getDarkTheme, getLightTheme } from "../../utils/colors";
import { LinearGradient } from "expo-linear-gradient";
import Entypo from "@expo/vector-icons/Entypo";
import IonIcons from "@expo/vector-icons/Ionicons";
import { envConfig } from "../../configs/envConfig";
import { CocPoster } from "../../../assets/images";
import axios from "axios";
import { DarkModeStatus, UserId, UserToken } from "../../app/useStore";
import { ApiCollection } from "../../configs/envConfig";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Modal from "react-native-modal";
import PlayerCard from "../playerCard";
import CustomButton from "../customButtons";

export default function CocStatsScreen({ route, navigation }) {
  const userId = route.params.userId;
  const currentUserId = UserId();
  const token = UserToken();

  useEffect(() => {
    getPlayerCreds();
    // //
  }, []);

  const mode = DarkModeStatus();

  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [cardData, setCardData] = useState(null);

  const [gameStats, setGameStats] = useState(null);

  const getStats = async (playerName) => {
    const body = {
      game: "coc",
      attribute: {
        player: `${playerName}`,
      },
    };

    await axios
      .post(ApiCollection.gamesController.getGameStats, body)
      .then((response) => {
        setIsLoading(false);
        if (response.data.data.Error == undefined) {
          setGameStats(response.data.data.reason ? null : response.data.data);
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const getPlayerCreds = async () => {
    setIsLoading(true);
    await axios
      .get(ApiCollection.gamesController.getPlayerGameCreds(userId, "coc"), {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setIsConnected(true);
        getStats(res.data.data.playerID);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsConnected(false);
      });
  };

  const ConnectScreen = () => {
    const [inGameName, setInGameName] = useState("");

    const addGameCreds = async () => {
      if (inGameName.trim() == "") {
        Alert.alert("Error", "Please fill all the fields");
        return;
      }

      setIsLoading(true);
      const body = {
        field: "gamingNames",
        value: {
          playerID: inGameName,
          gameName: "coc",
        },
      };

      await axios
        .put(ApiCollection.gamesController.addGameDetails, body, {
          headers: { Authorization: "Bearer " + token },
        })
        .then((res) => {
          setIsLoading(false);
          if (res.data.success) {
            getPlayerCreds();
            setIsConnected(true);
          } else {
            Alert.alert("Error", res.data.message);
          }
        })
        .catch((err) => {
          setIsLoading(false);
          setIsConnected(false);
          Alert.alert("Error", "Some error occured");
        });
    };

    return (
      <View
        style={{
          width: "90%",
          flexDirection: "column",
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
          paddingVertical: 40,
          borderRadius: 8,
          justifyContent: "center",
          alignItems: "center",
          ...envConfig.PlatformShadow,
        }}
      >
        <View
          style={{
            width: 300,
            height: 200,
            borderRadius: 8,
            marginBottom: 20,
            overflow: "hidden",
          }}
        >
          <Image style={{ width: "100%", height: "100%" }} source={CocPoster} />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.9)"]}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: 10,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: mode ? getDarkTheme.color : getLightTheme.color,
              }}
            >
              Clash Of Clans
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: mode ? getDarkTheme.color : getLightTheme.color,
              }}
            >
              Connect your profile to display stats.
            </Text>
          </LinearGradient>
        </View>

        <View style={[styles.inputHolder, mode ? getDarkTheme : getLightTheme]}>
          <IonIcons name="person" size={20} color={Colors.primary} />
          <TextInput
            style={[
              styles.input,
              { color: mode ? getDarkTheme.color : getLightTheme.color },
            ]}
            placeholderTextColor={
              mode ? getDarkTheme.color : getLightTheme.color
            }
            placeholder="Enter your player tag Ex- #XXX"
            onChangeText={(text) => setInGameName(text)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => addGameCreds()}>
          <Text
            style={{
              textAlign: "center",
              fontWeight: "500",
              fontSize: 16,
              color: mode ? getDarkTheme.color : getLightTheme.color,
            }}
          >
            Submit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 10, marginTop: 10 }}
        >
          <Text
            style={{
              fontSize: 16,
              color: mode ? getDarkTheme.color : getLightTheme.color,
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const playerCardHandler = () => {
    const data = {
      game: "coc",
      poster: CocPoster,
      stats: [
        {
          name: "Player Name",
          value: gameStats.name,
        },
        {
          name: "Experience Level",
          value: gameStats.expLevel,
        },
        {
          name: "Trophies",
          value: gameStats.trophies,
        },
        {
          name: "Town Hall Level",
          value: gameStats.townHallLevel,
        },
      ],
      backStats: [
        {
          name: "Player Tag",
          value: gameStats.tag,
        },
        {
          name: "Attack Wins",
          value: gameStats.attackWins,
        },
        {
          name: "Defence Wins",
          value: gameStats.defenseWins,
        },
        {
          name: "War Stars",
          value: gameStats.warStars,
        },
      ],
    };
    setCardData(data);
    setShowCard(true);
  };

  return !isLoading ? (
    <View
      style={[
        styles.page,
        mode ? getDarkTheme : getLightTheme,
        isConnected == false && { justifyContent: "center" },
      ]}
    >
      {isConnected ? (
        <View style={{ width: "100%" }}>
          <ScrollView
            refreshControl={
              <RefreshControl
                tintColor={Colors.primary}
                colors={[Colors.primary]}
                refreshing={isLoading}
                onRefresh={() => getPlayerCreds()}
              />
            }
          >
            <View
              style={{
                width: "100%",
                height: 300,
                marginBottom: 20,
                overflow: "hidden",
              }}
            >
              <Image
                style={{ width: "100%", height: "100%" }}
                source={CocPoster}
              />
              <LinearGradient
                colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0)", "rgba(0,0,0,0.6)"]}
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: 10,
                }}
              >
                <View
                  style={{
                    marginTop: 30,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    {Platform.OS == "android" ? (
                      <IonIcons
                        name="arrow-back-outline"
                        size={30}
                        color={"white"}
                      />
                    ) : (
                      <IonIcons
                        name="ios-arrow-back"
                        size={30}
                        color={"white"}
                      />
                    )}
                  </TouchableOpacity>

                  {currentUserId == userId && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.primary,
                        padding: 10,
                        borderRadius: 5,
                      }}
                      onPress={() => setIsConnected(false)}
                    >
                      <FontAwesome name="edit" size={20} color={"white"} />
                    </TouchableOpacity>
                  )}
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "700",
                      color: mode ? getDarkTheme.color : getLightTheme.color,
                    }}
                  >
                    Clash Of Clans
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: mode ? getDarkTheme.color : getLightTheme.color,
                    }}
                  >
                    Player Stats
                  </Text>
                </View>
              </LinearGradient>
            </View>

            {gameStats !== null ? (
              <>
                <Modal
                  style={{ justifyContent: "center", alignItems: "center" }}
                  isVisible={showCard}
                  onBackButtonPress={() => setShowCard(false)}
                  onBackdropPress={() => setShowCard(false)}
                >
                  <PlayerCard
                    onClosePress={() => setShowCard(false)}
                    data={cardData}
                  />
                </Modal>
                <View
                  style={{
                    paddingLeft: 10,
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ width: "50%" }}>
                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Player Name</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats.name}
                      </Text>
                    </View>

                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Exp Level</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats.expLevel}
                      </Text>
                    </View>
                  </View>

                  <View style={{ width: "50%" }}>
                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Player Tag</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats.tag}
                      </Text>
                    </View>

                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Attack Wins</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats.attackWins}
                      </Text>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    paddingLeft: 10,
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ width: "50%" }}>
                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Defence Wins</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats.defenseWins}
                      </Text>
                    </View>

                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Trophies</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats.trophies}
                      </Text>
                    </View>
                  </View>

                  <View style={{ width: "50%" }}>
                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Townhall</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats.townHallLevel}
                      </Text>
                    </View>
                  </View>
                </View>

                {userId == currentUserId && (
                  <View
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 50,
                    }}
                  >
                    <CustomButton
                      onPress={playerCardHandler}
                      type="primary"
                      label="View Player Card"
                    />
                  </View>
                )}
              </>
            ) : (
              <View
                style={{
                  paddingLeft: 10,
                  height: Dimensions.get("window").height * 0.5,
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "100%", padding: 10 }}>
                  <Text style={styles.heading}>Error</Text>
                  <Text
                    style={{
                      paddingVertical: 5,
                      fontSize: 18,
                      color: mode ? getDarkTheme.color : getLightTheme.color,
                    }}
                  >
                    Invalid Game ID
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      ) : (
        <ConnectScreen />
      )}
    </View>
  ) : (
    <View
      style={[
        styles.page,
        mode ? getDarkTheme : getLightTheme,
        { justifyContent: "center" },
      ]}
    >
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text
        style={{
          fontSize: 18,
          marginVertical: 20,
          color: mode ? getDarkTheme.color : getLightTheme.color,
        }}
      >
        Loading Stats....
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  inputHolder: {
    width: "85%",
    padding: 10,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    borderColor: "lightgrey",
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    width: "90%",
    padding: 5,
    fontSize: 16,
    marginLeft: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
    width: "90%",
  },
  heading: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: "700",
  },
});
