import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Text, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { Feather } from "react-native-vector-icons";
import VideoControls from './VideoControls';
import VisibilitySensor from '@svanboxel/visibility-sensor-react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('screen');

export default function VideoPlayerFullScreen(props) {

    const navigation = useNavigation();

    const {
        videoUri,
        outOfBoundItems,
        item,
        smallSlider,
        playbackInstance,
    } = props;

    useEffect(()=>{
        playbackInstance?.current?.pauseAsync();
    },[navigation])

    const [playbackInstanceInfo, setPlaybackInstanceInfo] = useState({
        position: 0,
        duration: 0,
        state: 'Buffering',
        isMuted:true,
    });

    const [playVideo, setPlayVideo] = useState(false);

    useEffect(() => {
        return () => {
            if (playbackInstance.current) {
                playbackInstance.current.setStatusAsync({
                    shouldPlay: false
                })
            }
        }
    }, []);
    useEffect(() => {
        playbackInstance.current.pauseAsync();
    }, [outOfBoundItems]);

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

        const play = newInfo.state=='Playing'?true:false
        setPlaybackInstanceInfo(newInfo)
        setPlayVideo(play)
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

    const handleImageVisibility = visible => {
       if(visible){
            setPlayVideo(true)
        }else{
            setPlayVideo(false)
        }
  }



    return (
        <VisibilitySensor onChange={handleImageVisibility}>
        <View style={{ marginBottom: 20,justifyContent:'center',alignItems:'center',height:'100%' }}>
            <Video
                ref={playbackInstance}
                style={{width:Dimensions.get('screen').width,height:Dimensions.get('screen').height}}
                source={{ uri: videoUri }}
                posterSource={{ uri: item.thumbnail }}
                shouldPlay={playVideo}
                resizeMode="contain"
                isLooping={false}
                isMuted={playbackInstanceInfo.isMuted}
                onPlaybackStatusUpdate={updatePlaybackCallback}
            />
            <View style={{position:'absolute',bottom:120,paddingBottom:10}}>
                <VideoControls
                    smallSlider={smallSlider}
                    state={playbackInstanceInfo.state}
                    isMuted={playbackInstanceInfo.isMuted}
                    playbackInstance={playbackInstance.current}
                    playbackInstanceInfo={playbackInstanceInfo}
                    setPlaybackInstanceInfo={setPlaybackInstanceInfo}
                    togglePlay={togglePlay}
                    toggleMute={toggleMute}
                    uri={videoUri}
                    type="fullScreen"
                />
            </View>
        </View>
        </VisibilitySensor>
    );
}
