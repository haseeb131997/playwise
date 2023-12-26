import React,{useState} from "react";
import { View,Text,Image,TextInput,TouchableOpacity,Dimensions,StyleSheet,ScrollView, Alert,Appearance } from "react-native";
import {Colors} from "../../utils/colors";
import { Routes } from "../../utils/routes";
import logo from '../../../assets/logo/logo.png';
import Fontisto from '@expo/vector-icons/Fontisto';
import AntDesign from '@expo/vector-icons/AntDesign'
import { ApiCollection, envConfig } from "../../configs/envConfig";
import axios from "axios";
import LoadingModal from "../../components/loadingModal";
import authVector from "../../../assets/vectors/authVector.png";

export default function ResetPasswordScreen({navigation, route}){

    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [passHidden,setPassHidden] = useState(true);
    const [confirmPassHidden,setConfirmPassHidden] = useState(true);
    const [loading,setLoading] = useState(false);



    const updatePassword = async () => {
        const contactDetails = route.params.userId;

        if( password===""  || confirmPassword===""){
            alert("Please fill all the fields");
            return;
        }
        else if(password!==confirmPassword){
            alert("Password and confirm password does not match");
            return;
        } else{
                setLoading(true)
                const body={
                   
                    "password":password,
                    "contact":contactDetails,
                }

                await axios.post(ApiCollection.authController.resetPassword,body)
                    .then((response)=>{
                        setLoading(false)
                        
                            Alert.alert('Reset Password','Password Reset sucessful !')
                            navigation.navigate(Routes.onBoardingStack.loginScreen)
                    })
                    .catch((err)=>{
                        setLoading(false)
                        Alert.alert('Password Reset',`${err.response.data.message?err.response.data.message:'Something went wrong'}`);
                        console.log(err, "reset password")
                        console.log(route.params.userId,"contact")
                        console.log(contactDetails,"contact detailss")
                    })
    
  
            }
    }

    return(
        <ScrollView contentContainerStyle={{ flex: 1 ,backgroundColor:'white'}} keyboardShouldPersistTaps='handled'>
            <LoadingModal modalVisible={loading}/>
            <View style={styles.page}>
                
                <Text style={{fontWeight:'700',fontSize:14,marginTop:30}}>WELCOME TO</Text>
                <Image source={logo} style={{width:'60%',height:30}}/>

                <Text style={{fontWeight:'700',fontSize:22,marginTop:35,marginBottom:8}}>Reset Your Password !</Text>

                <View style={{width:'100%',marginTop:20,justifyContent:'center',alignItems:'center'}}>
                    
                    
                    <View style={[styles.input,{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]}>
                        <TextInput style={{fontSize:16,width:'80%'}} placeholder="Password" secureTextEntry={passHidden} onChangeText={(text)=>setPassword(text)}/>
                        <TouchableOpacity onPress={()=>setPassHidden(!passHidden)}>
                            {
                                passHidden ?
                                <AntDesign name="eyeo" size={22} color="grey" />
                                :
                                <AntDesign name="eye" size={22} color="grey" />
                            }
                           
                        </TouchableOpacity>
                    </View>

                    <Text style={{color:Colors.primary,width:'80%',textAlign:'left',marginVertical:5}}>Password must be minimum 8 letters long, contains atleast 1 Uppercase, 1 Symbol and 1 number !</Text>

                    <View style={[styles.input,{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}]}>
                        <TextInput style={{fontSize:16,width:'80%'}} placeholder="Confirm Passowrd" secureTextEntry={confirmPassHidden}  onChangeText={(text)=>setConfirmPassword(text)}/>
                        <TouchableOpacity onPress={()=>setConfirmPassHidden(!confirmPassHidden)}>
                            {
                                confirmPassHidden ?
                                <AntDesign name="eyeo" size={22} color="grey" />
                                :
                                <AntDesign name="eye" size={22} color="grey" />
                            }
                           
                        </TouchableOpacity>
                    </View>
                 
                    <TouchableOpacity onPress={updatePassword} style={styles.button}>
                        <Text style={{textAlign:'center',fontWeight:'500',fontSize:16,color:'white'}}>Update Passowrd</Text>
                    </TouchableOpacity>
                </View> 

                {Appearance.getColorScheme()==='light'  && 
                    <View style={{width:Dimensions.get('screen').width,height:400,position:'absolute',bottom:10,zIndex:-10,opacity:0.4}}>
                        <Image source={authVector} style={{width:'100%',height:'100%'}}/>
                    </View>
                }
            
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    page:{
        flex:1,
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
    },
    input:{
        marginVertical:10,
        borderColor:'grey',
        borderWidth:1,
        padding:10,
        width:'80%',
        fontSize:16,
        borderRadius:5,
        backgroundColor:'white'
    },
    button:{
        backgroundColor:Colors.primary,
        borderRadius:8,
        padding:15,
        width:'80%',
        ...envConfig.PlatformShadow,
    },
    socialLoginButton:{
        margin:3,
        backgroundColor:'transparent',
     
        justifyContent:'center',
        alignItems:'center',
        margin:10,
      }
})