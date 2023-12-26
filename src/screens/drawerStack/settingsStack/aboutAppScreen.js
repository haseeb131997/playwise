import React from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image, Linking, Alert } from "react-native";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import PlaywiseLogo from "../../../../assets/logo/icon.png";
import Constants from "expo-constants";
import { Routes } from "../../../utils/routes";
import { envConfig } from "../../../configs/envConfig";
import { DarkModeStatus } from "../../../app/useStore";


export default function AboutAppScreen({ navigation }) {

    const mode = DarkModeStatus();

    const version = Constants.manifest!==null? Constants.manifest.version : Constants.manifest2.version;


    const reportBug = () => {
        let desc = `Please describe the bug you found in the app.`
        Linking.openURL(`mailto:support@playwise.gg?subject=Bug Report in Playwise mobile app&body=${desc}`)
            .catch(err => {
                Alert.alert('Report a bug !','Please send an email to support@playwise.gg, our team get back to you as soon as possible.')
            })
    }

    const ContactUs = () => {
        let desc = `Please describe your query.`
        Linking.openURL(`mailto:support@playwise.gg?subject=Enter Subject&body=${desc}`)
            .catch(err => {
                Alert.alert('Contact Us !','Please send an email to support@playwise.gg, our team get back to you as soon as possible.')
            })
    }



    return (
        <View style={[styles.container,{backgroundColor:mode?getDarkTheme.backgroundColor:getLightTheme.backgroundColor}]}>
            <Image source={PlaywiseLogo} style={{width:120,height:80}} />
            <Text style={{fontSize:22,fontWeight:'bold',color:Colors.primary,marginTop:10}}>Playwise Mobile</Text>
            <Text style={{fontSize:15,color:'grey',marginBottom:10}}>Version - {version}</Text>
            {
                envConfig.env == 'dev' &&
                <Text style={{fontSize:15,color:'grey',marginBottom:30}}>Release Channel - Dev</Text>
            }
            


            <TouchableOpacity onPress={()=>navigation.navigate(Routes.drawerStack.termOfUse)} style={{backgroundColor:Colors.primary,padding:10,width:'50%',justifyContent:'center',alignItems:'center',borderRadius:5,marginVertical:10}}>
                <Text style={{fontSize:15,color:'white'}}>Terms of Service</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>navigation.navigate(Routes.drawerStack.privacyPolicy)} style={{backgroundColor:Colors.primary,padding:10,width:'50%',justifyContent:'center',alignItems:'center',borderRadius:5,marginVertical:10}}>
                <Text style={{fontSize:15,color:'white'}}>Privacy Policy</Text>
            </TouchableOpacity>

              <TouchableOpacity onPress={reportBug} style={{backgroundColor:Colors.primary,padding:10,width:'50%',justifyContent:'center',alignItems:'center',borderRadius:5,marginVertical:10}}>
                <Text style={{fontSize:15,color:'white'}}>Report Bug</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={ContactUs} style={{backgroundColor:Colors.primary,padding:10,width:'50%',justifyContent:'center',alignItems:'center',borderRadius:5,marginVertical:10}}>
                <Text style={{fontSize:15,color:'white'}}>Contact Us</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    }
})