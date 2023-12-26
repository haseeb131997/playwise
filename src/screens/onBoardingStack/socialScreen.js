import React,{useState} from "react";
import { View,Text, StyleSheet,TextInput,ActivityIndicator, Alert } from "react-native";
import { Colors } from "../../utils/colors";
import OnBoardTemplate from '../../components/onBoardingTemplate'
import { Routes } from "../../utils/routes";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export default function SocialScreen({route,navigation}){

    const [facebook,setFacebook] = useState("")
    const [discord,setDiscord] = useState("")
    const [instagram,setInstagram] = useState("")
    const [youtube,setYoutube] = useState("")
    const [linkedin,setLinkedin] = useState("")


    const onContinue = () => {

        let data = route.params.data
        const socials =[
            {website:"facebook",link:facebook},
            {website:"discord",link:discord},
            {website:"instagram",link:instagram},
            {website:"youtube",link:youtube},
            {website:"linkedin",link:linkedin}
        ]
        data.socialLinks = socials

        navigation.navigate(Routes.onBoardingStack.finalScreen,{token:route.params.token,userId:route.params.userId,data:data})
        
    }



    return(
        
        <OnBoardTemplate showButton={true} onContinuePress={onContinue}>

           <View style={{width:'85%',marginTop:30}}>
                <View style={{flexDirection:'row',alignItems:'center',width:'100%',marginVertical:5}}>
                    <MaterialCommunityIcons name="facebook" color={Colors.primary} size={30}/> 
                    <View style={styles.input}>
                        <TextInput onChangeText={(text)=>setFacebook(text)} placeholder="Facebook profile" placeholderTextColor={'#DBD8C2'}/>
                    </View> 
                </View>

                <View style={{flexDirection:'row',alignItems:'center',width:'100%',marginVertical:5}}>
                    <MaterialCommunityIcons name="discord" color={Colors.primary} size={30}/>
                    <View style={styles.input}>
                        <TextInput onChangeText={(text)=>setDiscord(text)} placeholder="Discord profile" placeholderTextColor={'#DBD8C2'}/>
                    </View> 
                </View>

                <View style={{flexDirection:'row',alignItems:'center',width:'100%',marginVertical:5}}>
                    <MaterialCommunityIcons name="youtube" color={Colors.primary} size={30}/>
                    <View style={styles.input}>
                        <TextInput onChangeText={(text)=>setYoutube(text)} placeholder="Youtube profile" placeholderTextColor={'#DBD8C2'}/>
                    </View> 
                </View>

                <View style={{flexDirection:'row',alignItems:'center',width:'100%',marginVertical:5}}>
                    <MaterialCommunityIcons name="instagram" color={Colors.primary} size={30}/>
                    <View style={styles.input}>
                        <TextInput onChangeText={(text)=>setInstagram(text)} placeholder="Instagram profile" placeholderTextColor={'#DBD8C2'}/>
                    </View> 
                </View>

                <View style={{flexDirection:'row',alignItems:'center',width:'100%',marginVertical:5}}>
                    <MaterialCommunityIcons name="linkedin" color={Colors.primary} size={30}/>
                    <View style={styles.input}>
                        <TextInput onChangeText={(text)=>setLinkedin(text)} placeholder="Linkedin profile" placeholderTextColor={'#DBD8C2'}/>
                    </View> 
                </View>

            </View>
          
        </OnBoardTemplate>
    )
}

const styles = StyleSheet.create({

    input: {
        height: 50,
        margin: 5,
        marginLeft:10,
        borderWidth: 1,
        padding: 12,
        borderColor: '#DBD8C2',
        borderRadius: 8,
        width: '85%',
        flexDirection:'row',
        justifyContent:"space-between",
        backgroundColor: 'white',
    },
})

