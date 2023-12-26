import React,{useRef,useState} from "react";
import { View,Text,Image,StyleSheet,Platform, Dimensions,TouchableOpacity,TouchableWithoutFeedback, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { Colors } from "../utils/colors";
import Entypo from "react-native-vector-icons/Entypo";
import playWiseLogo from '../../assets/logo/logo.png'
import * as Sharing from 'expo-sharing'; 
import {captureRef} from 'react-native-view-shot';
import { LinearGradient } from "expo-linear-gradient";
import IonIcons from '@expo/vector-icons/Ionicons';
import LeaderBoardConfig from "../configs/leaderBoardConfig";

export default function LBProfileCard(props){

    const profile = props.data

    const bannerData = LeaderBoardConfig.bannerData

    const gameIndex = bannerData.findIndex(game=>game.slug==profile.gameSlug)


    const playerIdHead =()=>{
        if(profile.gameSlug=='coc'){
            return 'Player Tag'
        }else if(profile.gameSlug=='lol'){
            return 'Champion Id'
        }else if(profile.gameSlug=='cod'){
            return 'Player Id'
        }else if(profile.gameSlug=='valorent'){
            return 'Tag Line'
        }else if(profile.gameSlug=='pubg'){
            return 'Player Id'
        }if(profile.gameSlug=='overWatch'){
            return 'Player Id'
        }
    }

    
    return(
        <View style={styles.container}>
             <Image blurRadius={10} source={{uri:profile.gameBG}} style={styles.cardBG}/>
             <ScrollView style={{padding:20,paddingBottom:50,backgroundColor:'rgba(0,0,0,0.4)'}}>

                <Text style={{fontSize:20,color:'white',fontWeight:"bold",marginBottom:10,textDecorationLine:'underline'}}>{profile.gameName}</Text>
                
                <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
                    <View style={{width:'100%'}}>
                        <View style={{width:'100%',padding:10,paddingLeft:0}}>
                            <Text style={styles.heading}>Player Name</Text>
                            <Text style={{paddingVertical:5,color:'white',fontSize:18}}>{profile.playerData.name}</Text>
                        </View>

                        {
                            profile.playerData.playerId!==null &&
                        <View style={{width:'100%',padding:10,paddingLeft:0}}>
                            <Text style={styles.heading}>{playerIdHead()} </Text>
                            <Text style={{paddingVertical:5,color:'white',fontSize:18}}>{  profile.playerData.playerId}</Text>
                        </View>
                        }

                    </View>

                </View> 

                    <View style={{width:'100%',padding:20,paddingLeft:0,paddingBottom:40}}>
                        <LinearGradient start={[1.0, 0.5]} end={[0.0, 0.5]} locations={[0.0, 1.0]} colors={['transparent',Colors.primary]}
                                style={{paddingLeft:10,alignItems:'center',marginBottom:20,flexDirection:'row',justifyContent:'space-between',width:'100%'}}> 
                            <Text style={{fontSize:20,color:'white',fontWeight:'700',paddingVertical:5}}>Player Stats</Text>
                        </LinearGradient>
                        
                        {bannerData[gameIndex].filterAllowed &&
                            bannerData[gameIndex].filterList.map((filter,index)=>(
                                profile[filter.filterValue] !== null &&
                                <View key={index} style={{width:'100%',marginVertical:5}}>
                                    <Text style={styles.heading}>{filter.filterName}</Text>
                                    {
                                        typeof(profile[filter.filterValue]) == 'string' ?
                                        <Text style={{paddingVertical:5,color:'white',fontSize:18}}>{profile[filter.filterValue]}</Text>
                                        :
                                        <Text style={{paddingVertical:5,color:'white',fontSize:18}}>{filter.filterValue=='kd'? profile[filter.filterValue].toFixed(3): profile[filter.filterValue]}</Text>
                                    }
                                   
                                </View>
                            ))
                        }
                    </View>
                

             </ScrollView>
        </View>

    )
}

const styles = StyleSheet.create({
    container:{
        width: Dimensions.get('window').width * 0.9,
        maxHeight: Dimensions.get('window').height * 0.7,
        overflow:'hidden',
        backgroundColor:'white',
        borderRadius:10,
        borderColor:Colors.primary,
        borderWidth:2
    },
    cardBG:{
        width:'100%',
        height:'100%',
        position:'absolute',
    },
    playerAboutHolder:{
        width:'100%',
        padding:20,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    },
    heading:{
        fontSize:15,
        color:'white',
        fontWeight:'800',
        //textDecorationLine:'underline'
    }

})