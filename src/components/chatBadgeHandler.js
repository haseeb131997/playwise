import React,{useState,useEffect} from "react";
import { View,Text,StyleSheet,TouchableOpacity,Image, FlatList, Dimensions,ActivityIndicator } from "react-native";
import { getDatabase, ref, onValue, set, orderByValue, orderByChild, orderByKey, orderByPriority, child, remove } from 'firebase/database';
import { UserId,UserToken,UserChat } from "../app/useStore";
import { Routes } from "../utils/routes";
import IonIcons from '@expo/vector-icons/Ionicons'
import { useNavigation } from "@react-navigation/native";


export default function ChatBadge(props){

    useEffect(()=>{
        getChatListing()
    },[])

    const [showBadge, setShowBadge] = useState(false)
    const userId = UserId()

    const navigation = useNavigation()

    const db = getDatabase();

    const getChatListing= async() => {
        const reference = ref(db,'chats/');
        onValue(reference, (snapshot) => {
        let firebaseChats=[]
        let show = false
        if(snapshot.val()){
            const values = Object.values(snapshot.val())
            values.forEach((chatObject,index) => {
                chatObject.members.forEach((member,index) => {
                    if(member.id==userId){
                        if(member.readLatest==false){
                            setShowBadge(true) 
                        }else{
                            setShowBadge(false)
                        }
                    }
                })
            })
        }

        });


      }


    return(
        <TouchableOpacity onPress={()=>navigation.navigate(Routes.tabBarHiddenScreens.chatStack.tag)}>
            {showBadge && <View style={{borderRadius:50,padding:6,backgroundColor:'white',position:'absolute',top:-2,right:-2}}></View>}
            <IonIcons name="md-chatbubble-ellipses-outline" size={22} style={{marginLeft:15}} color={'white'} />
        </TouchableOpacity>
    )
}