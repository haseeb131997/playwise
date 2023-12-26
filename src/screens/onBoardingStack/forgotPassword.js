import React,{ useRef, useState} from "react";
import { View,Text,Image,Dimensions,TextInput,TouchableOpacity,StyleSheet,ScrollView,Alert,Appearance,Pressable } from "react-native";
import {Colors} from "../../utils/colors";
import logo from '../../../assets/logo/logo.png';
import { envConfig } from "../../configs/envConfig";
import axios from "axios";
import { ApiCollection } from "../../configs/envConfig";
import { Routes } from "../../utils/routes";
import LoadingModal from "../../components/loadingModal";
import authVector from "../../../assets/vectors/authVector.png";
import Checkbox from "expo-checkbox";
import PhoneInput from "react-native-phone-number-input";

export default function ForgotPasswordScreen({navigation}){
    const [email, setEmail] = useState(false);
    const [phone, setPhone] = useState(false);
    const [contact,setContact] = useState("");
    const [loading,setLoading] = useState(false);
    const phoneInput = useRef(null);
    const buttonPress = () => {
    Alert.alert(contact);
  };

    const contactIsEmail = (contact) =>{ //Validates the email address
        var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return emailRegex.test(contact);
    }
    
    const contactIsPhone=(contact)=> { //Validates the phone number
        var phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/; // Change this regex based on requirement
        return phoneRegex.test(contact);
    }

    const contactType = () =>{ 
        if(contactIsEmail(contact)==false){
            return contactIsPhone(contact) ? 'phone': 'invalid';
        }else return 'email'
    }
    const submit = async () => {

        if(contact===""){
            alert("Please enter your Email or Phone Number");
            return;
        }  
        else{
            if(contactType()=='invalid'){
                Alert.alert('Forget Password','Please enter a valid email or phone number')
                return;
            }else{
                setLoading(true)
                const body={
                    "contact":contact,    
                }

                await axios.post(ApiCollection.authController.forgetPassword,body)
                    .then((response)=>{
                        setLoading(false)
                        if(contactType()=='email'){
                            Alert.alert('Forget Password','OTP sent sucessful ! Please check your email for OTP ( Spam folder also )')
                            navigation.navigate(Routes.onBoardingStack.forgotPwdOtpScreen,{contact:body.contact})
                        }else if(contactType()=='phone'){
                            navigation.navigate(Routes.onBoardingStack.forgotPwdOtpScreen,{contact:body.contact});
                        }
                    })
                    .catch((err)=>{
                        setLoading(false)
                        Alert.alert('Reset Password',`${err.response.data.message?err.response.data.message:'Something went wrong'}`);
                        console.log(err, "Error otp")
                    })
    
            }
  
        }
    }

    const onClickBox = ()=>{
        if (email){
            setPhone(false);
        }
        else if (phone){
            setEmail(false);
        }
    }


    return(
        <ScrollView contentContainerStyle={{ flex: 1 }} keyboardShouldPersistTaps='handled'>
        <LoadingModal modalVisible={loading}/>
        <View style={styles.page}>
            
            <Image source={logo} style={{width:'70%',height:40}}/>
            <Text style={{fontWeight:'700',fontSize:22,marginTop:45,marginBottom:15}}>Forgot Password ?</Text>
            <Text style={{color:'grey',width:'80%',textAlign:'center',marginBottom:20}}>Don't worry! It happens. Please enter the registered email or mobile number associated with your account.</Text>
            <Text>Please Choose either email or phone</Text>
           <View style={{marginLeft:-60,justifyContent:"center"}}>
           <View style={styles.checkboxContainer}>
             <Checkbox
               value={email}
               onValueChange={email?() => setEmail(false): ()=> [setEmail(true), setPhone(false)]}
               style={styles.checkbox}
             />
             <Text>Email</Text>
          </View>
          <View style={styles.checkboxContainer1}>
            <Checkbox
               value={phone}
               onValueChange={phone ?() => setPhone(false) : () =>[setPhone(true), setEmail(false)]}
               style={styles.checkbox}
            />
            <Text>Phone</Text>
           </View>
           </View>
            
          {email?
             <TextInput style={styles.input} placeholder="Email Id"  onChangeText={(text)=>setContact(text)}/>
          
           : <View style={styles.container}>
           <PhoneInput
             ref={phoneInput}
             defaultValue={contact}
             defaultCode="IN"
             layout="first"
             withShadow
             autoFocus
             containerStyle={styles.phoneContainer}
             textContainerStyle={styles.textInput}
             onChangeFormattedText={text => {
                setContact(text);
             }}
           />
         </View>
          }  
            
            <TouchableOpacity onPress={submit} style={[styles.button,{marginVertical:20}]}>
                <Text style={{textAlign:'center',fontWeight:'500',fontSize:16,color:'white'}}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>navigation.goBack()}>
                <Text style={{ color: Colors.primary, fontSize: 16 }}>Back to Login</Text>
            </TouchableOpacity>
            {
                Appearance.getColorScheme()==='light'  && 
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
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white'
    },
    input:{
        padding:10,
        width:'80%',
        fontSize:16,
        borderRadius:3,
        backgroundColor:'white',
        justifyContent: 'center',
        alignItems: 'center',
        elevation:8,
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
      },
      checkboxContainer: {
        flexDirection: 'row',
        marginBottom: 4,
        marginTop:10,
        // justifyContent:'center',
        alignItems:'center',
      },
      checkboxContainer1: {
        flexDirection: 'row',
        marginBottom: 20,
        // justifyContent:'center',
        alignItems:'center',
      },
      checkbox: {
        margin:5,
        borderRadius:10
      },
      container: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      phoneContainer: {
        width: '80%',
        height: 50,
      },
      textInput: {
        paddingVertical: 0,
      },
})