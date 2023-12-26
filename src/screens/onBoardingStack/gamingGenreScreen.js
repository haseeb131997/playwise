import React,{useState} from "react";
import { View,Text, StyleSheet,ScrollView,Dimensions,TouchableOpacity, Alert } from "react-native";
import { Colors } from "../../utils/colors";
import OnBoardTemplate from '../../components/onBoardingTemplate'
import CustomButton from "../../components/customButtons";
import { Routes } from "../../utils/routes";

export default function GamingGenreScreen({route,navigation}){


    const [selectedGen, setSelectedInt] = useState([])
    const [selectedMobile, setSelectedMobile] = useState([])
    const [selectedPC, setSelectedPC] = useState([])


    const [gamingTags,setGamingTags] = useState([
        {name:"Action"},
        {name:"Adventure"},
        {name:"Arcade"},
        {name:"Board"},
        {name:"Card"},
        {name:"Casual"},
        {name:"Shooting"},
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


    const selectHandlerGen =(interest)=>{
        let tempGen = [...selectedGen];
        if( tempGen.indexOf(interest) === -1){
            tempGen.push(interest)
            setSelectedInt(tempGen)
        }else{
            tempGen.splice(tempGen.indexOf(interest),1)
            setSelectedInt(tempGen)
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

    const nameFetcher=(array)=>{
        let temp = []
        if(array.length>0){
            array.map((item,index)=>{
                temp.push(item.name)
            })
        }
        return temp
    }


    const onContinue = () => {
        let data = route.params.data

        if(selectedGen.length>4){

            const gameData = {
                gamingGenre:nameFetcher(selectedGen),
                mobileGames:nameFetcher(selectedMobile),
                pcGames:nameFetcher(selectedPC)
            }
    

            data.gamingGenre = gameData.gamingGenre
            data.mobileGames = gameData.mobileGames
            data.pcGames = gameData.pcGames


            navigation.navigate(Routes.onBoardingStack.socialScreen,{token:route.params.token,userId:route.params.userId,data:data})
        }else{
            Alert.alert('Gaming Genres','Select atleast 5 gaming genre')
        }


        
      
    }


    return(
        
        <OnBoardTemplate onContinuePress={onContinue}>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{width:Dimensions.get('window').width,alignItems:'center',paddingBottom:50}}>
                <Text style={{width:'90%',textAlign:'left',paddingVertical:5,marginTop:20,color:Colors.primary}}>Gaming Genres</Text>
                
                <View style={{width:'90%',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',flexWrap:'wrap'}}>
               
                {gamingTags!==null && gamingTags.map((game,index)=>(
                    <TouchableOpacity onPress={()=>selectHandlerGen(game)} key={index} style={[styles.intSelect, selectedGen.includes(game) && {backgroundColor:Colors.primary} ]}>
                        <Text style={{color: selectedGen.includes(game)? 'white': 'black'}}>{game.name}</Text>
                    </TouchableOpacity>
                ))}
                </View>

                <Text style={{width:'90%',textAlign:'left',paddingVertical:5,marginTop:20,color:Colors.primary}}>Mobile Games</Text>
                <View style={{width:'90%',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',flexWrap:'wrap'}}>
               
                {mobileGames!==null && mobileGames.map((game,index)=>(
                    <TouchableOpacity onPress={()=>selectHandlerMobile(game)} key={index} style={[styles.intSelect, selectedMobile.includes(game) && {backgroundColor:Colors.primary} ]}>
                        <Text style={{color: selectedMobile.includes(game)? 'white': 'black'}}>{game.name}</Text>
                    </TouchableOpacity>
                    ))}

                </View>

                <Text style={{width:'90%',textAlign:'left',paddingVertical:5,marginTop:20,color:Colors.primary}}>PC Games</Text>
                <View style={{width:'90%',flexDirection:'row',justifyContent:'flex-start',alignItems:'flex-start',flexWrap:'wrap'}}>
               
                {pcGames!==null && pcGames.map((game,index)=>(
                    <TouchableOpacity onPress={()=>selectHandlerPC(game)} key={index} style={[styles.intSelect, selectedPC.includes(game) && {backgroundColor:Colors.primary} ]}>
                        <Text style={{color: selectedPC.includes(game)? 'white': 'black'}}>{game.name}</Text>
                    </TouchableOpacity>
                ))}

                </View>


                <CustomButton type='primary' style={{width:'90%',marginVertical:20}}  label={'Continue'} onPress={onContinue}/>

            </ScrollView>


        </OnBoardTemplate>
    )
}

const styles = StyleSheet.create({

    intSelect:{
        marginTop:10,
        padding:8,
        paddingHorizontal:20,
        borderColor:Colors.primary,
        borderWidth:1,
        borderRadius:50,
        marginRight:8,
    },

})

