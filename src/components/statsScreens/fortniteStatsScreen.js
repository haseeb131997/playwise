import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Colors, getDarkTheme, getLightTheme } from "../../utils/colors";
import { LinearGradient } from "expo-linear-gradient";
import Entypo from "@expo/vector-icons/Entypo";
import IonIcons from "@expo/vector-icons/Ionicons";
import { envConfig } from "../../configs/envConfig";
import { FortnitePoster } from "../../../assets/images";
import axios from "axios";
import { DarkModeStatus, UserId, UserToken } from "../../app/useStore";
import { ApiCollection } from "../../configs/envConfig";
import RBSheet from "react-native-raw-bottom-sheet";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Modal from "react-native-modal";
import PlayerCard from "../playerCard";
import CustomButton from "../customButtons";

export default function FortniteStatsScreen({ route, navigation }) {
  const userId = route.params.userId;
  const currentUserId = UserId();
  const token = UserToken();

  useEffect(() => {
    getPlayerCreds();
  }, []);

  const mode = DarkModeStatus();

  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("overall");
  const [showCard, setShowCard] = useState(false);
  const [cardData, setCardData] = useState(null);

  const [gameStats, setGameStats] = useState(null);

  const refMapRBSheet = useRef(null);

  const getStats = async (playerName) => {
    const body = {
      game: "fortnite",
      attribute: {
        player: `${playerName}`,
      },
    };

    await axios
      .post(ApiCollection.gamesController.getGameStats, body)
      .then((response) => {
        setIsLoading(false);
        if (response.data.data.Error == undefined) {
          setGameStats(response.data.data ? response.data.data : null);
        }
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const getPlayerCreds = async () => {
    setIsLoading(true);
    await axios
      .get(
        ApiCollection.gamesController.getPlayerGameCreds(userId, "fortnite"),
        { headers: { Authorization: "Bearer " + token } }
      )
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
          gameName: "fortnite",
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
          <Image
            style={{ width: "100%", height: "100%" }}
            source={FortnitePoster}
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
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: mode ? getDarkTheme.color : getLightTheme.color,
              }}
            >
              Fortnite
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
    const filterName =
      filter == "overall"
        ? "Overall"
        : filter == "solo"
        ? "Solo"
        : filter == "duo"
        ? "Duo"
        : filter == "squad"
        ? "Squad"
        : filter == "ltm"
        ? "Lifetime"
        : "Overall";

    const data = {
      game: "fortnite",
      poster: FortnitePoster,
      stats: [
        {
          name: "Player Name",
          value: gameStats.account.name,
        },
        {
          name: "K/D Ratio" + ` ( ${filterName} )`,
          value: gameStats.stats.all[filter].kd,
        },
        {
          name: "Total Kills" + ` ( ${filterName} )`,
          value: gameStats.stats.all[filter].kills,
        },
        {
          name: "Total Matches" + ` ( ${filterName} )`,
          value: gameStats.stats.all[filter].matches,
        },
      ],
      backStats: [
        {
          name: "Total Wins" + `\n ( ${filterName} )`,
          value: gameStats.stats.all[filter].wins,
        },
        {
          name: "Kills per Match" + `\n ( ${filterName} )`,
          value: gameStats.stats.all[filter].killsPerMatch,
        },
        {
          name: "Deaths" + `\n ( ${filterName} )`,
          value: gameStats.stats.all[filter].deaths,
        },
        {
          name: "Top 10" + `\n ( ${filterName} )`,
          value: gameStats.stats.all[filter].top10,
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
                source={FortnitePoster}
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
                        color: mode ? getDarkTheme.color : getLightTheme.color,
                      }}
                    >
                      Fortnite
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
                        {gameStats.account.name}
                      </Text>
                    </View>

                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Total Matches</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats.stats.all[filter].matches}
                      </Text>
                    </View>
                  </View>

                  <View style={{ width: "50%" }}>
                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Total Kills</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats.stats.all[filter].kills}
                      </Text>
                    </View>

                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Total Wins</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats.stats.all[filter].wins}
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
                      <Text style={styles.heading}>Top 3</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats.stats.all[filter].top3}
                      </Text>
                    </View>

                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Top 5</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats.stats.all[filter].top5}
                      </Text>
                    </View>
                  </View>

                  <View style={{ width: "50%" }}>
                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Top 6</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats.stats.all[filter].top6}
                      </Text>
                    </View>

                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Top 10</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats.stats.all[filter].top10}
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
                      <Text style={styles.heading}>Kills per match</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats.stats.all[filter].killsPerMatch}
                      </Text>
                    </View>
                  </View>

                  <View style={{ width: "50%" }}>
                    <View style={{ width: "100%", padding: 10 }}>
                      <Text style={styles.heading}>Kills per minute</Text>
                      <Text
                        style={{
                          paddingVertical: 5,
                          fontSize: 18,
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        {gameStats.stats.all[filter].killsPerMin}
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

              <TouchableOpacity
                onPress={() => {
                  refMapRBSheet.current.close();
                  setFilter("overall");
                }}
                style={{ padding: 5, width: "100%", paddingVertical: 10 }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: filter == "overall" ? Colors.primary : "black",
                    fontWeight: filter == "overall" ? "bold" : "normal",
                  }}
                >
                  Overall
                </Text>
              </TouchableOpacity>

              {gameStats.stats.all.ltm !== null && (
                <TouchableOpacity
                  onPress={() => {
                    refMapRBSheet.current.close();
                    setFilter("ltm");
                  }}
                  style={{ padding: 5, width: "100%", paddingVertical: 10 }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: filter == "ltm" ? Colors.primary : "black",
                      fontWeight: filter == "ltm" ? "bold" : "normal",
                    }}
                  >
                    Lifetime
                  </Text>
                </TouchableOpacity>
              )}

              {gameStats.stats.all.duo !== null && (
                <TouchableOpacity
                  onPress={() => {
                    refMapRBSheet.current.close();
                    setFilter("duo");
                  }}
                  style={{ padding: 5, width: "100%", paddingVertical: 10 }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: filter == "duo" ? Colors.primary : "black",
                      fontWeight: filter == "duo" ? "bold" : "normal",
                    }}
                  >
                    Duo
                  </Text>
                </TouchableOpacity>
              )}

              {gameStats.stats.all.solo !== null && (
                <TouchableOpacity
                  onPress={() => {
                    refMapRBSheet.current.close();
                    setFilter("solo");
                  }}
                  style={{ padding: 5, width: "100%", paddingVertical: 10 }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: filter == "solo" ? Colors.primary : "black",
                      fontWeight: filter == "solo" ? "bold" : "normal",
                    }}
                  >
                    Solo
                  </Text>
                </TouchableOpacity>
              )}

              {gameStats.stats.all.squad !== null && (
                <TouchableOpacity
                  onPress={() => {
                    refMapRBSheet.current.close();
                    setFilter("squad");
                  }}
                  style={{ padding: 5, width: "100%", paddingVertical: 10 }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: filter == "squad" ? Colors.primary : "black",
                      fontWeight: filter == "squad" ? "bold" : "normal",
                    }}
                  >
                    Squad
                  </Text>
                </TouchableOpacity>
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
