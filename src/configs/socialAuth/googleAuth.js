import React,{useState} from 'react';
import * as WebBrowser from 'expo-web-browser';
import { getDatabase, ref, onValue, set, orderByValue, orderByChild, orderByKey, orderByPriority, child, remove,get } from 'firebase/database';
import * as Google from 'expo-auth-session/providers/google';
import AntDesign from '@expo/vector-icons/AntDesign'
import { TouchableOpacity,StyleSheet, Alert } from 'react-native';
import {makeRedirectUri, ResponseType } from 'expo-auth-session';
import LoadingModal from '../../components/loadingModal';
import axios from 'axios';
import { ApiCollection } from '../envConfig';
import { useDispatch } from "react-redux";
import { setActiveUser } from "../../features/userSlice";
import { useNavigation } from "@react-navigation/native";
import {Routes} from '../../utils/routes';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleAuth(){

    const dispatch = useDispatch()
    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false);


    const [request, response, promptAsync] = Google.useAuthRequest({
      //responseType:ResponseType.To,
      //clientId : '892838962059-cgg4t9h3ahogeuekm4c13mnftrm9j7dk.apps.googleusercontent.com',
        //expoClientId: '892838962059-s7oh75r9um5m7h75cda4aae21e9d638p.apps.googleusercontent.com',
        iosClientId: '892838962059-sflgigda8arorpmlt8l1amkm5vu27c1m.apps.googleusercontent.com',
        androidClientId: '892838962059-cgg4t9h3ahogeuekm4c13mnftrm9j7dk.apps.googleusercontent.com',
      },
      { useProxy: false });


    
    
      React.useEffect(() => {
        if (response?.type === 'success') {
          setIsLoading(true);
          const { authentication } = response;
          const accessToken = authentication.accessToken;
            axios.post(ApiCollection.authController.socialLogin,{access_Token:`${accessToken}`,provider:'google'})
            .then(response=>{
              setIsLoading(false)
              const apiResponse = response.data;
                if(apiResponse.success){
                  if(apiResponse.data.isOnBoarding==true){
                    dispatch(setActiveUser({userToken:apiResponse.data.accessToken, loggedIn:true,userId:apiResponse.data.id}))
                    setIsLoading(false)
                    navigation.replace(Routes.drawerStack.drawerTag)
                }else{
                    setIsLoading(false)
                  navigation.navigate(Routes.onBoardingStack.userNameScreen,{token:apiResponse.data.accessToken,userId:apiResponse.data.id,phone:null,email:null,loginType:'social'})
                }
                }else{
                  setIsLoading(false)
                  console.log(response.message)
                    //Alert.alert('Login',response.message)
                }
            }).catch(err=>{
              setIsLoading(false)
              Alert.alert('Google',err.response.data.message) 
            
            })
          }
      }, [response]);


    return(
      <>
      <LoadingModal modalVisible={isLoading}/>
        <TouchableOpacity disabled={!request} onPress={() => {promptAsync();}} style={styles.socialLoginButton}>
            <AntDesign name='google' color={'white'} size={28}/>
        </TouchableOpacity>
      </>
    )
}

const styles = StyleSheet.create({
    socialLoginButton:{
        margin:3,
        backgroundColor:'red',
        padding:10,
        borderRadius:50,
        width:50,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        margin:10,
      }
})