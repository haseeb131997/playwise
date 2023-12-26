import React from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Slider from 'react-native-slider';
import { Colors } from '../utils/colors';
import { Routes } from '../utils/routes';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const VideoControls = (props) => {


    const navigation = useNavigation();

    const {
        state,
        isMuted,
        togglePlay,
        playbackInstanceInfo,
        setPlaybackInstanceInfo,
        playbackInstance,
        toggleMute,
        sliderStyle,
        smallSlider,
    } = props;
    function renderIcon() {
        if (state === 'Buffering') {
            return <ActivityIndicator size={20} color={Colors.primary} />;
        } else if (state === 'Playing') {
            return <FontAwesome name="pause" size={18} color={Colors.primary} />;
        } else if (state === 'Paused') {
            return <FontAwesome name="play" size={20} color={Colors.primary} />;
        } else if (state === 'Ended') {
            return <MaterialIcons name="replay" size={20} color={Colors.primary} />;
        }
    }

    const horizontalViewOpen = () => {

        if(props.type=='fullScreen'){
            const media = {
                videoSource: props.uri,
                videoDuration: playbackInstanceInfo.duration,
                videoPosition: playbackInstanceInfo.position,
                videoState: playbackInstanceInfo.state,
                videoMuted: playbackInstanceInfo.isMuted,
    
            }
    
            playbackInstance?.pauseAsync();
            navigation.navigate(Routes.tabBarHiddenScreens.postStack.horizontalView, { media: media })
        }else{
            navigation.goBack()
        }
        
       
    }

    const showRotate = () => {
        if(props.type=='fullScreen'){
            return true
        }else if(props.type=='horizontalView'){
            return true
        }else{
            return false
        }
    }

    return (
        <View style={styles.container}>
            <View tint="dark" intensity={42} style={styles.innerContainer}>
                <Pressable style={styles.iconWrapper} onPress={state === 'Buffering' ? null : togglePlay}>
                    {renderIcon()}
                </Pressable>
                <Slider
                    style={[styles.sliderSmall,sliderStyle]}
                    thumbTintColor={'transparent'}
                    thumbStyle={{
                        height: 13,
                        width: 13,
                        borderRadius: 100,
                    }}
                    
                    minimumTrackTintColor={Colors.primary}
                    maximumTrackTintColor="#8E9092"
                    value={
                        playbackInstanceInfo.duration
                            ? playbackInstanceInfo.position / playbackInstanceInfo.duration
                            : 0
                    }
                    onSlidingStart={() => {
                        if (playbackInstanceInfo.state === 'Playing') {
                            togglePlay()
                            setPlaybackInstanceInfo({ ...playbackInstanceInfo, state: 'Paused' })
                        }
                    }}
                    onSlidingComplete={async e => {
                        const position = e * playbackInstanceInfo.duration
                        if (playbackInstance) {
                            await playbackInstance.setStatusAsync({
                                positionMillis: position,
                                shouldPlay: true,
                            })
                        }
                        setPlaybackInstanceInfo({
                            ...playbackInstanceInfo,
                            position,
                        })
                    }}
                />
                <Pressable style={styles.iconWrapper} onPress={toggleMute}>
                    {isMuted?
                    <FontAwesome name='volume-off' size={22} color={Colors.primary} />
                    :
                    <FontAwesome name='volume-up' size={22} color={Colors.primary} />    
                }
                </Pressable>
                {playbackInstance!=null &&
                    showRotate() &&
                    <Pressable style={styles.iconWrapper} onPress={horizontalViewOpen}>
                        <MaterialCommunityIcons name='rotate-3d-variant' size={25} color={Colors.primary} />
                    </Pressable>
                }
               
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 50,
        paddingHorizontal: 0,
        paddingRight: 10,
        width: '100%',


    },
    iconWrapper: {
        //backgroundColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: 40,
        borderRadius: 50,
    },
    sliderSmall: {
       // flex: 1,
        width:230,
        marginHorizontal: 20,
    },
    slider: {
        flex: 1,
        marginHorizontal: 20,
    }
});
export default VideoControls;