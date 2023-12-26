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
import * as AppleAuthentication from 'expo-apple-authentication';

export default function AppleAuth(){

    const dispatch = useDispatch()
    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false);


    const appleLogin = async () => {
        try {
            setIsLoading(true);
            await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            }).then((response)=>{

                axios.post(ApiCollection.authController.socialLogin,{access_Token: response ,provider:'apple'})
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
                            Alert.alert('Login',response.message)
                        }
                })
                .catch(err=>{
                    setIsLoading(false)
                    Alert.alert('Apple',err.response.data.message) 
                  })
            })
            .catch((error) => {
                setIsLoading(false)
                Alert.alert('Apple',error.response.data.message) 
            })
          } catch (e) {

            if (e.code === 'ERR_CANCELED') {
              Alert.alert('Apple Login','User cancelled the Apple Sign in.');
            } else {
                Alert.alert('Apple Login','Something went wrong.');
            }
          }
    }


    return(
      <>
      <LoadingModal modalVisible={isLoading}/>
        <TouchableOpacity onPress={appleLogin} style={styles.socialLoginButton}>
            <AntDesign name='apple1' color={'white'} size={26}/>
        </TouchableOpacity>
      </>
    )
}

const styles = StyleSheet.create({
    socialLoginButton:{
        margin:3,
        backgroundColor:'black',
        padding:10,
        borderRadius:50,
        width:50,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        margin:10,
      }
})