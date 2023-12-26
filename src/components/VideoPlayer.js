import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StyleSheet, Text, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { Feather } from "react-native-vector-icons";
import VideoControls from './VideoControls';
import VisibilitySensor from '@svanboxel/visibility-sensor-react-native'
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

export default function VideoPlayer(props) {

    const navigation = useNavigation();


    const {
        videoUri,
        outOfBoundItems,
        item,
        smallSlider,
    } = props;

    useEffect(()=>{
        playbackInstance.current.pauseAsync();
        setPlayVideo(false)
    },[navigation])


    const playbackInstance = useRef(null);

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
                    shouldPlay: false,
                    isMuted: true
                })
            }
        }
    }, []);


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

    const toggleMute =  () => {
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
        <View style={{ flex: 1, marginBottom: 20 }}>
            <Video
                ref={playbackInstance}
                style={{width:Dimensions.get('window').width,minHeight:400,maxHeight:400,marginRight:2}}
                source={{ uri: videoUri }}
                posterSource={{ uri: item.thumbnail }}
                shouldPlay={playVideo}
                resizeMode="contain"
                isLooping={false}
                isMuted={playbackInstanceInfo.isMuted}
                onPlaybackStatusUpdate={updatePlaybackCallback}
            />
            <View style={[styles.controlsContainer,props.customControlContainer]}>
                <VideoControls
                    smallSlider={smallSlider}
                    state={playbackInstanceInfo.state}
                    isMuted={playbackInstanceInfo.isMuted}
                    playbackInstance={playbackInstance.current}
                    playbackInstanceInfo={playbackInstanceInfo}
                    setPlaybackInstanceInfo={setPlaybackInstanceInfo}
                    togglePlay={togglePlay}
                    toggleMute={toggleMute}
                />
            </View>
        </View>
        </VisibilitySensor>
    );
}
const styles = StyleSheet.create({
    video: {
        alignSelf: 'center',
        width: width,
        height: height / 1.6
    },
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    controlsContainer: {
        position: 'absolute',
        bottom: -10,
        paddingRight:20,

    }
});