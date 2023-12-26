import React,{useState} from "react";
import { View,Text, StyleSheet,TextInput,TouchableOpacity, Alert } from "react-native";
import OnBoardTemplate from '../../components/onBoardingTemplate'
import { Routes } from "../../utils/routes";
import CustomTextInput from "../../components/textInput";
import LoadingModal from "../../components/loadingModal";
import axios from "axios";
import { ApiCollection } from "../../configs/envConfig";

export default function PhoneScreen({route,navigation}){

    const [phone,setPhone] = useState("")
    const [loading,setLoading] = useState(false);

    const onContinue = async() => {
        if(route.params.phoneNumber!==null){
            skipStep()
            return
        }
        if(phone.length<10){
            Alert.alert('Personal Info',"Please enter valid phone number")
            return
        }

            setLoading(true)
            await axios.put(ApiCollection.userController.editPhone,{"phone":phone,},{headers:{'Authorization':`Bearer ${route.params.token}`}})
            .then(response=>{
                Alert.alert('OTP',`OTP Send sucessfully`)
                setLoading(false)
                let data = route.params.data
                navigation.navigate(Routes.onBoardingStack.otpScreen,{token:route.params.token,userId:route.params.userId,data:data,contact:phone})
            })
            .catch(err=>{
                Alert.alert('Send OTP',err.response.data.message?err.response.data.message:'Something went wrong')
                setLoading(false)
            })
       
    }

    const skipStep=()=>{
        let data = route.params.data
        navigation.navigate(Routes.onBoardingStack.personalDetails,{token:route.params.token,userId:route.params.userId,data:data})
        //navigation.navigate(Routes.onBoardingStack.personalDetails,{token:route.params.token,userId:route.params.userId,data:data})
    }

 
    return(
        
        <OnBoardTemplate showButton={true} onContinuePress={onContinue}>
            <LoadingModal modalVisible={loading}/>

            <View style={{justifyContent:'center',alignItems:'center',marginTop:20,width:'85%'}}>
                <CustomTextInput editable={route.params.phoneNumber==null}  value={route.params.phoneNumber} maxLength={10} keyboardType='phone-pad' label='Phone Number' onChangeText={(text)=>setPhone(text)} placeholder="Enter phone number"/>
            </View>

            {/* {
                route.params.phoneNumber==null && 
                <TouchableOpacity onPress={skipStep} style={{margin:20}}>
                    <Text>Skip this step !</Text>
                </TouchableOpacity>
            } */}

            
              
        </OnBoardTemplate>
    )
}
