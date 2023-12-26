import React, { useState, useEffect, useCallback, useRef } from "react";
import { Routes } from "../../../utils/routes";
import { CustomIcon } from "../../../components/customIconPack";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
  StyleSheet,
  Dimensions,
  FlatList,
  Alert,
  ScrollView,
} from "react-native";
import PostCard from "../../../components/postCard";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import axios from "axios";
import {
  ApiCollection,
  envConfig,
  ScreenWidthResponser,
} from "../../../configs/envConfig";
import { DarkModeStatus, UserId, UserToken } from "../../../app/useStore";
import * as Notifications from "expo-notifications";
import { PushNotificationsAllowed } from "../../../app/useStore";
import { useDispatch } from "react-redux";
import { setPushNotifications } from "../../../features/userSlice";
import {
  Loading,
  NoData,
  ServerError,
} from "../../../components/exceptionHolders";
import { useIsFocused } from "@react-navigation/native";
import LoadingModal from "../../../components/loadingModal";
import  moment  from 'moment';
import { LinearGradient } from "expo-linear-gradient";



export default function HomeScreen({ item , navigation }) {
  const token = UserToken();
  const currentUserId = UserId();
  const pushNotificationsAllowed = PushNotificationsAllowed();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [feedtournament, setFeedtournament] = useState(undefined);
  const [tournamentOpen, setTournamentOpen]= useState(null)
  const [tournamentStatus, setTournamentStatus] = useState(false)


  useEffect(() => {
    if (pushNotificationsAllowed == false) {
      sendExpoToken();
    }
  }, []);

  useEffect(() => {
    getFeedTournament();

  }, []);

  useEffect(() => {
    getTimelinePosts();
  }, [postList]);

  const [postList, setPostList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tempList, setTempList] = useState([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [page, setPage] = useState(2);


 

  const getFeedTournament = async () => {
    setIsLoading(true);
    console.log(ApiCollection.gamesController.getFeedTournamentDetails,"urlll")
    console.log(token,"tokennn")

    await axios
      .get(
        `${ApiCollection.gamesController.getFeedTournamentDetails}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        console.log(response,"response of tournamets details")
        setFeedtournament(response.data.data.tournaments);
        setTournamentOpen(response.data.data.tournaments.status)
        for(let item of response.data.data.tournaments){
          if(item.status === "open"){
            setTournamentStatus(true) 
              break
          }
      }
        console.log(response,"response of tournamets details")
      })
      .catch((error) => {
        console.log(error.response.data, "errorlllllll response");
      });
  };

// {if (tournamentOpen == "Open"){
//   setTournamentStatus(true);
// }}
  const sendExpoToken = async () => {
    registerForPushNotificationsAsync()
      .then((expoResponse) => {
        if (expoResponse == "Permission Error") {
          Alert.alert("Push Notifications!", "No permission granted!");
        } else {
          axios
            .post(ApiCollection.notificationController.setExpoToken, {
              expoToken: expoResponse,
              id: currentUserId,
            })
            .then((res) => {
              dispatch(setPushNotifications(true));
            })
            .catch((err) => {});
        }
      })
      .catch((err) => {});
  };

  const registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return "Permission Error";
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  };

  const getTimelinePosts = async () => {
    setIsLoading(true);
    await axios
      .get(`${ApiCollection.postController.getTimelinePosts}?page=1`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        setPostList(response.data.data);
        setTempList(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setPostList(null);
        console.log(error.response.data);
        setIsLoading(false);
      });
  };

  const getTimelinePostsRefresh = async () => {
    setModalLoading(true);
    setIsLoading(true);
    await axios
      .get(`${ApiCollection.postController.getTimelinePosts}?page=1`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        setPostList(response.data.data);
        setTempList(response.data.data);
        setIsLoading(false);
        setModalLoading(false);
      })
      .catch((error) => {
        setPostList(null);
        console.log(error.response.data);
        setIsLoading(false);
        setModalLoading(false);
      });
  };

  const deletePostHandler = (postId) => {
    setPostList(postList.filter((post) => post._id !== postId));
  };

  const renderPostCard = ({ item, index }) => {
    return (
      <PostCard
        post={item}
        visibility={item.visibility}
        postId={item._id}
        views={item.views}
        caption={item.caption}
        commentCount={item.comments}
        likeCount={item.likeCount}
        navigation={navigation}
        mediaType={item.mediaType ? item.mediaType : item.typeOfPost}
        media={item.media}
        username={item.userId.username}
        userId={item.userId._id}
        user={item.userId}
        profilePic={item.userId.profilePic}
        createdAt={item.createdAt}
        isLiked={item.isLiked}
        showFollow={!item.isFollowing}
        isFollowing={item.isFollowing}
        showFooter={true}
        redirectUser={true}
        onDelete={() => deletePostHandler(item._id)}
      />
    );
  };

  const onRefresh = useCallback(() => {
    setPage(2);
    getTimelinePostsRefresh();
  }, []);

  const getMorePosts = async () => {
    await axios
      .get(`${ApiCollection.postController.getTimelinePosts}?page=${page}`, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((response) => {
        setPage(page + 1);
        setPostList(postList.concat(response.data.data));
      })
      .catch((error) => {
        setPostList(null);
      });
  };
  
  const openTournament = (item) => {
    navigation.navigate(
      Routes.sharedTournamentView,
      { tournament: item }
    );
  };

  const mode = DarkModeStatus();
  // 
  const TournamentCard = ({ item}) => {
    return item.status ==="open" && (
      <TouchableOpacity
        activeOpacity={1}
        onPress={()=>openTournament(item)}
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
              <Text style={{ color: "whitesmoke", fontSize: 15, marginTop: 2 }}>
                {item.gameName}
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

        {/* <LinearGradient
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
            left:"82%",
            padding: 5,
            marginLeft:-20,
          }}
        > */}
          <TouchableOpacity
              onPress={() =>
                navigation.navigate(Routes.tabStack.tournamentStack.registerScreen,{ tournament: item })
              }
              style={{width:80, height:60,marginTop:16, marginLeft:270}}
            >
             <View style={{backgroundColor:Colors.primary, borderColor:Colors.primary,alignItems:"center",borderRadius:8, justifyContent:"center"}}>
          {/* <Text style={{ color: "white", fontSize: 16, alignItems:"center",fontWeight:"bold",alignContent:"center",justifyContent:"center", alignSelf:"center", marginBottom:2,padding:2}}>Join</Text> */}

          </View>
          </TouchableOpacity>
          
        {/* </LinearGradient> */}

        {/* <LinearGradient
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
          <View style={{flexDirection:"row", justifyContent:"space-between"}}>
          <Text style={{ color: "white", fontSize: 14, marginTop: 5 }}>
            Reward -{item.rewards[0]}
          </Text>
          <Text style={{ color: "white", fontSize: 14, fontWeight: "bold", marginTop: 5 }}>
            Start - {moment(item.startTime).format('MMMM Do YYYY, h:mm a')}
          </Text>
          </View>
        </LinearGradient>

        <View style={styles.viewButton}>
          <View style={{ borderTopRightRadius: 10, alignItems: "flex-start",flexDirection:"row" }}>
            <Text style={{ color: "white", fontSize: 14 }}>Status -</Text>
            <Text style={{ color: "white", fontSize: 14, fontWeight: "bold", marginLeft:8 }}>
              {item.status == "open" ? "Open" : "Closed"}
              
            </Text>
          </View>
        </View> */}

        {/* <View style={styles.viewButton} >           
                    <View style={[styles.headerTriangleCorner2]}></View>            
                    <View  style={{width:'100%',paddingHorizontal:10,paddingVertical:10,justifyContent:'center',alignItems:'flex-start',backgroundColor:Colors.primary,borderTopLeftRadius:10}}>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,fontWeight:'700',color:'white',width:'100%'}}>{item.status=='open'?'Open':'Closed'}</Text>
                    </View>
                   
                </View> */}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.page, mode ? getDarkTheme : getLightTheme]}>
      <LoadingModal modalVisible={modalLoading} />
      {!isLoading && postList !== null && postList.length == 0 && (
        <View style={{ width: Dimensions.get("screen").width - 20 }}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.homeHeadPanel,
              mode ? getDarkTheme : getLightTheme,
            ]}
          >
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(Routes.tabStack.leaderBoardStack.tag)
              }
              style={styles.panelObject}
            >
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                  borderRadius: styles.panelObject.borderRadius,
                }}
                source={{
                  uri: "https://t4.ftcdn.net/jpg/04/89/92/91/360_F_489929101_82uMqHUKWmc8RdEdJG6v23mtADyjC71e.jpg",
                }}
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.panelText}
              >
                LEADERBOARD
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(Routes.tabStack.discoverStack.tag)
              }
              style={styles.panelObject}
            >
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                  borderRadius: styles.panelObject.borderRadius,
                }}
                source={{
                  uri: "https://signal.avg.com/hubfs/Blog_Content/Avg/Signal/AVG%20Signal%20Images/9%20Ways%20to%20Boost%20Your%20Gaming%20Rig/How_to_Improve_Your_Gaming_PC_Performance-Hero.jpg",
                }}
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.panelText}
              >
                DISCOVER
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(Routes.tabStack.tournamentStack.tag)
              }
              style={styles.panelObject}
            >
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                  borderRadius: styles.panelObject.borderRadius,
                }}
                source={{
                  uri: "https://cdn4.vectorstock.com/i/1000x1000/62/18/versus-game-cover-banner-sport-vs-team-concept-vector-29006218.jpg",
                }}
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.panelText}
              >
                TOURNAMENT
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate(Routes.tabStack.tournamentStack.tag)
              }
              style={styles.panelObject}
            >
              <Image
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                  borderRadius: styles.panelObject.borderRadius,
                }}
                source={{
                  uri: "https://img.etimg.com/thumb/msid-81264332,width-650,imgsize-561016,,resizemode-4,quality-100/esports1_istock.jpg",
                }}
              />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.panelText}
              >
                PLAYER CARD
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {!isLoading ? (
        postList != null ? (
          <FlatList
            refreshControl={
              <RefreshControl
                tintColor={mode ? getDarkTheme.backgroundColor : Colors.primary}
                colors={[mode ? getDarkTheme.backgroundColor : Colors.primary]}
                refreshing={isLoading}
                onRefresh={onRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              postList.length != 0 && (
                <View
                  style={[
                    { width: Dimensions.get("screen").width - 20 },
                    {
                      backgroundColor: mode
                        ? getDarkTheme.backgroundColor
                        : getLightTheme.backgroundColor,
                    },
                  ]}
                >
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.homeHeadPanel}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(
                          Routes.tabStack.leaderBoardStack.tag
                        )
                      }
                      style={styles.panelObject}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                          resizeMode: "cover",
                          borderRadius: styles.panelObject.borderRadius,
                        }}
                        source={{
                          uri: "https://t4.ftcdn.net/jpg/04/89/92/91/360_F_489929101_82uMqHUKWmc8RdEdJG6v23mtADyjC71e.jpg",
                        }}
                      />
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.panelText}
                      >
                        LEADERBOARD
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(Routes.tabStack.discoverStack.tag)
                      }
                      style={styles.panelObject}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                          resizeMode: "cover",
                          borderRadius: styles.panelObject.borderRadius,
                        }}
                        source={{
                          uri: "https://signal.avg.com/hubfs/Blog_Content/Avg/Signal/AVG%20Signal%20Images/9%20Ways%20to%20Boost%20Your%20Gaming%20Rig/How_to_Improve_Your_Gaming_PC_Performance-Hero.jpg",
                        }}
                      />
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.panelText}
                      >
                        DISCOVER
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(Routes.tabStack.tournamentStack.tag)
                      }
                      style={styles.panelObject}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                          resizeMode: "cover",
                          borderRadius: styles.panelObject.borderRadius,
                        }}
                        source={{
                          uri: "https://cdn4.vectorstock.com/i/1000x1000/62/18/versus-game-cover-banner-sport-vs-team-concept-vector-29006218.jpg",
                        }}
                      />
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.panelText}
                      >
                        TOURNAMENT
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(Routes.tabStack.playerCardStack.tag)
                      }
                      style={styles.panelObject}
                    >
                      <Image
                        style={{
                          width: "100%",
                          height: "100%",
                          resizeMode: "cover",
                          borderRadius: styles.panelObject.borderRadius,
                        }}
                        source={{
                          uri: "https://img.etimg.com/thumb/msid-81264332,width-650,imgsize-561016,,resizemode-4,quality-100/esports1_istock.jpg",
                        }}
                      />
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.panelText}
                      >
                        PLAYER CARD
                      </Text>
                    </TouchableOpacity>
                   
                  </ScrollView>
                  {tournamentStatus && <View style={{}}><View style={{justifyContent:"flex-start", alignItems:"flex-start", padding:5}}>
                    <Text style={{fontSize:17, fontWeight:"bold", color:Colors.primary, marginBottom:5}}>Upcoming Scrims/Tournaments</Text>
                    <FlatList
                    data={feedtournament}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                      <RefreshControl
                        tintColor={Colors.primary}
                        colors={[Colors.primary]}
                        refreshing={isLoading}
                        onRefresh={() => getFeedTournament()}
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
                  </View></View>}
                </View>
              )
            }
            data={postList}
            onEndReached={getMorePosts}
            onEndReachedThreshold={1.2}
            renderItem={renderPostCard}
            ListEmptyComponent={
              <NoData style={{ height: 500 }} title="No Posts right now !" />
            }
            keyExtractor={(item, index) => item._id}
            contentContainerStyle={[
              {
                paddingBottom: 20,
                justifyContent: "center",
                alignItems: "center",
              },
              {
                backgroundColor: mode
                  ? getDarkTheme.backgroundColor
                  : getLightTheme.backgroundColor,
              },
            ]}
          />
        ) : (
          <ServerError onRefresh={onRefresh} />
        )
      ) : tempList.length !== 0 ? (
        <FlatList
          //refreshControl={<RefreshControl tintColor={Colors.primary}  colors={[Colors.primary]} refreshing={isLoading} onRefresh={onRefresh}/>}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            tempList.length != 0 && (
              <View
                style={[
                  { width: Dimensions.get("screen").width - 20 },
                  {
                    backgroundColor: mode
                      ? getDarkTheme.backgroundColor
                      : getLightTheme.backgroundColor,
                  },
                ]}
              >
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.homeHeadPanel,
                    mode ? getDarkTheme : getLightTheme,
                  ]}
                >
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(Routes.tabStack.leaderBoardStack.tag)
                    }
                    style={styles.panelObject}
                  >
                    <Image
                      style={{
                        width: "100%",
                        height: "100%",
                        resizeMode: "cover",
                        borderRadius: styles.panelObject.borderRadius,
                      }}
                      source={{
                        uri: "https://t4.ftcdn.net/jpg/04/89/92/91/360_F_489929101_82uMqHUKWmc8RdEdJG6v23mtADyjC71e.jpg",
                      }}
                    />
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.panelText}
                    >
                      LEADERBOARD
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(Routes.tabStack.discoverStack.tag)
                    }
                    style={styles.panelObject}
                  >
                    <Image
                      style={{
                        width: "100%",
                        height: "100%",
                        resizeMode: "cover",
                        borderRadius: styles.panelObject.borderRadius,
                      }}
                      source={{
                        uri: "https://signal.avg.com/hubfs/Blog_Content/Avg/Signal/AVG%20Signal%20Images/9%20Ways%20to%20Boost%20Your%20Gaming%20Rig/How_to_Improve_Your_Gaming_PC_Performance-Hero.jpg",
                      }}
                    />
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.panelText}
                    >
                      DISCOVER
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(Routes.tabStack.tournamentStack.tag)
                    }
                    style={styles.panelObject}
                  >
                    <Image
                      style={{
                        width: "100%",
                        height: "100%",
                        resizeMode: "cover",
                        borderRadius: styles.panelObject.borderRadius,
                      }}
                      source={{
                        uri: "https://cdn4.vectorstock.com/i/1000x1000/62/18/versus-game-cover-banner-sport-vs-team-concept-vector-29006218.jpg",
                      }}
                    />
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.panelText}
                    >
                      TOURNAMENT
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(Routes.tabStack.playerCardStack.tag)
                    }
                    style={styles.panelObject}
                  >
                    <Image
                      style={{
                        width: "100%",
                        height: "100%",
                        resizeMode: "cover",
                        borderRadius: styles.panelObject.borderRadius,
                      }}
                      source={{
                        uri: "https://img.etimg.com/thumb/msid-81264332,width-650,imgsize-561016,,resizemode-4,quality-100/esports1_istock.jpg",
                      }}
                    />
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.panelText}
                    >
                      PLAYER CARD
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )
          }
          data={tempList}
          renderItem={renderPostCard}
          ListEmptyComponent={
            <NoData style={{ height: 500 }} title="No Posts right now !" />
          }
          keyExtractor={(item, index) => item._id}
          contentContainerStyle={[
            {
              paddingBottom: 20,
              justifyContent: "center",
              alignItems: "center",
            },
            {
              backgroundColor: mode
                ? getDarkTheme.backgroundColor
                : getLightTheme.backgroundColor,
            },
          ]}
        />
      ) : (
        <Loading />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  homeHeadPanel: {
    // width:Dimensions.get('window').width-20,
    flexDirection: "row",
    marginVertical: 15,
    borderRadius: 5,
    justifyContent: "space-between",
    alignItems: "center",
  },
  panelObject: {
    backgroundColor: "black",
    height: 150,
    width: 110,
    borderRadius: 8,
    margin: 5,
    //overflow:'hidden',
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  tournamentCard: {
    width: Dimensions.get("window").width -30,
    borderRadius: 8,
    height: 120,
    backgroundColor: "black",
    overflow: "hidden",
    borderColor: Colors.primary,
    borderWidth: 2,
    marginBottom: 15,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "flex-end",
    position: "absolute",
    bottom: 20,
    right: 0,
    padding: 10,
  },
  item: {
    marginVertical: 5,
    marginHorizontal: 5,
    height:70,
    borderWidth:1, 
    borderColor:"grey",
    borderRadius:15,
    backgroundColor: Colors.primary,
    alignContent:"center",
    alignItems:"center",
    justifyContent:"space-between",

  },
  title: {
    padding:10,
    color: "white",

  },
  panelText: {
    position: "absolute",
    bottom: 0,
    padding: 10,
    fontSize: ScreenWidthResponser(12, 12, 10),
    color: "white",
    width: "100%",
    textAlign: "center",
  },
});
