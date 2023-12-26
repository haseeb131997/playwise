import React,{useEffect, useState} from "react";
import { View,Text, StyleSheet,ScrollView,Dimensions,TouchableOpacity, Alert } from "react-native";
import { DarkModeStatus, UserToken } from "../../../app/useStore";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import LoadingModal from "../../../components/loadingModal";
import { ApiCollection } from "../../../configs/envConfig";
import axios from "axios";


export default function EditPrefrenceScreen(){

    useEffect(()=>{
        getPref()
    },[])

    const mode = DarkModeStatus();

    const token = UserToken()

    const [isLoading,setIsLoading] = useState(false);

    const [selectedGen, setSelectedGen] = useState([])
    const [selectedMobile, setSelectedMobile] = useState([])
    const [selectedPC, setSelectedPC] = useState([])


    const [pcGames,setPCGames] = useState([
        {name:"PUBG"},
        {name:"Call of Duty – Warzone"},
        {name:"Dota Series"},
        {name:"Apex legends"},
        {name:"Fortnite"},
        {name:"FIFA"},
        {name:"CS GO"},
        {name:"Valorant"},
        {name:"Call of Duty 4"},
        {name:"Battlefeild"}
    ])


    const getPref = async()=>{
        setIsLoading(true)
        await axios.get(ApiCollection.userController.getMyProfile,{headers:{"Authorization":`Bearer ${token}`}})
            .then(response=>{
                setIsLoading(false)
                let myPcGames = response.data.data.pcGames
                let myMobileGames = response.data.data.mobileGames
                let myGamingGenre = response.data.data.gamingGenre

                setSelectedGen(myGamingGenre)
                setSelectedPC(myPcGames)
                setSelectedMobile(myMobileGames)

            })
            .catch(err=>{
                setIsLoading(false)
                Alert.alert('Session Expired','Please login again to continue')
                //logoutAndClear()
  
            })
    }



    const [gamingTags,setGamingTags] = useState([
        {name:"Action"},
        {name:"Adventure"},
        {name:"Arcade"},
        {name:"Board"},
        {name:"Card"},
        {name:"Casual"},
        {name:"Shooting"},
        {name:"Sports"},
        {name:"Strategy"},
        {name:"Other"}

    ])

    const [mobileGames,setMobileGames] = useState([
        {name:"BGMI"},
        {name:"Call of Duty Mobile"},
        {name:"Free Fire"},
        {name:"Apex legends"},
        {name:"Clash of clans"},
        {name:"Arena of valor"},
        {name:"Clash Royal"},
        {name:"Sports"},
        {name:"Heartstone"},
        {name:"Mobile Legends"}
    ])




    const selectHandlerGen =(interest)=>{
        let tempGen = [...selectedGen];
        if( tempGen.indexOf(interest) === -1){
            tempGen.push(interest)
            setSelectedGen(tempGen)
        }else{
            tempGen.splice(tempGen.indexOf(interest),1)
            setSelectedGen(tempGen)
        }
        
    }

    const selectHandlerMobile =(interest)=>{
        let tempMobile = [...selectedMobile];
        if( tempMobile.indexOf(interest) === -1){
            tempMobile.push(interest)
            setSelectedMobile(tempMobile)
        }else{
            tempMobile.splice(tempMobile.indexOf(interest),1)
            setSelectedMobile(tempMobile)
        }
        
    }

    const selectHandlerPC =(interest)=>{
        let temp = [...selectedPC];
        if( temp.indexOf(interest) === -1){
            temp.push(interest)
            setSelectedPC(temp)
        }else{
            temp.splice(temp.indexOf(interest),1)
            setSelectedPC(temp)
        }
        
    }


    const Submit=async()=>{
        const data = {
            gamingGenre:selectedGen,
            mobileGames:selectedMobile,
            pcGames:selectedPC
        }

        setIsLoading(true)

        await axios.put(ApiCollection.userController.editPref,data,{headers:{'Authorization':`Bearer ${token}`}})
            .then(res=>{
                setIsLoading(false)
                Alert.alert("Success","Your preferences have been updated")
            })
            .catch(err=>{
                setIsLoading(false)
                Alert.alert("Error","Something went wrong")
            })

    }


    return(
        
        <View style={[styles.page,{ backgroundColor: mode?getDarkTheme.backgroundColor:getLightTheme.backgroundColor}]}>
            <LoadingModal modalVisible={isLoading}/>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{width:Dimensions.get('window').width,alignItems:'center',paddingBottom:50}}>
                <Text style={{width:'90%',textAlign:'left',paddingVertical:5,marginTop:20,color:Colors.primary}}>Gaming Genres</Text>
                <View style={{width:'90%',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',flexWrap:'wrap'}}>
               
                {
                    gamingTags!==null &&
                        gamingTags.map((game,index)=>(
                            <TouchableOpacity onPress={()=>selectHandlerGen(game.name)} key={index} style={[styles.intSelect, selectedGen.includes(game.name) && {backgroundColor:Colors.primary} ]}>
                                <Text style={{color: selectedGen.includes(game.name)? 'white': mode?'grey':"black"}}>{game.name}</Text>
                            </TouchableOpacity>
                        ))
                }

                </View>

                <Text style={{width:'90%',textAlign:'left',paddingVertical:5,marginTop:20,color:Colors.primary}}>Mobile Games</Text>
                <View style={{width:'90%',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',flexWrap:'wrap'}}>
               
                {
                    mobileGames!==null &&
                        mobileGames.map((game,index)=>(
                            <TouchableOpacity onPress={()=>selectHandlerMobile(game.name)} key={index} style={[styles.intSelect, selectedMobile.includes(game.name) && {backgroundColor:Colors.primary} ]}>
                                <Text style={{color: selectedMobile.includes(game.name)? 'white': mode?'grey':"black"}}>{game.name}</Text>
                            </TouchableOpacity>
                        ))
                }

                </View>

                <Text style={{width:'90%',textAlign:'left',paddingVertical:5,marginTop:20,color:Colors.primary}}>PC Games</Text>
                <View style={{width:'90%',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',flexWrap:'wrap'}}>
               
                {
                    pcGames!==null &&
                        pcGames.map((game,index)=>(
                            <TouchableOpacity onPress={()=>selectHandlerPC(game.name)} key={index} style={[styles.intSelect, selectedPC.includes(game.name) && {backgroundColor:Colors.primary} ]}>
                                <Text style={{color: selectedPC.includes(game.name)? 'white': mode?'grey':"black"}}>{game.name}</Text>
                            </TouchableOpacity>
                        ))
                }

                </View>

                <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity onPress={Submit} style={styles.bigButton} >
                        <Text style={{textAlign:'center',fontWeight:'500',fontSize:16,color:'white'}}>Submit</Text>
                    </TouchableOpacity>
                </View>


            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },

    intSelect:{
        marginTop:10,
        padding:8,
        paddingHorizontal:20,
        borderColor:Colors.primary,
        borderWidth:1,
        borderRadius:50,
        marginRight:8,
    },

    bigButton:{
        backgroundColor:Colors.primary,
        borderRadius:8,
        padding:15,
        marginTop:30,
        width:'90%',

    },

})

