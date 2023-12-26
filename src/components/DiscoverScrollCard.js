import React,{useRef, useState} from "react";
import { View, Text, Image,StyleSheet, TouchableOpacity, Dimensions,FlatList, Platform } from "react-native";
import { Colors } from "../utils/colors";
import {Routes} from "../utils/routes";
import { ApiCollection } from "../configs/envConfig";
import { UserToken } from "../app/useStore";
import MateriaCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AntDesign from 'react-native-vector-icons/AntDesign';
import VideoPlayerFullScreen from "./VideoPlayerFullScreen";
import { useNavigation } from "@react-navigation/native";
import DoubleClickAnimated from "react-native-double-click-instagram";
import ImageZoom from 'react-native-image-pan-zoom';
import VisibilitySensor from '@svanboxel/visibility-sensor-react-native'
import { useEffect } from "react";
import DoubleClick from "react-native-double-tap";

export default function DiscoverScrollCard(props) {


    const token = UserToken()
    const navigation = useNavigation()

    const postData =  props.postData;

    const media = postData?.media[0];
    const commentCount = postData.commentCount;
    const postId = postData._id;


    const playbackInstance = useRef(null);

    const user = postData.user? postData.user : postData.userId;

    const [isLiked, setIsLiked] = useState(postData.isLiked);
    const [likeCount, setLikeCount] = useState(postData.likeCount)
    const [viewCount, setViewCount] = useState(postData.views)
    const [mediaLoaded, setMediaLoaded] = useState(false);

    const [playing, setPlaying] = useState(false);


    const likePost=async()=>{
        console.log(postData)
        if(isLiked && likeCount>0){
            setIsLiked(false)
            setLikeCount(likeCount-1)
            await axios.put(`${ApiCollection.postController.likePost}/${postId}/like`,{},{headers:{'Authorization':'Bearer '+token}})
            .then(response=>{
                console.log(response.data)
            })
            .catch(err=>{
                console.log(err.response.data)
            })
        }else{
            setIsLiked(true)
            setLikeCount(likeCount+1)
            await axios.put(`${ApiCollection.postController.likePost}/${postId}/like`,{},{headers:{'Authorization':'Bearer '+token}})
            .then(response=>{
                console.log(response.data)
            })
            .catch(err=>{
                console.log(err.response.data)
            })
        }
    }

    const doubleTapLike =async ()=>{
        if(isLiked==false && likeCount>=0){
            setIsLiked(true)
            setLikeCount(likeCount+1)
            await axios.put(`${ApiCollection.postController.likePost}/${postId}/like`,{},{headers:{'Authorization':'Bearer '+token}})
        }
        
    }

    const openComments=()=>{
        //CommentSheetRef.current.open();
        navigation.push(Routes.tabBarHiddenScreens.postStack.tag,{postId:postData._id})
    }

    const openUserProfile=()=>{
        navigation.push(Routes.tabBarHiddenScreens.playerStack.tag,{userId:user._id})
    }

    const goBack=()=>{
        const upadtedData = {
            isLiked:isLiked,
            likeCount:likeCount,
            postId:postId,
            viewCount:viewCount
        }
        navigation.navigate({name:Routes.tabStack.discoverStack.discoverScreen,params:{upadtedData:upadtedData},merge:true})
    }

    const increaseViewCount=async(visible)=>{
        if(visible==false){
            playbackInstance.current?.pauseAsync();
        }

        if(visible==true){
            await axios.post(`${ApiCollection.postController.postViewController}/${postId}`,{},{headers:{'Authorization':'Bearer '+token}})
            .then(response=>{
                setViewCount(response.data)
                //console.log(response.data)
            })
            .catch(err=>{
                //console.warn(err)
            })
        }
    }

    const pauseVideo=()=>{
        if(playbackInstance.current){
            
            playbackInstance.current?.setStatusAsync({shouldPlay:!playing})
            setPlaying(!playing)
            //playbackInstance.current?.playAsync();
        }

    }


    return(
        <VisibilitySensor onChange={(isVisible)=>{increaseViewCount(isVisible)}}>
        <View style={ [styles.container]}>
            <LinearGradient colors={['rgba(0,0,0,0.6)','rgba(0,0,0,0.4)','rgba(0,0,0,0)',]} style={{width:Dimensions.get('screen').width,padding:10,paddingHorizontal:15,flexDirection:'row',justifyContent:'space-between',alignItems:'center',position:'absolute',zIndex:100,top:0,height:150}}>
                <TouchableOpacity activeOpacity={1} onPress={openUserProfile} style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                    <View>
                        <Image source={{uri:user.profilePic}} style={{width:40,height:40,borderRadius:50}}/>
                    </View>
                    <View>
                        <Text style={{color:'white',fontWeight:'bold',fontSize:18,marginLeft:10}}>@{user.username}</Text>
                        <Text style={{color:'white',fontSize:14,marginLeft:10,marginTop:3}}>{user.name}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={goBack}>
                    <AntDesign name={'close'} size={25} color={'white'} />
                </TouchableOpacity>
            </LinearGradient>

                {
                    media.type.split("/")[0]=='image' ?
                        <View style={styles.mediaHolder}>
                            <DoubleClickAnimated
                            icon
                            delay={200}
                            size={100}
                            timeout={800}
                            color={'red'}
                            containerStyle={{justifyContent:'center',alignItems:'center'}}
                            doubleClick={doubleTapLike}
                            >
                                <ImageZoom cropWidth={Dimensions.get('window').width}
                                    cropHeight={Dimensions.get('window').height}
                                    imageWidth={styles.image.width}
                                    imageHeight={styles.image.height}>
                                    
                            <Image 
                                onLoad={()=>setMediaLoaded(true)}
                                source={mediaLoaded?{uri: `${media.url}`}:{uri: `${media.compressedUrl ? media.compressedUrl : media.url}`}} 
                                style={styles.image}/>
                                           </ImageZoom>
                                </DoubleClickAnimated>
                     
                        </View>

                        :
                        media.type!==undefined && media.type.split("/")[0]=='video' &&
                        <View style={styles.mediaHolder}>
                            <DoubleClickAnimated
                            icon
                            delay={200}
                            size={100}
                            timeout={800}
                            color={'red'}
                            containerStyle={{justifyContent:'center',alignItems:'center'}}
                            doubleClick={doubleTapLike}
                            >
                            <DoubleClick singleTap={pauseVideo} doubleTap={null} delay={200}>
                                <VideoPlayerFullScreen playbackInstance={playbackInstance} videoUri={`${media.compressedUrl ? media.compressedUrl : media.url}`} item={media} smallSlider={false} customControlContainer={{paddingRight:0}}/>
                            </DoubleClick>
                            </DoubleClickAnimated>
                        </View>

                }
               <View style={{width:Dimensions.get('screen').width*0.8,padding:10,backgroundColor:'#fff8',flexDirection:'row',justifyContent:'space-between',alignItems:'center',margin:10,paddingHorizontal:10,borderRadius:10,position:'absolute',bottom: Platform.OS=='ios'?30:50}}>
                    <TouchableOpacity onPress={likePost} style={{margin:5,flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                        <AntDesign name={isLiked?"heart":"hearto"} size={22} color={isLiked?Colors.primary:'black'} />
                        <Text style={{color:'black',fontSize:16,marginHorizontal:10}}>{likeCount}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={openComments} style={{margin:5,flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                        <MateriaCommunityIcons name="comment-outline" size={22} color={'black'} />
                        
                        <Text style={{color:'black',fontSize:16,marginHorizontal:10}}>{commentCount}</Text>
                    </TouchableOpacity>

                    <View style={{margin:5,flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                    <AntDesign name="eyeo" size={22} color={'black'} />
                        <Text style={{color:'black',fontSize:16,marginHorizontal:10}}>{viewCount}</Text>
                    </View>
                </View>
        </View>
        </VisibilitySensor>
    )


}

const styles = StyleSheet.create({
    container: {
        width: Platform.OS=='ios'?Dimensions.get('window').width: Dimensions.get('screen').width,
        height:Platform.OS=='ios'?Dimensions.get('window').height: Dimensions.get('screen').height,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#212121',
    },
    image:{
        width: Dimensions.get('window').width,
        height:Dimensions.get('window').height,
        resizeMode:'contain'
    },
    mediaHolder:{
        width: Dimensions.get('window').width,
        height:Dimensions.get('window').height,
        justifyContent:'center',
        alignItems:'center',
        marginBottom:10
    },
})