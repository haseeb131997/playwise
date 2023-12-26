
import React, { useCallback,useEffect ,useState} from 'react';
import { Alert, Linking, TouchableOpacity,StyleSheet  } from 'react-native';
import {  envConfig } from "../envConfig";
import {makeRedirectUri, ResponseType } from 'expo-auth-session';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { ApiCollection } from '../envConfig';
import { setActiveUser } from '../../features/userSlice';
import { useDispatch } from "react-redux";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LoadingModal from '../../components/loadingModal';

const WhatsAppLoginButton = () => {

const navigation = useNavigation();

const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const linkingEvent = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then(url => {
         if (url) { handleDeepLink({url});}
        });
        return () => { 
         linkingEvent.remove();
        };
  }, [handleDeepLink]);
    
    const handleDeepLink = async url => {
      setIsLoading(true);
    const searchParam = url.url.split("?")[1]
    const waId = searchParam.split('/')[1]
    const body={
      "waId":waId,    
    }
   
    await axios
      .post(ApiCollection.authController.whatsAppLogin,body)
      .then((response) => {
        let apiResponse = response.data;
        console.log(response.data,"resp data wp log")
        if (response.success) {
          if (apiResponse.data.isOnBoarding == true) {
            dispatch(setActiveUser({userToken:apiResponse.data.access_token, loggedIn:true,userId:apiResponse.data.id}))
            setIsLoading(false)
            navigation.replace(Routes.drawerStack.drawerTag)
          } else {
            setIsLoading(false)
                  navigation.navigate(Routes.onBoardingStack.userNameScreen,
                    {token:apiResponse.data.access_token,
                      userId:apiResponse.data.id,
                      phone:contact,email:null,
                      loginType:'custum'})
          }
        } else {
          Alert.alert("Login Error", response.message);
          console.log("error", )
        }
      })
      .catch((err) => {

        setIsLoading(false);
        Alert.alert(
          "Login",
          err.response.data.message
            ? err.response.data.message
            : "No Internet connection !"
        );
        console.log(err.response);
      });
  
    };

const handlePress = useCallback(async () => {
const url = 'https://playwise.authlink.me?redirectUri=playwiseotpless://otpless';
// console.log(apiResponse,"resp data wp log")
const supported = await Linking.canOpenURL(url);
if (supported) {
await Linking.openURL(url);
} else {
Alert.alert(`Don't know how to open this URL: ${url}`);
}
}, []);

return (
  <>
      {/* <LoadingModal modalVisible={isLoading}/> */}
<TouchableOpacity
          onPress={handlePress}
          style={styles.socialLoginButton}
        >
          <MaterialCommunityIcons name="whatsapp" size={24} color="white" />
        </TouchableOpacity>
  </>
);
};

const styles = StyleSheet.create({
  socialLoginButton:{
      margin:3,
      backgroundColor:'green',
      padding:10,
      borderRadius:50,
      width:50,
      height:50,
      justifyContent:'center',
      alignItems:'center',
      margin:10,
    }
})

export default WhatsAppLoginButton;