import React,{useState,createRef, useEffect, useRef} from "react";
import { View, Text, Image,StyleSheet, TouchableOpacity, Dimensions,FlatList, Platform } from "react-native";
import { Colors } from "../../../utils/colors";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { CustomIcon } from "../../../components/customIconPack";
import VideoPlayerFullScreen from "../../../components/VideoPlayerFullScreen";
import axios from "axios";
import { ApiCollection } from "../../../configs/envConfig";
import { UserToken } from "../../../app/useStore";
import { Routes } from "../../../utils/routes";
import { CommentSheet } from "../../../components/commentSheet";
import MateriaCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from "expo-linear-gradient";
import DoubleClickAnimated from "react-native-double-click-instagram";
import ImageZoom from 'react-native-image-pan-zoom';
import DoubleClick from "react-native-double-tap";

export default function FullscreenView({route, navigation }) {

    const isPortrait = () => {
        const dim = Dimensions.get('screen');
        return dim.height >= dim.width;
      };
    

    const { postData } = route.params;

    const token = UserToken();
    const CommentSheetRef = createRef();
    const playbackInstance = useRef(null);
    

    const media = postData.media;
    const commentCount = postData.commentCount;
    const postId = postData.postId;

    const [isLiked, setIsLiked] = useState(postData.isLiked);
    const [likeCount, setLikeCount] = useState(postData.likeCount)
    const [mediaLoaded, setMediaLoaded] = useState(false);

    const [playing, setPlaying] = useState(false);

    const pauseVideo=()=>{
        if(playbackInstance.current){
            
            playbackInstance.current?.setStatusAsync({shouldPlay:!playing})
            setPlaying(!playing)
            //playbackInstance.current?.playAsync();
        }

    }




    const renderMedia = ({ item }) => {
        if(item.type.split("/")[0]=='image'){
            return(

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
                                {/* <ImageZoom cropWidth={Dimensions.get('window').width}
                       cropHeight={Dimensions.get('window').height}
                       imageWidth={styles.image.width}
                       imageHeight={styles.image.height}> */}
                        <Image 
                            onLoad={()=>setMediaLoaded(true)}
                            source={mediaLoaded?{uri: `${item.url}`}:{uri: `${item.compressedUrl ? item.compressedUrl : item.url}`}} 
                            style={styles.image}/>
                        {/* </ImageZoom> */}
                        </DoubleClickAnimated>
                </View>
            )
        }else if(item.type!==undefined && item.type.split("/")[0]=='video'){
            return(
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
                                    <VideoPlayerFullScreen playbackInstance={playbackInstance} videoUri={`${item.compressedUrl ? item.compressedUrl : item.url}`} item={item} smallSlider={false} customControlContainer={{paddingRight:0}}/>
                                </DoubleClick>
                   
                    </DoubleClickAnimated>
                 </View>
            )
        }   

    }

    const doubleTapLike =async ()=>{
        if(isLiked==false && likeCount>=0){
            setIsLiked(true)
            setLikeCount(likeCount+1)
            await axios.put(`${ApiCollection.postController.likePost}/${postId}/like`,{},{headers:{'Authorization':'Bearer '+token}})
        }
        
    }

    const likePost=async()=>{
        if(isLiked && likeCount>0){
            setIsLiked(false)
            setLikeCount(likeCount-1)
            await axios.put(`${ApiCollection.postController.likePost}/${postId}/like`,{},{headers:{'Authorization':'Bearer '+token}})
        }else{
            setIsLiked(true)
            setLikeCount(likeCount+1)
            await axios.put(`${ApiCollection.postController.likePost}/${postId}/like`,{},{headers:{'Authorization':'Bearer '+token}})
        }
    }

    const openComments=()=>{
        //CommentSheetRef.current.open();
        navigation.push(Routes.tabBarHiddenScreens.postStack.tag,{postId:postData.postId})
    }

    const openUserProfile=()=>{
        navigation.push(Routes.tabBarHiddenScreens.playerStack.tag,{userId:postData.user._id})
    }

    const goBack=()=>{
        const upadtedData = {
            isLiked:isLiked,
            likeCount:likeCount,
            postId:postId
        }
        navigation.navigate({name:Routes.tabStack.homeStack.homeScreen,params:{upadtedData:upadtedData},merge:true})
    }

    
    return(
        <View style={ [styles.container]}>
            <LinearGradient colors={['rgba(0,0,0,0.6)','rgba(0,0,0,0.4)','rgba(0,0,0,0)',]} style={{width:Dimensions.get('screen').width,padding:10,paddingHorizontal:15,flexDirection:'row',justifyContent:'space-between',alignItems:'center',position:'absolute',zIndex:100,top:0,height:150}}>
                <TouchableOpacity activeOpacity={1} onPress={openUserProfile} style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                    <View>
                        <Image source={{uri:postData.user.profilePic}} style={{width:40,height:40,borderRadius:50}}/>
                    </View>
                    <View>
                        <Text style={{color:'white',fontWeight:'bold',fontSize:18,marginLeft:10}}>@{postData.user.username}</Text>
                        <Text style={{color:'white',fontSize:14,marginLeft:10,marginTop:3}}>{postData.user.name}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={goBack}>
                    <AntDesign name={'close'} size={25} color={'white'} />
                </TouchableOpacity>
            </LinearGradient>

                <FlatList 
                    scrollEnabled={media.length>1 }
                    data={media}
                    renderItem={renderMedia}
                    keyExtractor={(item,index) => index}
                    horizontal={true}
                    snapToInterval={Dimensions.get('screen').width}
                />

            <View style={{width:Dimensions.get('screen').width*0.8,padding:10,backgroundColor:'#fff8',flexDirection:'row',justifyContent:'space-between',alignItems:'center',margin:10,paddingHorizontal:10,borderRadius:10,position:'absolute',bottom: Platform.OS=='android'?20: 50}}>
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
                    <Text style={{color:'black',fontSize:16,marginHorizontal:10}}>{postData.views}</Text>
                </View>
            </View>

            {/* <CommentSheet ref={CommentSheetRef} postId={postId} height={Dimensions.get('screen').height*0.6}/> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: '#212121',
    },
    image:{
        width: Dimensions.get('screen').width,
        height:Dimensions.get('window').height,
        resizeMode:'contain',
    },
    mediaHolder:{
        width: Dimensions.get('screen').width,
        height:Dimensions.get('window').height,
        backgroundColor:'black',
        justifyContent:'center',
        alignContent:"center",
        alignItems:'center',
        marginBottom:10
    },
})