import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
  Alert,
  Dimensions,
} from "react-native";
import { Colors, getDarkTheme, getLightTheme } from "../../utils/colors";
import { LinearGradient } from "expo-linear-gradient";
import Entypo from "@expo/vector-icons/Entypo";
import IonIcons from "@expo/vector-icons/Ionicons";
import { ApiCollection, envConfig } from "../../configs/envConfig";
import { PubgPoster } from "../../../assets/images";
import axios from "axios";
import { DarkModeStatus, UserId, UserToken } from "../../app/useStore";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Modal from "react-native-modal";
import CustomButton from "../customButtons";
import PlayerCard from "../playerCard";
import RBSheet from "react-native-raw-bottom-sheet";

export default function PubgStatsScreen({ route, navigation }) {
  const userId = route.params.userId;
  const currentUserId = UserId();
  const token = UserToken();

  useEffect(() => {
    getPlayerCreds();
  }, []);

  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [cardData, setCardData] = useState(null);
  const [filter, setFilter] = useState("squad");
  const [playerName, setPlayerName] = useState("");

  const [gameStats, setGameStats] = useState(null);

  const refMapRBSheet = useRef(null);

  const getStats = async (playerName) => {
    const body = {
      game: "pubg",
      attribute: {
        platform: `steam`,
        playerName: `${playerName}`,
        currentSeason: true,
      },
    };
    await axios
      .post(ApiCollection.gamesController.getGameStats, body)
      .then((response) => {
        setIsLoading(false);

        if (response.data.success) {
          setGameStats(response.data.data.gameModeStats);
        }
      })
      .catch((err) => {
        setGameStats(null);
        setIsLoading(false);
      });
  };

  const getPlayerCreds = async () => {
    setIsLoading(true);
    await axios
      .get(ApiCollection.gamesController.getPlayerGameCreds(userId, "pubg"), {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setIsConnected(true);
        setPlayerName(res.data.data.playerID);
        getStats(res.data.data.playerID);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsConnected(false);
      });
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const playerCardHandler = () => {
    const filterName = capitalizeFirstLetter(filter);

    const data = {
      game: "pubg",
      poster: PubgPoster,
      stats: [
        {
          name: "Player Name",
          value: playerName,
        },
        {
          name: "Kills" + ` ( ${filterName} )`,
          value: gameStats[filter].kills,
        },
        {
          name: "Losses" + ` ( ${filterName} )`,
          value: gameStats[filter].losses,
        },
        {
          name: "Wins" + ` ( ${filterName} )`,
          value: gameStats[filter].wins,
        },
      ],
      backStats: [
        {
          name: "Rounds Played" + ` ( ${filterName} )`,
          value: gameStats[filter].roundsPlayed,
        },
        {
          name: "Headshots" + `\n ( ${filterName} )`,
          value: gameStats[filter].headshotKills,
        },
        {
          name: "Top 10s" + `\n ( ${filterName} )`,
          value: gameStats[filter].top10s,
        },
        {
          name: "Max Kill Streaks" + `\n ( ${filterName} )`,
          value: gameStats[filter].maxKillStreaks,
        },
      ],
    };
    setCardData(data);
    setShowCard(true);
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
          gameName: "pubg",
          platform: "steam",
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
    const mode = DarkModeStatus();

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
          <Image
            style={{ width: "100%", height: "100%" }}
            source={PubgPoster}
          />
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
            <Text style={{ fontSize: 18, fontWeight: "700", color: "white" }}>
              PUBG PC
            </Text>
            <Text style={{ fontSize: 14, color: "white" }}>
              Connect your profile to display stats.
            </Text>
          </LinearGradient>
        </View>

        <View style={[styles.inputHolder, mode ? getDarkTheme : getLightTheme]}>
          <IonIcons name="person" size={20} color={Colors.primary} />
          <TextInput
            style={[styles.input, mode ? getDarkTheme : getLightTheme]}
            placeholderTextColor={mode ? "grey" : "white"}
            placeholder="Enter your username"
            onChangeText={(text) => setInGameName(text)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => addGameCreds()}>
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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 10, marginTop: 10 }}
        >
          <Text style={{ fontSize: 16 }}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const mode = DarkModeStatus();

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
          <ScrollView>
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
                source={{
                  uri: `https://static.toiimg.com/thumb/msid-88854584,width-1280,height-720,resizemode-4/.jpg`,
                }}
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
                        paddingHorizontal: 10,
                        borderRadius: 5,
                      }}
                      onPress={() => setIsConnected(false)}
                    >
                      <Text style={{ color: "white" }}>Edit Player Id</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 22,
                        fontWeight: "700",
                        color: "white",
                      }}
                    >
                      PUBG PC
                    </Text>
                    <Text style={{ fontSize: 14, color: "white" }}>
                      Player Stats {`( Current Season )`}
                    </Text>
                  </View>
                  {gameStats != null && (
                    <TouchableOpacity
                      style={{
                        backgroundColor: Colors.primary,
                        padding: 5,
                        borderRadius: 2,
                      }}
                      onPress={() => refMapRBSheet.current.open()}
                    >
                      <IonIcons name="options" size={25} color={"white"} />
                    </TouchableOpacity>
                  )}
                </View>
              </LinearGradient>
            </View>

            {gameStats != null ? (
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
                      <Text style={styles.heading}>Kills</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats[filter].kills}
                      </Text>
                    </View>

                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Wins</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats[filter].wins}
                      </Text>
                    </View>
                  </View>

                  <View style={{ width: "50%" }}>
                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Losses</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats[filter].losses}
                      </Text>
                    </View>

                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Assist</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats[filter].assists}
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
                      <Text style={styles.heading}>Rounds Played</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats[filter].roundsPlayed}
                      </Text>
                    </View>

                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Top 10s</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats[filter].top10s}
                      </Text>
                    </View>
                  </View>

                  <View style={{ width: "50%" }}>
                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Headshots</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats[filter].headshotKills}
                      </Text>
                    </View>

                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Max Kill Streak</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats[filter].maxKillStreaks}
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
          {gameStats != null && (
            <RBSheet
              ref={refMapRBSheet}
              closeOnDragDown={true}
              closeOnPressMask={true}
              height={400}
              animationType={"fade"}
              dragFromTopOnly
              customStyles={{
                container: {
                  padding: 10,
                  borderTopRightRadius: 20,
                  borderTopLeftRadius: 20,
                },
                draggableIcon: { backgroundColor: Colors.primary },
              }}
            >
              <Text
                style={{
                  padding: 5,
                  fontSize: 18,
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                  color: Colors.primary,
                  marginVertical: 10,
                }}
              >
                Filters{" "}
              </Text>

              {Object.keys(gameStats).map(
                (gameMode, index) =>
                  gameStats[gameMode] !== null && (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        refMapRBSheet.current.close();
                        setFilter(`${gameMode}`);
                      }}
                      style={{ padding: 5, width: "100%", paddingVertical: 10 }}
                    >
                      {gameMode.split("-").length > 1 ? (
                        <Text
                          style={{
                            fontSize: 16,
                            color:
                              filter == `${gameMode}`
                                ? Colors.primary
                                : "black",
                            fontWeight:
                              filter == `${gameMode}` ? "bold" : "normal",
                          }}
                        >{`${capitalizeFirstLetter(
                          gameMode.split("-")[0]
                        )} ( ${gameMode.split("-")[1].toUpperCase()} )`}</Text>
                      ) : (
                        <Text
                          style={{
                            fontSize: 16,
                            color:
                              filter == `${gameMode}`
                                ? Colors.primary
                                : "black",
                            fontWeight:
                              filter == `${gameMode}` ? "bold" : "normal",
                          }}
                        >
                          {capitalizeFirstLetter(gameMode)}
                        </Text>
                      )}
                    </TouchableOpacity>
                  )
              )}
            </RBSheet>
          )}
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
      <Text style={{ fontSize: 18, marginVertical: 20 , color:mode?getDarkTheme.color:getLightTheme.color}}>
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
