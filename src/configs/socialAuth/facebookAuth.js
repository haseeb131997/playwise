import React,{useState} from 'react';
import { useNavigation } from "@react-navigation/native";
import Fontisto from '@expo/vector-icons/Fontisto';
import { TouchableOpacity,StyleSheet, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import LoadingModal from '../../components/loadingModal';
import axios from 'axios';
import { ApiCollection } from '../envConfig';
import {Routes} from '../../utils/routes'
import { useDispatch } from "react-redux";
import { setActiveUser } from "../../features/userSlice";

WebBrowser.maybeCompleteAuthSession();

export default function FacebookAuth(){

  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

      const [request, response, promptAsync] = Facebook.useAuthRequest({
        //responseType: ResponseType.Token,
        clientId: '424874046375107',
        //scopes: ['public_profile', 'email'],
      },
      { useProxy: false });


      React.useEffect(() => {
        if (response?.type === 'success') {
          setIsLoading(true);
          const accessToken = response.authentication.accessToken;

          axios.post(ApiCollection.authController.socialLogin,{ access_Token:accessToken,provider:'facebook'})
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
                Alert.alert('Login',response.message)
            }
          }).catch(err=>{ 
            Alert.alert('Facebook',err.response.data.message) ;
            setIsLoading(false)})

        }
      }, [response]);


    //{expoClientId: '424874046375107'}
    //{ iosClientId: '424874046375107' }
    //{ androidClientId: '424874046375107' }

    return(
      <>
      <LoadingModal modalVisible={isLoading}/>
        <TouchableOpacity disabled={!request} style={styles.socialLoginButton}
        onPress={() => {
            promptAsync();
          }}
        >
             <Fontisto name='facebook' color={'white'} size={25}/>
        </TouchableOpacity>
      </>
    )
}

const styles = StyleSheet.create({
    socialLoginButton:{
        margin:3,
        backgroundColor:'blue',
        padding:10,
        borderRadius:50,
        width:50,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        margin:10,
      }
})