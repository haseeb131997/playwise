import React,{useState} from "react";
import { View,Text,TextInput,StyleSheet,TouchableOpacity,Alert } from "react-native";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import axios from "axios";
import { DarkModeStatus, UserToken } from "../../../app/useStore";
import { ApiCollection } from "../../../configs/envConfig";
import LoadingModal from "../../../components/loadingModal";
import { Routes } from "../../../utils/routes";


export default function UpdateEmailScreen({navigation}) {

   const mode = DarkModeStatus();

   const token = UserToken()

    const [ mail,setMail] = useState("")
    const [isLoading,setIsLoading] = useState(false);
 
    const submit = async() => {
      if(mail.trim()==""){
         Alert.alert("Email","Please fill all the fields")
         return
      }

      setIsLoading(true)
      await axios.put(ApiCollection.userController.editMail,{"email":mail,},{headers:{'Authorization':`Bearer ${token}`}})
         .then(res=>{
            setIsLoading(false)
               Alert.alert("Success","We have sent an email verification link on your mail address !")
                navigation.goBack()
            })
         .catch(err=>{
            setIsLoading(false)
            Alert.alert("Error",err.response.data.message)
         })

    }
 
    return(
     
          <View style={[styles.page,{backgroundColor:mode?getDarkTheme.backgroundColor:getLightTheme.backgroundColor}]}>
            <LoadingModal modalVisible={isLoading}/>
            <Text style={{fontSize:22,fontWeight:'700',marginBottom:20,color:Colors.primary,}}>Update Email address </Text>

 
             <View style={{width:'90%',marginTop:10,alignItems:'center'}}>
                <TextInput style={[ styles.input,{ color: mode ? getDarkTheme.color : getLightTheme.color },]} placeholderTextColor={mode ? "#595957" : "#DBD8C2"} onChangeText={(text)=>setMail(text)}  keyboardType='email-address' placeholder='Enter your new  email address.' />
                <Text style={{  textAlign:'center',color:'grey',width:'100%',marginVertical:10,fontSize:15,lineHeight:22}}>We will send an link to your email adress to verify ! </Text>
            </View>

                <TouchableOpacity onPress={submit} style={[styles.button,{marginVertical:20}]}>
                 <Text style={{textAlign:'center',fontWeight:'500',fontSize:16,color:'white'}}>Submit</Text>
                </TouchableOpacity>
              
         </View>
    )
 }
 
 
 const styles = StyleSheet.create({
    page:{
       flex:1,
       justifyContent:'center',
       alignItems:'center',
       height: '100%',
    },
    input: {
       height: 50,
       margin: 5,
       borderWidth: 1,
       padding: 12,
       borderColor: '#DBD8C2',
       borderRadius: 8,
       width: '95%',
       fontSize: 16,
       color: Colors.primary,
   },
   button:{
    backgroundColor:Colors.primary,
    borderRadius:8,
    padding:15,
    width:'80%',
},
 })
