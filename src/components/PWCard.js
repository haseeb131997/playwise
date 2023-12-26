import React,{useRef,useState} from "react";
import { View,Text,Image,StyleSheet,Platform, Dimensions,TouchableOpacity,TouchableWithoutFeedback, Pressable, ActivityIndicator } from "react-native";
import { Colors } from "../utils/colors";
import Entypo from "react-native-vector-icons/Entypo";
import playWiseLogo from '../../assets/logo/logo.png'
import * as Sharing from 'expo-sharing'; 
import {captureRef} from 'react-native-view-shot';

export default function PWCard(props){

    const viewRef = useRef();
    const [capturing, setCapturing] = useState(false);
    const profile = props.data
  

    let openShareDialogAsync = async () => {    
        
        
        if (Platform.OS === 'web') {
          alert(`Uh oh, sharing isn't available on your platform`);
          return;
        }
        setCapturing(true)
        const uri = await captureRef(viewRef.current, {
            filename:'predator345 PW Card for Playwise',
            format: 'png',
            quality: 0.8,
          })
        setCapturing(false)
        await Sharing.shareAsync(uri)
      }; 

      const ShareCard=()=>{
        return(
        <View ref={viewRef} style={styles.card}>
            <Image blurRadius={7} source={{uri:profile.coverPic}} style={styles.cardBG}/>
            <View style={styles.bodyWrapper}>
                <Image source={{uri:profile.profilePic}} style={{width:60,height:60,borderRadius:50,borderWidth:2,borderColor:'white'}}/>
                <View style={{marginVertical:10,justifyContent:'center',alignItems:'center'}}>
                    <Text style={{fontSize:16,color:'white',fontWeight:'700',marginRight:10}}>{profile.name}</Text>
                    <Text style={{fontSize:14,color:'white',marginTop:0}}>{profile.username}</Text>
                </View>
                <Image source={{uri:`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${profile.id}`}} style={{width:140,height:140,marginVertical:10}}/>
                <Entypo name='camera' size={30} color='white' style={{marginVertical:10,marginBottom:5}}/>
                <Text style={{width:'70%',color:'white',fontWeight:'500',marginTop:5,marginBottom:10,textAlign:'center'}}>Scan this QR Code with our Playwise app, and view {`${profile.username}`} profile !</Text>
                <Image source={playWiseLogo} style={{height:20,width:200,marginTop:20}}/>
            </View>
        </View>
        )
      }
    
    return(
        <View style={styles.container}>
           
            <View>
                <View style={styles.card}>  
                    <Image blurRadius={7} source={{uri:profile.coverPic}} style={styles.cardBG}/>
                    <View style={styles.bodyWrapper}>
                    <Image source={{uri:profile.profilePic}} style={{width:60,height:60,borderRadius:50,borderWidth:2,borderColor:'white'}}/>
                    <View style={{marginVertical:10,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:16,color:'white',fontWeight:'700',marginRight:10}}>{profile.name}</Text>
                        <Text style={{fontSize:14,color:'white',marginTop:0}}>{profile.username}</Text>
                    </View>
                    <Image source={{uri:`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${profile.id}`}} style={{width:140,height:140,marginVertical:10}}/>
                    <Text style={{width:'60%',color:'white',marginVertical:10,textAlign:'center'}}>Share it with your friends to show your profile !</Text>
                        {
                            capturing? 
                            <View style={{padding:10,width:'80%',flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                                <ActivityIndicator size={'small'} color='white' />
                                <Text style={{color:'white',fontSize:16,marginLeft:10}}>Sharing...</Text>
                            </View>
                            :
                            <TouchableOpacity onPress={openShareDialogAsync} style={{padding:8,paddingHorizontal:12,borderRadius:5,marginVertical:10,backgroundColor:Colors.primary,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                                <Entypo name="share" size={20} color="white" />
                                <Text style={{color:'white',fontSize:16,marginHorizontal:10}}>Share</Text>
                            </TouchableOpacity>
                        
                        }
                        
                    
                    <Image source={playWiseLogo} style={{height:20,width:200,marginTop:20}}/>
                    </View>
                </View>
            </View>

            <View>
                <ShareCard/>
            </View>
           
       
        </View>

    )
}

const styles = StyleSheet.create({
    container:{
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.6,
        overflow:'hidden'
    },

    card:{
        backgroundColor:'white',
        width: '100%',
        height: '100%',
        overflow:'hidden',
        borderRadius:8,
        borderWidth:2,
        borderColor:Colors.primary,
      
    },
    cardBG:{
        width:'100%',
        height:'100%',
        position:'absolute',
    },
    bodyWrapper:{
        flex:1,
        width:'100%',
        height:'100%',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(0,0,0,0.5)',
    }
})