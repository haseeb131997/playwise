import React,{useState,useEffect} from "react";
import { View,Text,StyleSheet,TouchableOpacity,Image, FlatList, Dimensions,ActivityIndicator } from "react-native";
import { UserId,UserToken,NewNotification } from "../app/useStore";
import { Routes } from "../utils/routes";
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { ApiCollection } from "../configs/envConfig";
import * as Notifications from 'expo-notifications';
import {useDispatch} from "react-redux";
import {setNewNotification} from "../features/userSlice";


Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });


export default function NotificationBadge(props){

    const dipatch = useDispatch();

    useEffect(() => {
        const subscription = Notifications.addNotificationReceivedListener(notification => {
            setLatestNotification(notification)
        });
        return () => subscription.remove();
    }, []);

    useEffect(()=>{
        notificationListener()
    },[latestNotification])


    const [latestNotification, setLatestNotification] = useState(null)
    const token = UserToken()
    const showBadge = NewNotification()

    const navigation = useNavigation()

    const notificationListener = ()=>{
        axios.get(ApiCollection.notificationController.notificationListener,{headers:{Authorization:`Bearer ${token}`}})
        .then((response)=>{
            if(response.data.data.isNotificationRead==false){
                dipatch(setNewNotification({newNotification:true}))
            }else{
                dipatch(setNewNotification({newNotification:false}))
            }
        })
        .catch((error)=>{
            dipatch(setNewNotification({newNotification:false}))
        })
    }


    return(
    <TouchableOpacity onPress={()=>navigation.navigate(Routes.tabStack.homeStack.notificationScreen)}>
        {showBadge && <View style={{borderRadius:50,padding:6,backgroundColor:'white',position:'absolute',top:-2,right:-2}}></View>}
        <FontAwesome name="bell-o" size={22} style={{marginLeft:15}} color={'white'} />
    </TouchableOpacity>
    )
}