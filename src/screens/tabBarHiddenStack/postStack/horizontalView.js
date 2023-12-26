import React,{useState,useEffect,useRef} from "react";
import { View, Text,Dimensions,StyleSheet } from "react-native";
import { Colors } from "../../../utils/colors";
import { Routes } from "../../../utils/routes";
import { useNavigation } from "@react-navigation/native";
import { Video } from 'expo-av';
import VideoControls from "../../../components/VideoControls";
import { LinearGradient } from 'expo-linear-gradient';


export default function HorizontalView({route}) {

    const media = route.params.media;
    const navigation = useNavigation();


    const playbackInstance = useRef(null);

    useEffect(() => {
        playbackInstance.current.pauseAsync();
    }, [navigation]);



    const [playbackInstanceInfo, setPlaybackInstanceInfo] = useState({
        position: media.videoPosition,
        duration: media.videoDuration,
        state: media.videoState,
        isMuted:media.videoMuted,
    });


    const togglePlay = async () => {
        const shouldPlay = playbackInstanceInfo.state !== 'Playing';
        if (playbackInstance.current !== null) {
            await playbackInstance.current.setStatusAsync({
                shouldPlay,
                ...(playbackInstanceInfo.state === 'Ended' && { positionMillis: 0 }),
            })
            setPlaybackInstanceInfo({
                ...playbackInstanceInfo,
                state:
                    playbackInstanceInfo.state === 'Playing'
                        ? 'Paused'
                        : 'Playing',
            })
        }
    }


    const toggleMute = async () => {
        const videoState= playbackInstanceInfo.state;

       const newInfo ={
           ...playbackInstanceInfo,
           state:videoState,
           isMuted: !playbackInstanceInfo.isMuted,
       }
       setPlaybackInstanceInfo(newInfo)
   }

   const updatePlaybackCallback = (status) => {
    if (status.isLoaded) {
        setPlaybackInstanceInfo({
            ...playbackInstanceInfo,
            position: status.positionMillis,
            duration: status.durationMillis || 0,
            state: status.didJustFinish ? 'Ended' :
                status.isBuffering ? 'Buffering' :
                    status.shouldPlay ? 'Playing' : 'Paused'
        })
    } else {
        if (status.isLoaded === false && status.error) {
            const errorMsg = `Encountered a fatal error during playback: ${status.error}`;
            // setErrorMessage(errorMsg)
        }
    }
}


    return(
            <View style={{ justifyContent:'center',alignItems:'center',backgroundColor:'black',flex:1 }}>
                <Video
                    ref={playbackInstance}
                    style={styles.video}
                    source={{ uri: media.videoSource }}
                    //posterSource={{ uri: media.videoSource }}
                    //shouldPlay={playVideo}
                    resizeMode="contain"
                    isLooping={false}
                    isMuted={playbackInstanceInfo.isMuted}
                    onPlaybackStatusUpdate={updatePlaybackCallback}
                />
                <LinearGradient colors={['transparent','rgba(0,0,0,0.6)','rgba(0,0,0,0.9)']} style={styles.controllerHolder}>
                    <VideoControls
                        smallSlider={false}
                        state={playbackInstanceInfo.state}
                        isMuted={playbackInstanceInfo.isMuted}
                        playbackInstance={playbackInstance.current}
                        playbackInstanceInfo={playbackInstanceInfo}
                        setPlaybackInstanceInfo={setPlaybackInstanceInfo}
                        togglePlay={togglePlay}
                        toggleMute={toggleMute}
                        uri={ media.videoSource}
                        sliderStyle={{width:Dimensions.get('screen').height*0.65}}
                        type="horizontalView"
                    />
                </LinearGradient>
        </View>
    )

}


const styles = StyleSheet.create({
    video:{
        width:Dimensions.get('screen').height,
        height:Dimensions.get('screen').width,
        backgroundColor:'black',
        transform: [{ rotate: '90deg'},],
    },
    controllerHolder:{
        width:Dimensions.get('screen').height*0.85,
        position:'absolute',
        justifyContent:'center',
        right:2,
        alignItems:'center',
        transform: [{ rotate: '90deg'},],
    }
})