import React,{useState} from "react";
import { View,Text,TextInput,StyleSheet,TouchableOpacity,Alert } from "react-native";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import axios from "axios";
import { DarkModeStatus, UserToken } from "../../../app/useStore";
import { ApiCollection } from "../../../configs/envConfig";
import LoadingModal from "../../../components/loadingModal";


export default function ChangePasswordScreen({navigation}) {

   const mode = DarkModeStatus();

   const token = UserToken()

    const [ oldPass,setOldPass] = useState("")
    const [ newPass,setNewPass] = useState("")
    const [ confirmPass,setConfirmPass] = useState("")
    const [isLoading,setIsLoading] = useState(false);
 
    const submit = async() => {

      if(oldPass.trim()=="" || newPass.trim()=="" || confirmPass.trim()==""){
         Alert.alert("Security","Please fill all the fields")
         return
      }

      if(newPass!==confirmPass){
           Alert.alert('Password mismatch',"New password and confirm password does not match")
            return
      }
      setIsLoading(true)
      const data ={
         "password":oldPass,
         "newPassword":newPass,
         "confirmPassword":confirmPass
     }

      await axios.put(ApiCollection.authController.changePassword,data,{headers:{'Authorization':`Bearer ${token}`}})
         .then(res=>{
            setIsLoading(false)
               Alert.alert("Success","Password changed successfully")
               navigation.goBack()
         })
         .catch(err=>{
            setIsLoading(false)
            Alert.alert("Change Password",err.response.data.message)
         })

    }
 
    return(
     
          <View style={[styles.page,{backgroundColor:mode?getDarkTheme.backgroundColor:getLightTheme.backgroundColor}]}>
            <LoadingModal modalVisible={isLoading}/>
            <Text style={{fontSize:22,fontWeight:'700',marginBottom:20,color:Colors.primary,}}>Change password ?</Text>
             <Text style={{  textAlign:'center',width:'90%',marginBottom:30,fontSize:16,lineHeight:22,color:mode?getDarkTheme.color:getLightTheme.color}}>Please enter your Old password and New passowrd </Text>
 
             <View style={{width:'90%',marginTop:10,alignItems:'center',backgroundColor:mode?getDarkTheme.backgroundColor:getLightTheme.backgroundColor}}>
                <TextInput style={[ styles.input,{ color: mode ? getDarkTheme.color : getLightTheme.color },]} placeholderTextColor={mode ? "#595957" : "#DBD8C2"} onChangeText={(text)=>setOldPass(text)} placeholder="Old Password" />
                <Text style={{width:'90%',color:mode?"#757572":'grey',marginBottom:20,}}>Enter "social" in case of Google / Facebook login !</Text>
                <TextInput style={[ styles.input,{ color: mode ? getDarkTheme.color : getLightTheme.color },]} placeholderTextColor={mode ? "#595957" : "#DBD8C2"} onChangeText={(text)=>setNewPass(text)} placeholder="New Password" />
                <TextInput style={[ styles.input,{ color: mode ? getDarkTheme.color : getLightTheme.color },]} placeholderTextColor={mode ? "#595957" : "#DBD8C2"} onChangeText={(text)=>setConfirmPass(text)} placeholder="Confirm New Password"/>
              
                <TouchableOpacity onPress={submit} style={[styles.button,{marginVertical:20}]}>
                <Text style={{textAlign:'center',fontWeight:'500',fontSize:16,color:'white'}}>Submit</Text>
            </TouchableOpacity>
              
          
 
                </View>
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
