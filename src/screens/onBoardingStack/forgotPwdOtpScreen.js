import React,{useState,useRef} from "react";
import { View,Text,Image,TextInput,TouchableOpacity,StyleSheet,ScrollView, Alert } from "react-native";
import { Colors } from "../../utils/colors";
import { ApiCollection } from "../../configs/envConfig";
import axios from "axios";
import LoadingModal from "../../components/loadingModal";
import { Routes } from "../../utils/routes";

export default function ForgotPwdOtpScreen({route,navigation}){


    const [otpCode0, setOtpCode0] = useState("")
    const [otpCode1, setOtpCode1] = useState("")
    const [otpCode2, setOtpCode2] = useState("")
    const [otpCode3, setOtpCode3] = useState("")


    const [loading,setLoading] = useState(false);


    const slot0 = useRef();
    const slot1 = useRef();
    const slot2 = useRef();
    const slot3 = useRef();

    const otpHandler = (slot, value) => {
        if (value !== '') {
            switch (slot) {
                case 0:
                    slot1.current.focus()
                    setOtpCode0(value)
                    break;
                case 1:
                    slot2.current.focus()
                    setOtpCode1(value)
                    break;
                case 2:
                    slot3.current.focus()
                    setOtpCode2(value)
                    break;
                case 3:
                    slot3.current.focus()
                    setOtpCode3(value)
                    break;
            
            }
        } else {
            switch (slot) {
                case 0:
                    slot0.current.focus()
                    setOtpCode0(value)
                    break;
                case 1:
                    slot0.current.focus()
                    setOtpCode1(value)
                    break;
                case 2:
                    slot1.current.focus()
                    setOtpCode2(value)
                    break;
                case 3:
                    slot2.current.focus()
                    setOtpCode3(value)
                    break;
            }
        }


    }

    const focusChecker = (prevSlot, prevSlotRef) => {
        if (prevSlot == "") {
            prevSlotRef.current.focus()
        }
    }


    const resendOtp =async ()=>{
        console.log(route.params.contact, 'resend respose')
        setLoading(true)
        await axios.post(ApiCollection.authController.forgetPassword,{"contact":route.params.contact})
        .then(response=>{
            Alert.alert('OTP',`OTP Send sucessfully`)
            setLoading(false)
        })
        .catch(err=>{
            Alert.alert('Resend OTP',`Something went wrong`)
            setLoading(false)
            console.log(err, 'resend otp request')
        })
    }

    const verifyOtp =async ()=>{
        const userContact = route.params.contact;
        setLoading(true)
        console.log(userContact, 'user id respose')
        console.log(`${otpCode0}${otpCode1}${otpCode2}${otpCode3}`, 'veryfyyyyyyyy otpkkk')
        await axios.post(ApiCollection.authController.checkOTP,{"otp":`${otpCode0}${otpCode1}${otpCode2}${otpCode3}`,
         "contact":userContact},)
        .then(response=>{
            //Alert.alert('OTP',`OTP Verified sucessfully`)
            navigation.navigate(Routes.onBoardingStack.resetPasswordScreen,{userId:userContact})
            setLoading(false)
        })
        .catch(err=>{
            console.log(ApiCollection.authController.checkOTP)
            console.log(err.response.data, 'otp api response ')
            Alert.alert('OTP',`Worng OTP`)
            setLoading(false)
        })
    }
    return(
        <ScrollView contentContainerStyle={{ flex: 1,justifyContent:'center',alignItems:'center',backgroundColor:'white' }} keyboardShouldPersistTaps='handled'>
             <LoadingModal modalVisible={loading}/>
     

            <Text style={{fontWeight:'700',fontSize:22,marginBottom:15}}>Phone or Email verification</Text>
            <Text style={{color:'grey',fontSize:16,width:'80%',textAlign:'center',marginBottom:30}}>We Will send you a one time password to <Text style={{fontWeight:'500',color:'black'}}>{route.params.contact}</Text></Text>


            <View style={{ width: '80%', marginBottom: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TextInput textContentType='oneTimeCode' autoComplete='sms-otp' ref={slot0} style={styles.input} maxLength={1} value={otpCode0} onChangeText={(value) => otpHandler(0, value)} keyboardType='numeric' />
                <TextInput textContentType='oneTimeCode' autoComplete='sms-otp' ref={slot1} onFocus={() => focusChecker(otpCode0, slot0)} style={styles.input} maxLength={1} value={otpCode1} onChangeText={(value) => otpHandler(1, value)} keyboardType='numeric' />
                <TextInput textContentType='oneTimeCode' autoComplete='sms-otp' ref={slot2} onFocus={() => focusChecker(otpCode1, slot1)} style={styles.input} maxLength={1} value={otpCode2} onChangeText={(value) => otpHandler(2, value)} keyboardType='numeric' />
                <TextInput textContentType='oneTimeCode' autoComplete='sms-otp' ref={slot3} onFocus={() => focusChecker(otpCode2, slot2)} style={styles.input} maxLength={1} value={otpCode3} onChangeText={(value) => otpHandler(3, value)} keyboardType='numeric' />
            </View>
            <TouchableOpacity style={[styles.button,{marginVertical:20}]} onPress={verifyOtp}>
                <Text style={{textAlign:'center',fontWeight:'500',fontSize:16,color:'white'}}>Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={resendOtp}>
                <Text style={{ color: Colors.primary, fontSize: 16 }}>Resend OTP</Text>
            </TouchableOpacity>
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
        height: 55,
        margin: 5,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 8,
        width: 55,
        fontSize: 22,
        color: Colors.primary,
        backgroundColor: 'transparent',
        marginTop: 50,
        textAlign: 'center'
    },
    button:{
        backgroundColor:Colors.primary,
        borderRadius:8,
        padding:15,
        width:'80%',
    },
    socialLoginButton:{
        margin:3,
        backgroundColor:'transparent',
     
        justifyContent:'center',
        alignItems:'center',
        margin:10,
      }
})