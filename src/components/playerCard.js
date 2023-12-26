import React,{forwardRef,useState,createRef} from "react";
import { View,Text,Image,ImageBackground,StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Colors } from "../utils/colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "../utils/routes";
import {captureRef} from 'react-native-view-shot';
import * as Sharing from 'expo-sharing'; 
import LoadingModal from "./loadingModal";
import { LinearGradient } from "expo-linear-gradient";
import playWiseLogo from '../../assets/logo/icon.png'
import {PubgPoster, fortnitePlayerCardBG,apexPlayerCardBG,csgoPlayerCardBG,cocPlayerCardBG } from "../../assets/images";

const cardWidth = Dimensions.get('screen').width-30

const Triangle = (props) => {
    return <View style={[styles.triangle, props.style]} />;
  };


export default function PlayerCard({data,onClosePress}){

    const cardData = data;
    const navigation = useNavigation();
    const frontCardRef = createRef();
    const backCardRef = createRef();
    const [capturing, setCapturing] = useState(false);

    const [side,setSide] = useState('front')

    const backCardBG= ()=>{
        switch(cardData.game){
            case 'fortnite':
                return fortnitePlayerCardBG;
            case 'apexLegends':
                return apexPlayerCardBG;
            case 'cs-go':
                return csgoPlayerCardBG;
            case 'coc':
                return cocPlayerCardBG;
            case 'pubg':
                return PubgPoster;
            default:
                return fortnitePlayerCardBG;
        }
    }


    const shareCard = async() => {
        
            //setCapturing(true)
            const frontUri = await captureRef(frontCardRef.current, {
                filename:`${Date.now()}`,
                format: 'png',
                quality: 0.8,
              })

              const backUri = await captureRef(backCardRef.current, {
                filename:`${Date.now()}`,
                format: 'png',
                quality: 0.8,
              })


            //setCapturing(false)
            onClosePress()
    
            const shareData={
                uriFront:frontUri,
               uriBack:backUri,
                gameName:cardData.game
            }    
            navigation.navigate(Routes.drawerStack.profileStack.myStats.shareCardScreen,shareData)
       
       
      
    }

    const FrontCard = ((props,) => {
        return(
            <View ref={frontCardRef} style={[styles.container,props.style]}>

        <ImageBackground source={cardData.poster} style={{width:'100%',height:'100%',}}>
            
             <LinearGradient  colors={['black','#0009','transparent','black'].reverse()} style={{width:'100%',height:'100%',justifyContent:'space-between'}}>

                    <View style={{padding:10,paddingTop:0,paddingBottom:0,flexDirection:'row',width:'100%',justifyContent:'space-between',alignItems:'center'}}>
                        <View style={{justifyContent:'center',alignItems:'center'}}>
                            <Image source={playWiseLogo} style={{height:80,width:80,marginTop:0}}/>
                        </View>
                        
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <TouchableOpacity onPress={shareCard} style={{padding:5,borderRadius:5,marginRight:5}}>
                                <AntDesign name='sharealt' size={25} color={'white'} />
                            </TouchableOpacity>
{/* 
                            <TouchableOpacity onPress={onClosePress} style={{padding:10}}>
                                <AntDesign name='close' size={25} color={'white'} />
                            </TouchableOpacity> */}
                        </View>
                   
                        
                    </View>
                
                
         

                <View style={{flexDirection:'row',padding:10,justifyContent:'space-between',alignItems:'center',flexWrap:'wrap'}}>
                    {
                        cardData!==null ?
                            cardData.stats.map((stat,index)=>(
                                <View key={index} style={{marginVertical:10,alignItems:'center',width:'50%'}}>
                                    <Text style={{color:'white'}}>{stat.name}</Text>
                                    <Text style={{color:'white',fontWeight:'bold',textAlign:'center',fontSize:18,marginTop:5}}>{stat.value}</Text>
                                </View>
                            ))
                            :
                        <View style={{marginVertical:20,alignItems:'center'}}>
                            <Text style={{color:'white'}}>Error</Text>
                            <Text style={{color:'white',fontWeight:'bold',fontSize:18,marginTop:5}}>Failed to get Data</Text>
                        </View>
                    }
                </View>
             </LinearGradient>
        </ImageBackground>
    </View>
        )
    })

    const BackCard =((props,) => {
        return(
            <ImageBackground resizeMode="contain"  source={backCardBG()} ref={backCardRef} style={[styles.container,props.style]}>
                <Text style={{color:'white',fontSize:20,marginBottom:10,textDecorationLine:'underline',fontWeight:'bold'}}>OVERALL DETAILS</Text>
                <View style={{width:'85%',flexDirection:'row',padding:20,justifyContent:'space-between',alignItems:'center',flexWrap:'wrap'}}>
                {
                    cardData!==null ?
                        cardData.backStats.map((stat,index)=>(
                            <View key={index} style={{marginVertical:10,width:'45%',alignItems:'center',padding:5,borderRadius:5,backgroundColor:'#fff9'}}>
                                <Text style={{color:'black',fontSize:12,textAlign:'center',fontWeight:'bold'}}>{stat.name}</Text>
                                <Text style={{color:Colors.primary,fontWeight:'bold',textAlign:'center',fontSize:18,marginTop:5}}>{stat.value}</Text>
                            </View>
                        ))
                        :
                    <View style={{marginVertical:20,alignItems:'center'}}>
                        <Text style={{color:'white'}}>Error</Text>
                        <Text style={{color:'white',fontWeight:'bold',fontSize:18,marginTop:5}}>Failed to get Data</Text>
                    </View>
                }
                </View>
            
          
        {/* <Triangle/> */}

   
        </ImageBackground>
        )
    })


    const sideSwitch = () => {
        if(side==='front'){
            setSide('back')
        }else{
            setSide('front')
        }
    }


    return(
        <>
         <LoadingModal modalVisible={capturing} />
        
        <View style={styles.baseCardWrapper}>
            <BackCard  style={[{position:'absolute'},side=='back' &&{zIndex:10}]}/>
            <FrontCard  style={{position:'absolute'}} />
        </View>
         

        <TouchableOpacity onPress={sideSwitch} style={{backgroundColor:Colors.primary,padding:10,paddingHorizontal:10,margin:10,borderRadius:5}}>
            <Text style={{color:'white',fontSize:14}}>Switch</Text>
        </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    baseCardWrapper:{
        width:cardWidth,
        height:350,
    },

    container:{

        backgroundColor:Colors.primary,
        alignItems:"center",
        justifyContent:"center",
        width:cardWidth,
        height:350,
        overflow:'hidden',
        borderRadius:8

    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: cardWidth/2,
        borderRightWidth:cardWidth/2,
        borderBottomWidth: 100,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: Colors.primary,
        transform: [{ rotate: "180deg" }],
      },
    
      backContainer:{

        backgroundColor:Colors.primary,
        alignItems:"center",
        justifyContent:"center",
        width:cardWidth,
        height:350,
        overflow:'hidden',
        padding:20,
        borderRadius:8
      }
})