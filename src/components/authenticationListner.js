import React from "react";
import axios from "axios";
import { UserToken } from "../app/useStore";
import { ApiCollection } from "../configs/envConfig";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";


export const AuthenticationListner =  async(token,onInvalidAuth) =>{

    await axios.get(ApiCollection.userController.checkAuthentication,{headers:{ 'Authorization': `Bearer ${token}` }})
        .then(response=>{
            if(response.data.data.isDeactivated==true){
                Alert.alert('Account Deactivated',response.data.message)
                onInvalidAuth()
                return
            }
            if(response.data.data.isAccessTokenValid==false){
                Alert.alert('Session Expired',response.data.message?response.data.message:'Please login again')
                onInvalidAuth()
                return
            }else{
                return
            }
            
        })
        .catch(err=>{
            //Alert.alert('No Internet Connection','Please check your internet connection and try again !')
        })
}