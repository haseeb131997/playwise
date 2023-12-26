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
import WhatsAppLoginButton from "./../../configs/socialAuth/whatsAppLoginButton";

export default function SignUpScreen({navigation}){

    const [contact,setContact] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [loading,setLoading] = useState(false);
    const [passHidden,setPassHidden] = useState(true);
    const [confirmPassHidden,setConfirmPassHidden] = useState(true);

    const contactIsEmail = (contact) =>{ //Validates the email address
        var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return emailRegex.test(contact);
    }
    
    const contactIsPhone=(contact)=> { //Validates the phone number
        var phoneRegex = /^(\+91-|\+91|0)?\d{10}$/; // Change this regex based on requirement
        return phoneRegex.test(contact);
    }


    const contactType = () =>{ 
        if(contactIsEmail(contact)==false){
            return contactIsPhone(contact) ? 'phone': 'invalid';
        }else return 'email'
    }


    const signUp = async () => {

        if(contact==="" || password===""  || confirmPassword===""){
            alert("Please fill all the fields");
            return;
        }
        else if(password!==confirmPassword){
            alert("Password and confirm password does not match");
            return;
        }

        else{
            if(contactType()=='invalid'){
                Alert.alert('Sign Up','Please enter a valid email or phone number')
                return;
            }else{
                setLoading(true)
                const body={
                    "contact":contact,
                    "password":password,
                    "regBy":"manual",
                }

                await axios.post(ApiCollection.authController.signUp,body)
                    .then((response)=>{
                        setLoading(false)
                        if(contactType()=='email'){
                            Alert.alert('Sign Up','Registeration sucessful ! Please check your email for verification link ( Spam folder also )')
                            navigation.navigate(Routes.onBoardingStack.loginScreen,{email:body.contact})
                        }else if(contactType()=='phone'){
                            navigation.navigate(Routes.onBoardingStack.phoneVerify,{phoneNumber:body.contact});
                        }
                    })
                    .catch((err)=>{
                        setLoading(false)
                        Alert.alert('Sign Up',`${err.response.data.message?err.response.data.message:'Something went wrong'}`);
                    })
    
            }
  
        }
    }

    return(
        <ScrollView contentContainerStyle={{ flex: 1 ,backgroundColor:'white'}} keyboardShouldPersistTaps='handled'>
            <LoadingModal modalVisible={loading}/>
            <View style={styles.page}>
                
                <Text style={{fontWeight:'700',fontSize:14,marginTop:30}}>WELCOME TO</Text>
                <Image source={logo} style={{width:'60%',height:30}}/>
              
                <Text style={{fontWeight:'700',fontSize:22,marginTop:20,marginBottom:8}}>Create Your Account !</Text>
                <Text style={{color:'grey',width:'80%',textAlign:'center'}}>Join the most trusted platform and connect with your gamers community instantly.</Text>

                <View style={{width:'100%',marginTop:20,justifyContent:'center',alignItems:'center'}}>
                    <TextInput style={styles.input} placeholder="Email or Phone Number"  onChangeText={(text)=>setContact(text)}/>

                    
                    
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

                    <Text style={{color:'grey',width:'80%',textAlign:'center',marginVertical:20}}>By Clicking the Register, you are agree to Playwise Terms {'&'} Conditions.</Text>
                 

                    <TouchableOpacity onPress={signUp} style={styles.button}>
                        <Text style={{textAlign:'center',fontWeight:'500',fontSize:16,color:'white'}}>Register</Text>
                    </TouchableOpacity>
                </View>
            

                <TouchableOpacity onPress={()=>navigation.navigate(Routes.onBoardingStack.loginScreen)} style={{marginTop:20}}>
                <Text style={{fontSize:15}}>Already have an account ? <Text style={{color:Colors.primary}}>Login </Text> </Text>
                </TouchableOpacity>  

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