import React, { useEffect, useRef, useState, createRef } from "react";
import { Routes } from "../../../utils/routes";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { ApiCollection, envConfig } from "../../../configs/envConfig";
import Carousel from "react-native-snap-carousel";
import IonIcons from "@expo/vector-icons/Ionicons";
import RBSheet from "react-native-raw-bottom-sheet";
import axios from "axios";
import LBProfileCard from "../../../components/LbProfileCard";
import Modal from "react-native-modal";
import {
  Loading,
  NoData,
  ServerError,
} from "../../../components/exceptionHolders";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BottomSheet } from "../../../components/BottomSheet";
import LeaderBoardConfig from "../../../configs/leaderBoardConfig";
import { DarkModeStatus } from "../../../app/useStore";
import { get } from "react-native/Libraries/Utilities/PixelRatio";

export default function LeaderBoardScreen({ navigation }) {
  useEffect(() => {
    getLeaderBoard(apiBoddyAttributes[currentIndex]);
  }, []);

  const mode = DarkModeStatus();

  const bottomSheet = createRef();
  const crousalRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("kd");
  const [leaderBoardData, setLeaderBoardData] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [selectedPlayerData, setSelectedPlayerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const defaultFilter = LeaderBoardConfig.filter.defaultFilter;
  const bannerData = LeaderBoardConfig.bannerData;
  const apiBoddyAttributes = LeaderBoardConfig.apiBoddyAttributes;

  const getLeaderBoard = async (apiBody) => {
    setIsLoading(true);
    setLeaderBoardData(null);
    await axios
      .post(ApiCollection.gamesController.leaderboard, apiBody)
      .then((res) => {
        if (res.data.data == undefined) {
          setLeaderBoardData(null);
          setIsLoading(false);

          return;
        }
        if (apiBody.game == "coc") {
          const realLeaderBoard = res.data.data;
          let temp = [];
          realLeaderBoard.forEach((item, index) => {
            temp.push({
              attackWins: item.attackWins,
              clanName: item.clan == undefined ? "No Clan" : item.clan.name,
              clanTag: item.clan == undefined ? "No Clan" : item.clan.tag,
              defenseWins: item.defenseWins,
              expLevel: item.expLevel,
              name: item.name,
              rank: item.rank,
              tag: item.tag,
              trophies: item.trophies,
            });
          });

          setLeaderBoardData(temp);
          setIsLoading(false);
        } else {
          setLeaderBoardData(res.data.data == undefined ? null : res.data.data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setLeaderBoardData(null);
        setIsLoading(false);
      });
  };

  const swipHandler = (index) => {
    setCurrentIndex(index);

    getLeaderBoard(apiBoddyAttributes[index]);
    setSelectedFilter(defaultFilter[index].filterValue);
  };

  const _renderItem = ({ item, index }) => {
    return (
      <View style={styles.banner}>
        <Image
          style={{ width: "100%", height: "100%", borderRadius: 8 }}
          source={{ uri: `${item.img}` }}
        />
      </View>
    );
  };

  const sortFilterHandler = (key) => {
    let temp = leaderBoardData;

    if (key == "rank") {
      temp = temp.sort((a, b) => parseFloat(b[key]) < parseFloat(a[key]));
    } else {
      temp = temp.sort((a, b) => parseFloat(b[key]) > parseFloat(a[key]));
    }
    setSelectedFilter(key);
    setLeaderBoardData(temp);
    bottomSheet.current.close();
  };

  const LeaderbaordSlab = (props) => {
    const selectedGame = bannerData[currentIndex].slug;

    const PlayerData = () => {
      const placeholder =
        "https://media.istockphoto.com/vectors/profile-placeholder-image-gray-silhouette-no-photo-vector-id1016744034?k=20&m=1016744034&s=612x612&w=0&h=kjCAwH5GOC3n3YRTHBaLDsLIuF8P3kkAJc9RvfiYWBY=";
      let playerInfo = {
        name: props.data.name,
        playerId: props.data.playerId,
        playerImg: placeholder,
      };

      if (selectedGame === "pubg") {
        playerInfo.name = props.data.name;
        playerInfo.playerId = null;
        playerInfo.playerImg =
          "https://w0.peakpx.com/wallpaper/158/779/HD-wallpaper-pubg-game-helmet-raiders-star-team.jpg";
      }

      if (selectedGame === "coc") {
        playerInfo.name = props.data.name;
        playerInfo.playerId = props.data.tag;
        playerInfo.playerImg =
          "https://play-lh.googleusercontent.com/JMNWaZel_qg6qj8T0bjX5OeLvXdka4hxzT_rsSVe5qQWHg798GmJcZetlQYm9-VlTsk=w240-h480-rw";
      }

      if (selectedGame === "cod") {
        playerInfo.name = props.data.username;
        playerInfo.playerId = null;
        playerInfo.playerImg =
          "https://static.wikia.nocookie.net/callofduty/images/1/18/SimonRiley_Mobile.jpg/revision/latest?cb=20191005151053";
      }

      if (selectedGame === "valorent") {
        playerInfo.name = props.data.username;
        playerInfo.playerId = props.data.tagLine;
        playerInfo.playerImg =
          "https://cdn.vox-cdn.com/thumbor/Q7HWdC2wCxexF3whUuX5wB9DegY=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/19874924/VALORANT_Jett_Red_crop.jpg";
      }

      if (selectedGame === "lol") {
        playerInfo.name = props.data.summoner;
        playerInfo.playerId = null;
        playerInfo.playerImg =
          "https://avatarfiles.alphacoders.com/165/thumb-165945.jpg";
      }

      if (selectedGame === "overWatch") {
        playerInfo.name = props.data.name;
        playerInfo.playerId = null;
        playerInfo.playerImg =
          "https://cdn.domestika.org/c_limit,dpr_auto,f_auto,q_auto,w_820/v1499255387/content-items/002/003/572/76Avatar-original.jpg?1499255387";
      }

      return playerInfo;
    };

    const profileShowHandler = () => {
      let playerData = {
        gameName: bannerData[currentIndex].title,
        gameSlug: selectedGame,
        gameBG: bannerData[currentIndex].img,
        playerData: PlayerData(),
        ...props.data,
      };

      setSelectedPlayerData(playerData);
      setShowCard(true);
    };

    const currentFilterIndex = () => {
      const filterIndex = bannerData[currentIndex].filterList.findIndex(
        (filter) => filter.filterValue === selectedFilter
      );
      if (filterIndex == -1) {
        return 0;
      }
      return filterIndex;
    };

    return (
      <TouchableOpacity
        onPress={profileShowHandler}
        style={[styles.lbSlab, mode ? getDarkTheme : getLightTheme]}
      >
        <View
          style={{
            width: "15%",
            justifyContent: "center",
            padding: 10,
            height: 60,
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
            backgroundColor: Colors.primary,
          }}
        >
          <Text
            style={{
              fontSize: props.rank > 99 ? 14 : 18,
              fontWeight: "700",
              color: "white",
              width: "100%",
              textAlign: "center",
            }}
          >
            {props.rank}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "85%",
            borderRadius: 8,
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: mode
              ? getDarkTheme.backgroundColor
              : getLightTheme.backgroundColor,
          }}
        >
          <View style={{ paddingHorizontal: 10 }}>
            <Text
              style={{ fontSize: 16, color: Colors.primary, paddingTop: 5 }}
            >
              {PlayerData().name}
            </Text>
            <Text style={{ color: "grey", marginTop: 5, alignItems: "center" }}>
              {
                bannerData[currentIndex].filterList[currentFilterIndex()]
                  .filterName
              }{" "}
              -{" "}
              {bannerData[currentIndex].filterList[currentFilterIndex()]
                .filterValue == "kd"
                ? leaderBoardData[props.index][selectedFilter]?.toFixed(3)
                : leaderBoardData[props.index][selectedFilter]}
            </Text>
          </View>
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: styles.lbSlab.borderRadius,
              marginRight: 10,
            }}
            source={{ uri: `${PlayerData().playerImg}` }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.page, mode ? getDarkTheme : getLightTheme]}>
      <Modal
        isVisible={showCard}
        onBackButtonPress={() => {
          setShowCard(false);
        }}
        onBackdropPress={() => {
          setShowCard(false);
        }}
      >
        <LBProfileCard data={selectedPlayerData} />
      </Modal>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ width: "100%", height: 220 }}>
          <Carousel
            loop
            ref={crousalRef}
            data={bannerData}
            renderItem={_renderItem}
            sliderWidth={Dimensions.get("window").width - 10}
            itemWidth={styles.banner.width}
            onSnapToItem={(index) => swipHandler(index)}
          />
        </View>

        <View
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingBottom: 30,
          }}
        >
          <View
            style={{
              width: Dimensions.get("window").width - 50,
              marginBottom: 20,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ width: "80%" }}>
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.primary,
                  fontWeight: "500",
                  width: "100%",
                }}
              >
                Top{" "}
                {!isLoading
                  ? leaderBoardData !== null && `${leaderBoardData.length} `
                  : ""}
                Players in {bannerData[currentIndex].title}
              </Text>
              <Text
                numberOfLines={2}
                style={{ marginVertical: 4, fontSize: 14, color: "grey" }}
              >
                As per official leaderboard !
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={{ marginRight: 20 }}
                onPress={() => getLeaderBoard(apiBoddyAttributes[currentIndex])}
              >
                <MaterialIcons
                  name="refresh"
                  size={28}
                  color={Colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => bottomSheet.current.open()}>
                <MaterialIcons name="sort" size={28} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {!isLoading ? (
            leaderBoardData != null ? (
              leaderBoardData.length !== 0 ? (
                leaderBoardData.map((item, index) => (
                  <LeaderbaordSlab
                    key={index}
                    index={index}
                    rank={item.rank}
                    country={"item.country"}
                    data={item}
                  />
                ))
              ) : (
                <NoData
                  style={{ height: 300 }}
                  onRefresh={() =>
                    getLeaderBoard(apiBoddyAttributes[currentIndex])
                  }
                  iconName="leaderboard"
                  title="No Player Data for this game"
                />
              )
            ) : (
              <ServerError
                style={{ height: 300 }}
                onRefresh={() =>
                  getLeaderBoard(apiBoddyAttributes[currentIndex])
                }
              />
            )
          ) : (
            <Loading style={{ height: 300 }} />
          )}
        </View>
      </ScrollView>

      <BottomSheet
        ref={bottomSheet}
        height={400}
        heading={"Sort By"}
        modeType={mode}
      >
        {bannerData[currentIndex].filterList.map((item, index) => (
          <TouchableOpacity
            style={{ width: "100%", padding: 10 }}
            onPress={() => {
              sortFilterHandler(item.filterValue);
            }}
          >
            <Text
              style={[
                {
                  fontSize: 15,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                },
                selectedFilter == item.filterValue && {
                  fontWeight: "bold",
                  color: Colors.primary,
                },
              ]}
            >
              {item.filterName}
            </Text>
          </TouchableOpacity>
        ))}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: 30,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  banner: {
    width: 300,
    height: 200,
    borderRadius: 8,
    // overflow:'hidden',
    ...envConfig.PlatformShadow,
  },
  lbSlab: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    margin: 10,
    ...envConfig.PlatformShadow,
  },
});
