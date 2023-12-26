import React,{useState} from "react";
import { View,Text, StyleSheet,TextInput,TouchableOpacity, Alert } from "react-native";
import { Colors } from "../../utils/colors";
import OnBoardTemplate from '../../components/onBoardingTemplate'
import { Routes } from "../../utils/routes";
import CustomTextInput from "../../components/textInput";

export default function ReferalScreen({route,navigation}){

    const [refCode,setRefCode] = useState("")


    const onContinue = () => {
        if(refCode.trim()!==''){
                let data = route.params.data
                data.refCode = refCode
                navigation.navigate(Routes.onBoardingStack.phoneScreen,{token:route.params.token,userId:route.params.userId,data:data,phoneNumber:route.params.phoneNumber})
        }else{
            Alert.alert('Personal Info',"Please enter referral code")
        }
    }

    const skipStep=()=>{
        let data = route.params.data
        navigation.navigate(Routes.onBoardingStack.phoneScreen,{token:route.params.token,userId:route.params.userId,data:data,phoneNumber:route.params.phoneNumber})
    }


    return(
        
        <OnBoardTemplate showButton={true} onContinuePress={onContinue}>

            <View style={{justifyContent:'center',alignItems:'center',marginTop:20,width:'85%'}}>
                <CustomTextInput  label='Referral Code' onChangeText={(text)=>setRefCode(text)} placeholder="Enter your referral code "/>
            </View>

            <TouchableOpacity onPress={skipStep} style={{margin:20}}>
                <Text>Skip this step !</Text>
            </TouchableOpacity>

              
        </OnBoardTemplate>
    )
}
