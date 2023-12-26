import React,{useEffect} from 'react';
import { authorize } from 'react-native-app-auth'
import Fontisto from '@expo/vector-icons/Fontisto';
import { TouchableOpacity,StyleSheet, Platform ,Text} from 'react-native';
import {makeRedirectUri, ResponseType } from 'expo-auth-session';
import * as Linking from 'expo-linking';


export default function DiscordAuth(){

  // app id 1013178366716821574

  //gg.playwise.mobile://oauthredirect

  const link = Linking.createURL()
     //https://discord.com/api/oauth2/authorize?client_id=1013178366716821574&redirect_uri=https%3A%2F%2Fauth.expo.io%2F%40suyash-vashishtha%2Fplaywise&response_type=code&scope=email%20identify

      const  _onLoginDiscord=async()=> {
       
    
       let url ;
       if(Platform.OS=='android' || Platform.OS=='ios'){
        url = 'https://discord.com/api/oauth2/authorize?client_id=1013178366716821574&redirect_uri=playwise%3A%2F%2F&response_type=code&scope=identify%20email'
       }else{
        url  = 'https://discord.com/api/oauth2/authorize?client_id=1013178366716821574&redirect_uri=exp%3A%2F%2F192.168.1.5%3A19000&response_type=code&scope=identify%20email'
       }
       Linking.openURL(url);
      }


    return(
        <TouchableOpacity onPress={_onLoginDiscord} style={styles.socialLoginButton}>
             <Fontisto name='discord' color={'#5865F2'} size={30}/>
             <Text>{link}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    socialLoginButton:{
        margin:3,
        backgroundColor:'transparent',
     
        justifyContent:'center',
        alignItems:'center',
        margin:10,
      }
})