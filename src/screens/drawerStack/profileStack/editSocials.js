import React,{useState} from "react";
import { View,Text, StyleSheet,TextInput,ActivityIndicator, Alert } from "react-native";
import { Colors } from "../../../utils/colors";
import OnBoardTemplate from "../../../components/onBoardingTemplate";
import { Routes } from "../../../utils/routes";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import axios from "axios";
import { UserToken } from "../../../app/useStore";
import { ApiCollection } from "../../../configs/envConfig";
import LoadingModal from "../../../components/loadingModal";

export default function EditSocialScreen({route,navigation}){

    const token = UserToken()

    const links = route.params.links

    const linkFiller=(social)=>{
        const thisSocial = links.filter((link)=>link.website==social)
        if(thisSocial.length>0){
            
            return thisSocial[0].link
        }else{
            return ''
        }
    }

    const [facebook,setFacebook] = useState(linkFiller('facebook'))
    const [discord,setDiscord] = useState(linkFiller('discord'))
    const [instagram,setInstagram] = useState(linkFiller('instagram'))
    const [youtube,setYoutube] = useState(linkFiller('youtube'))
    const [linkedin,setLinkedin] = useState(linkFiller('linkedin'))
    const [modalVisible, setModalVisible] = useState(false);


    const onContinue = async() => {
        if(facebook=='' && discord=='' && instagram=='' && youtube=='' && linkedin==''){
            Alert.alert('Connect Socials','Please fill at least one field')
            return
        }


        setModalVisible(true)
        const socials =[
            {website:"facebook",link:facebook},
            {website:"discord",link:discord},
            {website:"instagram",link:instagram},
            {website:"youtube",link:youtube},
            {website:"linkedin",link:linkedin}
        ]

        const data = {
            "socialLinks":socials,
        }
        

        await axios.put(ApiCollection.userController.editSocial,data,{headers:{'Authorization':'Bearer '+token}})
        .then((response)=>{
            setModalVisible(false)
            Alert.alert('Success','Social Links Updated !')
            navigation.goBack()
        })
        .catch((err)=>{
            setModalVisible(false)
            Alert.alert('Error','Something went wrong !')
        })
        
    }



    return(
        
        <OnBoardTemplate showButton={true} onContinuePress={onContinue} label={'Submit'}>
            <LoadingModal color={Colors.primary} modalVisible={modalVisible} />
           <View style={{width:'85%',marginTop:30}}>
                <View style={{flexDirection:'row',alignItems:'center',width:'100%',marginVertical:5}}>
                    <MaterialCommunityIcons name="facebook" color={Colors.primary} size={30}/> 
                    <TextInput style={styles.input} value={facebook} onChangeText={(text)=>setFacebook(text)} placeholder="Facebook profile" placeholderTextColor={'#DBD8C2'}/>
                </View>

                <View style={{flexDirection:'row',alignItems:'center',width:'100%',marginVertical:5}}>
                    <MaterialCommunityIcons name="discord" color={Colors.primary} size={30}/>
                    <TextInput style={styles.input} value={discord} onChangeText={(text)=>setDiscord(text)} placeholder="Discord profile" placeholderTextColor={'#DBD8C2'}/>
                </View>

                <View style={{flexDirection:'row',alignItems:'center',width:'100%',marginVertical:5}}>
                    <MaterialCommunityIcons name="youtube" color={Colors.primary} size={30}/>
                    <TextInput style={styles.input} value={youtube} onChangeText={(text)=>setYoutube(text)} placeholder="Youtube profile" placeholderTextColor={'#DBD8C2'}/>
                </View>

                <View style={{flexDirection:'row',alignItems:'center',width:'100%',marginVertical:5}}>
                    <MaterialCommunityIcons name="instagram" color={Colors.primary} size={30}/>
                    <TextInput style={styles.input} value={instagram} onChangeText={(text)=>setInstagram(text)} placeholder="Instagram profile" placeholderTextColor={'#DBD8C2'}/>
                </View>

                <View style={{flexDirection:'row',alignItems:'center',width:'100%',marginVertical:5}}>
                    <MaterialCommunityIcons name="linkedin" color={Colors.primary} size={30}/>
                    <TextInput style={styles.input} value={linkedin} onChangeText={(text)=>setLinkedin(text)} placeholder="Linkedin profile" placeholderTextColor={'#DBD8C2'}/>
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

