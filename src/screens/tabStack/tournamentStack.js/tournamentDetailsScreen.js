import React, { createRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  RefreshControl,
  Linking,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CustomIcon } from "../../../components/customIconPack";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import { Routes } from "../../../utils/routes";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { ApiCollection } from "../../../configs/envConfig";
import { ServerError } from "../../../components/exceptionHolders";
import { DarkModeStatus, UserToken } from "../../../app/useStore";
import moment from "moment";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BottomSheet } from "../../../components/BottomSheet";
import { useIsFocused } from "@react-navigation/native";
import IonIcons from "@expo/vector-icons/Ionicons";

export default function TournamentDetailsScreen({ route, navigation }) {
  const mode = DarkModeStatus();

  const focused = useIsFocused();
  const tncSheet = createRef();

  useEffect(() => {
    if (token == null) {
      navigation.replace(Routes.onBoardingStack.tag);
      return;
    }

    getTournament();
  }, [focused]);

  const tournamentId = route.params.tournament
    ? route.params.tournament._id
    : route.params.tournamentId;
  const token = UserToken();

  const [isLoading, setIsLoading] = useState(true);
  const [tournament, setTournament] = useState(undefined);
  

  const getTournament = async () => {
    setIsLoading(true);
    await axios
      .get(
        `${ApiCollection.gamesController.getTournamentDetails}/${tournamentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setIsLoading(false);
        setTournament(response.data.data);
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              onPress={shareHandler}
              style={{ padding: 5, borderRadius: 5, marginHorizontal: 10 }}
            >
              <FontAwesome name="share-alt" size={23} color={Colors.primary} />
            </TouchableOpacity>
          ),
        });
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error.response.data);
      });
  };

  

  const openRegistrationSheet = () => {
    navigation.navigate(Routes.tabStack.tournamentStack.registerScreen, {
      tournament: tournament,
    });
  };

  const openSocials = (social) => {

    let url = tournament.organiser[social];
    if (social == "email") {
      url = `mailto:${tournament.organiser[social]}`;
    }
    if (social == "whatsapp") {
      url = `${tournament.organiser[social]}`;
    }
    if (social == "mobile") {
      url = `tel:${tournament.organiser[social]}`;
    } 
    console.log(url +" - "+ social);
    Linking.openURL(url).catch((err) => {
      console.log(err);
      Alert.alert("Organizer Detail", "Something went wrong!");
    });
  };

  let shareHandler = async () => {
    const shareUrl = `https://playwise.web.app/?type=tournament#${tournamentId}`;
    console.log(shareUrl);

    try {
      const result = await Share.share({
        message: `${shareUrl}/\n`,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  return !isLoading ? (
    tournament != undefined ? (
      <View
        style={[
          styles.page,
          {
            backgroundColor: mode
              ? getDarkTheme.backgroundColor
              : getLightTheme.backgroundColor,
          },
        ]}
      >
        
        <ScrollView
          contentContainerStyle={{ paddingBottom: 50 }}
          refreshControl={
            <RefreshControl
              tintColor={Colors.primary}
              colors={[Colors.primary]}
              refreshing={isLoading}
              onRefresh={getTournament}
            />
          }
        >
          <View
            style={[
              styles.page,
              {
                backgroundColor: mode
                  ? getDarkTheme.backgroundColor
                  : getLightTheme.backgroundColor,
              },
            ]}
          >
            <View
              style={{ width: Dimensions.get("window").width, height: 230 }}
            >
              <Image
                style={{ width: "100%", height: "100%", position: "absolute" }}
                source={{ uri: `${tournament.banner}` }}
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.2)", "rgba(0,0,0,0.9)"]}
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
                <TouchableOpacity
                    onPress={shareHandler}
                    style={{ padding: 5, borderRadius: 5,justifyContent:"space-between",position: "absolute",top:0,right:0}}>
                    <FontAwesome name="share-alt" size={23} color={Colors.primary} />
                  </TouchableOpacity>
                <View>
                  <Text
                    style={{ fontSize: 18, fontWeight: "700", color: "white" }}
                  >
                    {tournament.eventName} 
                  </Text>
                  <Text style={{ fontSize: 14, color: "white", marginTop: 5 }}>
                    {tournament.gameName}
                  </Text>
                  
                  {!isLoading ? (
                    tournament.status == "open" ?(
                      tournament.isRegistered ? (
                        <View
                          style={{
                            justifyContent: "flex-start",
                            alignItems: "center",
                            paddingVertical: 10,
                            flexDirection: "row",
                          }}
                        >
                          <IonIcons
                            name="checkmark-circle"
                            size={25}
                            color={Colors.primary}
                          />
                          <Text
                            style={{
                              color: "white",
                              marginLeft: 5,
                              fontSize: 15,
                            }}
                          >
                            Registered !
                          </Text>
                        </View>
                      ) : (tournament.isOpen?
                        <TouchableOpacity
                          style={styles.button}
                          onPress={openRegistrationSheet}
                        >
                          <Text style={{ color: "white" }}>Register</Text>
                        </TouchableOpacity>
                     :
                     <View
                        style={{
                          justifyContent: "flex-start",
                          alignItems: "center",
                          paddingVertical: 10,
                          flexDirection: "row",
                        }}
                      >
                        <Text style={{ color: "white", fontSize: 15 }}>
                          Registeration Closed !
                        </Text>
                      </View>
                      )
                      )
                     : (
                      <View
                        style={{
                          justifyContent: "flex-start",
                          alignItems: "center",
                          paddingVertical: 10,
                          flexDirection: "row",
                        }}
                      >
                        <Text style={{ color: "white", fontSize: 15 }}>
                          Registeration Closed !!
                        </Text>
                      </View>
                    )
                  ) : (
                    <View
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        paddingVertical: 10,
                      }}
                    >
                      <ActivityIndicator size="small" color="white" />
                    </View>
                  )}
                </View>

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 5,
                    marginRight: 10,
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{ marginRight: 10, fontSize: 15, color: "white" }}
                  >
                    {tournament.slotsFilled} / {tournament.totalSlots}
                  </Text>
                  <CustomIcon name="people" active={true} size={20} />
                </View>
              </LinearGradient>
            </View>

            <View style={{ width: "100%", padding: 10, marginTop: 20 }}>
              <View style={{ width: "100%", marginVertical: 5, marginTop: 0 }}>
                <Text style={{fontSize:20,marginBottom:10, color:mode ? getDarkTheme.color : getLightTheme.color, fontWeight:"700"}}>Tournament Details</Text>
                <Text style={styles.heading}>Organizer Details</Text>
                <Text
                  style={{
                    paddingVertical: 5,
                    fontSize: 18,
                    marginTop: 5,
                    color: mode ? getDarkTheme.color : getLightTheme.color,
                  }}
                >
                  {tournament.organiser.name}
                </Text>

                <View
                  style={{
                    width: "100%",
                    marginVertical: 15,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  {tournament.organiser.discord !== "" &&
                    tournament.organiser.discord !== undefined &&
                    tournament.organiser.discord !== null && (
                      <TouchableOpacity
                        style={{ marginRight: 19 }}
                        onPress={() => openSocials("discord")}
                      >
                        <MaterialCommunityIcons
                          name="discord"
                          color={Colors.primary}
                          size={30}
                        />
                      </TouchableOpacity>
                    )}

                  {tournament.organiser.email !== "" &&
                    tournament.organiser.email !== undefined &&
                    tournament.organiser.email !== null && (
                      <TouchableOpacity
                        style={{ marginRight: 19 }}
                        onPress={() => openSocials("email")}
                      >
                        <MaterialCommunityIcons
                          name="email"
                          color={Colors.primary}
                          size={30}
                        />
                      </TouchableOpacity>
                    )}

                  {tournament.organiser.mobile !== "" &&
                    tournament.organiser.mobile !== undefined && (
                      <TouchableOpacity
                        style={{ marginRight: 19 }}
                        onPress={() => openSocials("mobile")}
                      >
                        <MaterialCommunityIcons
                          name="phone"
                          color={Colors.primary}
                          size={30}
                        />
                      </TouchableOpacity>
                    )}

                    {tournament.organiser.whatsapp !== "" &&
                    tournament.organiser.whatsapp !== undefined && (
                      <TouchableOpacity
                        style={{ marginRight: 19 }}
                        onPress={() => openSocials("whatsapp")}
                      >
                        <MaterialCommunityIcons
                          name="whatsapp"
                          color={Colors.primary}
                          size={30}
                        />
                      </TouchableOpacity>
                    )}
                </View>
              </View>

              <View style={{ width: "100%", marginVertical: 5 }}>
                <Text style={styles.heading}>Status</Text>
                <Text
                  style={{
                    paddingVertical: 5,
                    fontSize: 18,
                    color: mode ? getDarkTheme.color : getLightTheme.color,
                  }}
                >
                  {tournament.status}
                </Text>
              </View>

              {tournament.isRegistered &&
                tournament.details.roomId != null &&
                tournament.details.roomId != undefined &&
                tournament.details.roomId != "" && (
                  <View style={{ width: "100%", marginVertical: 5 }}>
                    <Text style={styles.heading}>Room Details</Text>
                    <Text
                      style={{
                        paddingVertical: 5,
                        fontSize: 18,
                        color: mode ? getDarkTheme.color : getLightTheme.color,
                      }}
                    >
                      Room Id - {tournament.details.roomId}
                    </Text>
                    {tournament.details.password != null &&
                      tournament.details.password != undefined &&
                      tournament.details.password != "" && (
                        <Text
                          style={{
                            paddingVertical: 5,
                            fontSize: 18,
                            color: mode
                              ? getDarkTheme.color
                              : getLightTheme.color,
                          }}
                        >
                          Room Pass - {tournament.details.password}
                        </Text>
                      )}
                  </View>
                )}

              {tournament.entryFee !== undefined && (
                <View style={{ width: "100%", marginVertical: 5 }}>
                  <Text style={styles.heading}>Entry Fees</Text>
                  <Text
                    style={{
                      paddingVertical: 5,
                      fontSize: 18,
                      color: mode ? getDarkTheme.color : getLightTheme.color,
                    }}
                  >
                    {tournament.entryFee == 0
                      ? "Free"
                      : `Rs .${tournament.entryFee}`}
                  </Text>
                </View>
              )}

              <View style={{ width: "100%", marginVertical: 5 }}>
                <Text style={styles.heading}>Registration Open</Text>
                <Text
                  style={{
                    paddingVertical: 5,
                    fontSize: 18,
                    color: mode ? getDarkTheme.color : getLightTheme.color,
                  }}
                >
                  {moment(tournament.registration.open).utc().format("LLL")}{" "}
                </Text>
              </View>

              <View style={{ width: "100%", marginVertical: 5 }}>
                <Text style={styles.heading}>Registration Close</Text>
                <Text
                  style={{
                    paddingVertical: 5,
                    fontSize: 18,
                    color: mode ? getDarkTheme.color : getLightTheme.color,
                  }}
                >
                  {moment(tournament.registration.close).utc().format("LLL")}{" "}
                </Text>
              </View>

              <View style={{ width: "100%", marginVertical: 5 }}>
                <Text style={styles.heading}>Match Start</Text>
                <Text
                  style={{
                    paddingVertical: 5,
                    fontSize: 18,
                    color: mode ? getDarkTheme.color : getLightTheme.color,
                  }}
                >
                  {moment(tournament.startTime).utc().format("LLL")}
                </Text>
              </View>
              {/* {tournament.endtime!==undefined &&
                        <View style={{width:'100%',marginVertical:5}}>
                            <Text style={styles.heading}>Match End</Text>
                            <Text style={{paddingVertical:5,fontSize:18}}>{ moment(tournament.endTime).utc().format('DD/MM/YYYY')} | { moment(tournament.endTime).format("hh:mm A")}</Text>
                        </View>
                    } */}

              <View style={{ width: "100%", marginVertical: 10 }}>
                <Text style={styles.heading}>Rewards</Text>
                {tournament.rewards.map((reward, index) => (
                  <Text
                    key={index}
                    style={{
                      paddingVertical: 5,
                      fontSize: 18,
                      color: mode ? getDarkTheme.color : getLightTheme.color,
                    }}
                  >
                    {reward}
                  </Text>
                ))}
              </View>

              <View style={{ width: "100%", marginVertical: 5 }}>
                <Text style={styles.heading}>Nature</Text>
                <Text
                  style={{
                    paddingVertical: 5,
                    fontSize: 18,
                    color: mode ? getDarkTheme.color : getLightTheme.color,
                  }}
                >
                  {tournament.nature}{" "}
                </Text>
              </View>

              <View style={{ width: "100%", marginVertical: 5 }}>
                <Text style={styles.heading}>Type</Text>
                <Text
                  style={{
                    paddingVertical: 5,
                    fontSize: 18,
                    color: mode ? getDarkTheme.color : getLightTheme.color,
                  }}
                >
                  {tournament.type}{" "}
                </Text>
              </View>

              <View style={{ width: "100%", marginVertical: 5 }}>
                <Text style={styles.heading}>Note</Text>
                <Text
                  style={{
                    paddingVertical: 5,
                    fontSize: 18,
                    color: mode ? getDarkTheme.color : getLightTheme.color,
                  }}
                >
                  Room Details will be avialable 15 min before the tournament{" "}
                  {`( After Registration )`} !{" "}
                </Text>
              </View>

              {tournament.toc.length != 0 && (
                <View style={{ width: "100%", marginVertical: 5 }}>
                  <TouchableOpacity
                    onPress={() => tncSheet.current.open()}
                    style={{
                      width: 180,
                      borderColor: Colors.primary,
                      borderWidth: 1,
                      padding: 10,
                      paddingHorizontal: 20,
                      marginVertical: 10,
                      borderRadius: 5,
                    }}
                  >
                    <Text style={{ color: Colors.primary, fontSize: 15 }}>
                      Term & Conditions
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>

        <BottomSheet
          ref={tncSheet}
          heading={"Terms & Conditions"}
          height={Dimensions.get("screen").height * 0.7}
          modeType={mode}
        >
          <ScrollView
            contentContainerStyle={{
              width: Dimensions.get("screen").width * 0.95,
              paddingBottom: 50,
              backgroundColor: mode
                ? getDarkTheme.backgroundColor
                : getLightTheme.backgroundColor,
            }}
            horizontal={false}
          >
            <View style={{ width: "100%" }}>
              {tournament.toc.length != 0 &&
                tournament.toc.map((tnc, index) => (
                  <Text
                    key={index}
                    style={{
                      paddingVertical: 5,
                      fontSize: 16,
                      color: mode ? getDarkTheme.color : getLightTheme.color,
                    }}
                  >
                    {tnc}
                  </Text>
                ))}
            </View>
          </ScrollView>
        </BottomSheet>
      </View>
    ) : (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
        }}
      ></View>
    )
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: mode? getDarkTheme.backgroundColor: getLightTheme.backgroundColor,
      }}
    >
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  heading: {
    fontSize: 15,
    color: Colors.primary,
    fontWeight: "700",
  },
  button: {
    padding: 8,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 1,
    marginTop: 10,
    width: 90,
  },
});
