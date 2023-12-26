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
} from "react-native";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import { CustomIcon } from "../../../components/customIconPack";
import {
  ApiCollection,
  envConfig,
  ScreenWidthResponser,
} from "../../../configs/envConfig";
import axios from "axios";
import { Routes } from "../../../utils/routes";
import {
  ServerError,
  NoData,
  Loading,
} from "../../../components/exceptionHolders";
import { BottomSheet } from "../../../components/BottomSheet";
import { DarkModeStatus, UserToken } from "../../../app/useStore";


export default function TournamentScreen({ navigation }) {

  const [allTournamentList, setAllTournamentList] = useState(null)
  const dark = DarkModeStatus();
  const [mode, setMode] = useState("all");
  const FilterSheetRef = React.createRef();
  const token = UserToken();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTournamentLists();
  }, []);

  const getTournamentLists = async () => {
    setIsLoading(true);
    await axios
    .get(
      `${ApiCollection.gamesController.getTotalTournamentList}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((response) => {
      setIsLoading(false);
      setAllTournamentList(response.data.data.tournaments);
      // console.log(response,"response of tournamets details")
    })
    .catch((error) => {
      setIsLoading(false);
      console.log(error, "errorlllllll response");
    });
  };

    const filteredList = mode == "all"
    ? allTournamentList
    : allTournamentList?.filter((tournament) => tournament.status === mode);

    const handleSort = (mode) => {
      setMode(mode);
      FilterSheetRef.current.close();
    };

    const TournamentCard = ({ item }) => {
      const openTournament = () => {
        navigation.navigate(
          Routes.tabStack.tournamentStack.tournamentTopTabStack.tag,
          { tournament: item }
        );
      };
      
      
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={openTournament}
              style={styles.tournamentCard}
            >
              <Image
                style={{ width: "100%", height: "100%", position: "absolute" }}
                source={{ uri: `${item.banner}` }}
              />
              <LinearGradient
                colors={[
                  "rgba(0,0,0,0.1)",
                  "rgba(0,0,0,0.5)",
                  "rgba(0,0,0,0.8)",
                ].reverse()}
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={styles.cardHeader}>
                  <View
                    style={{
                      width: "100%",
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      justifyContent: "center",
                      alignItems: "flex-start",
                      borderBottomRightRadius: 10,
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        fontSize: 15,
                        fontWeight: "700",
                        color: "white",
                        width: "100%",
                      }}
                    >
                      {item.eventName}
                    </Text>
                    <Text style={{ color: "whitesmoke", fontSize: 13, marginTop: 2 }}>
                      {item?.gameName??""}
                    </Text>
                  </View>
                  {/* <View style={[styles.headerTriangleCorner]}></View> */}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <Text style={{ marginRight: 10, fontSize: 15, color: "white" }}>
                    {item.slotsFilled} / {item.totalSlots}
                  </Text>
                  <CustomIcon name="people" active={false} size={20} />
                </View>
              </LinearGradient>

              <LinearGradient
                colors={[
                  "rgba(0,0,0,0.0)",
                  "rgba(0,0,0,0.4)",
                  "rgba(0,0,0,0.4)",
                  "rgba(0,0,0,0.6)",
                ]}
                style={{
                  width: "100%",
                  position: "absolute",
                  bottom: 0,
                  padding: 10,
                }}
              >
                <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
                  {item.nature} | {item.type}
                </Text>
                <Text style={{ color: "white", fontSize: 14, marginTop: 5 }}>
                  Reward -{item.rewards[0]}
                </Text>
              </LinearGradient>

              <View style={styles.viewButton}>
                <View style={{ borderTopRightRadius: 10, alignItems: "flex-end" }}>
                  <Text style={{ color: "white", fontSize: 14 }}>Status</Text>
                  <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
                    {item.status == "open" ? "Open" : "Closed"}
                    
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
  };

  return(
  <View
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
              : getLightTheme.backgroundColor, }}>
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
          ><TouchableOpacity
          onPress={() => FilterSheetRef.current.open()}
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
            {!isLoading ? (
              allTournamentList != null && (
                <TouchableOpacity
                onPress={() =>
                  navigation.navigate(
                    Routes.tabStack.tournamentStack.filterByGamesScreen,
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
                    Filter By Game Name
                  </Text>
                </TouchableOpacity>
                
              )
            ) : (
              <></>
            )}
          </View>
        </View>

        <BottomSheet
          modeType={dark}
          ref={FilterSheetRef}
          height={Dimensions.get("screen").height * 0.4}
          heading="Sort Tournaments"
        >
          <TouchableOpacity
            style={{ paddingVertical: 10, paddingLeft: 5 }}
            onPress={() => handleSort("all")}
          >
            <Text
              style={[
                mode == "all" && { fontWeight: "bold" },
                { fontSize: 16 },
                { color: dark ? getDarkTheme.color : getLightTheme.color },
              ]}
            >
              All Tournaments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ paddingVertical: 10, paddingLeft: 5 }}
            onPress={() => handleSort("open")}
          >
            <Text
              style={[
                mode == "open" && { fontWeight: "bold" },
                { fontSize: 16 },
                { color: dark ? getDarkTheme.color : getLightTheme.color },
              ]}
            >
              Open Tournaments
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ paddingVertical: 10, paddingLeft: 5 }}
            onPress={() => handleSort("closed")}
          >
            <Text
              style={[
                mode == "closed" && { fontWeight: "bold" },
                { fontSize: 16 },
                { color: dark ? getDarkTheme.color : getLightTheme.color },
              ]}
            >
              Closed Tournaments
            </Text>
          </TouchableOpacity>
        </BottomSheet>

        {!isLoading ? (
          allTournamentList != null ? (
            filteredList.length != 0 ? (
              <FlatList
                data={filteredList}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    tintColor={Colors.primary}
                    colors={[Colors.primary]}
                    refreshing={isLoading}
                    onRefresh={() => getTournamentLists()}
                  />
                }
                keyExtractor={(item, index) => index.toString()}
                renderItem={TournamentCard}
                contentContainerStyle={{
                  width: Dimensions.get("screen").width,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingBottom: 50,
                }}
              />
            ) : (
              <NoData
                onRefresh={() => getTournamentLists()}
                title={`No${
                  mode !== "all" ? ` ${mode}` : ""
                } tournaments right now !`}
                iconName="tournament"
              />
            )
          ) : (
            <ServerError
              onRefresh={() => getTournamentLists()}
            />
          )
        ) : (
          <Loading />
        )}
      </View>
    );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  tournamentCard: {
    width: Dimensions.get("window").width - 25,
    borderRadius: 8,
    height: 160,
    backgroundColor: "black",
    overflow: "hidden",
    borderColor: Colors.primary,
    borderWidth: 2,
    marginBottom: 20,
  },
  tournamentGameCard: {
    width: "46%",
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "55%",
  },
  headerTriangleCorner: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 0,
    borderRightWidth: 35,
    borderTopWidth: Platform.OS == "android" ? 55 : 48,
    marginRight: 10,
    borderRightColor: "transparent",
    position: "absolute",
    zIndex: 10,
    right: ScreenWidthResponser(-44, -44, 10),
    // ----- Debug Values
    //borderTopColor:'blue',
    // ----- Prod Values
    borderTopColor: Colors.primary,
  },

  headerTriangleCorner2: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 0,
    borderRightWidth: 35,
    borderTopWidth: Platform.OS == "android" ? 41 : 38,
    marginRight: 10,
    borderRightColor: "transparent",
    borderTopColor: "blue",
    position: "absolute",
    left: -29,
    zIndex: -10,
    transform: [{ rotate: "180deg" }],
    borderTopColor: Colors.primary,
  },

  viewButton: {
    flexDirection: "row",
    alignItems: "flex-end",
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 10,
  },
  intSelect: {
    padding: 4,
    paddingHorizontal: 15,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 50,
    marginRight: 8,
    height: 30,
  },
});
