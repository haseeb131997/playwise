import React,{useState} from "react";
import { View,Text, StyleSheet,TextInput,FlatList, Alert, ScrollView, TouchableOpacity, Dimensions ,Image} from "react-native";
import { Colors } from "../../../utils/colors";
import MentionsTextInput from "react-native-mentions";
import { UserInfo ,UserToken,UserId} from "../../../app/useStore";
import { BottomSheet } from "../../../components/BottomSheet";
import axios from "axios";
import { ApiCollection } from "../../../configs/envConfig";
import { Loading,DefaultDisplay,NoData,ServerError } from "../../../components/exceptionHolders";
import IonIcons from '@expo/vector-icons/Ionicons'
import { LinearGradient } from "expo-linear-gradient";
import { CustomIcon } from "../../../components/customIconPack";
import LoadingModal from "../../../components/loadingModal";
import Entypo from '@expo/vector-icons/Entypo'
import { Routes } from "../../../utils/routes";

export default function RegisterTournamentScreen({route,navigation}){

    const tournament = route.params.tournament
    const memberSize = tournament.maxPlayers-1
    const userInfo = UserInfo();
    const token = UserToken();
    const currentUserID = UserId();

    const TeamSize = ()=>{
        let membersCount = []
        const membersAllowed = tournament.maxPlayers - 1
        if(membersAllowed == 0){
            return []
        }else{
            for(let i=0;i<membersAllowed;i++){
                membersCount.push(i)
            }
            return membersCount
        }

    }

    const bottomSheerRef = React.createRef(null);

    const [isLoading,setIsLoading] = useState(false);
    const [leaderName,setLeaderName] = useState('');
    const [leaderGameId,setLeaderGameId] = useState('');
    const [teamName,setTeamName] = useState('');
    const [watsappNumber,setWatsappNumber] = useState('');

    const [result,setResult] = useState(null);

    const [members,setMembers] = useState([])

    const addMember = (member)=>{
        setMembers([...members,member])
        bottomSheerRef.current.close();
    }

    const openBottomSheet = ()=>{
        bottomSheerRef.current.open();
    }

    const ListingTab = ({item})=>{

        const onMemberPress = ()=>{
            const data ={
                name:item.name,
                username:item.username,
                profilePic:item.profilePic,
                id:item._id
            }
            setResult(null)
            addMember(data)
        }

        const selected = members.filter(member=>member.id == item._id).length > 0 ? true : false


        return(
            <TouchableOpacity disabled={selected} style={styles.contactSlab} onPress={onMemberPress} >
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image source={{uri:item.profilePic}} style={{width:40,height:40,borderRadius:50}}/>
                    <View style={{marginLeft:10}}>
                        <Text style={{fontSize:16}}>{item.username}</Text>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:12,marginTop:2,width:'100%',color:'grey'}}>{item.name}</Text>
                    </View>
                </View>
                
                {selected && <IonIcons name="checkmark-circle" size={28} color={Colors.primary} />}
            </TouchableOpacity>
        )
      }

    const searchUser=(query,memberNum)=>{
        setIsLoading(true)
        //setSearch(query)
        axios.get(`${ApiCollection.userController.userSearch}?search=${query}`,{headers:{'Authorization':'Bearer '+token}})
        .then(response=>{
         
           
          const filteredSearch = response.data.data.filter(item=>item._id!==currentUserID && item.username==query)
          if(filteredSearch.length>0){
            let temp = members
            temp[memberNum] = filteredSearch[0]
            setMembers(temp)
            setIsLoading(false)
        }else{
            let temp = members
            temp[memberNum] = {
                name:query,
                error:true,
                msg: query==userInfo.username?"You can't add yourself as member !": 'User not found !'
            }   
            setMembers(temp)
            setIsLoading(false)
            Alert.alert('Add Member','User not found ! Please enter correct playwise username !')
         
        }
        })
        .catch(error=>{
            setIsLoading(false)
        })
      }


      function getUniqueListBy(arr, key) {
        return [...new Map(arr.map(item => [item[key], item])).values()]
    }


    const submit=async()=>{

        if(teamName == ''){
            Alert.alert('Registration','Please enter Team Name')
            return
        }

        if(leaderName =='' || leaderGameId == ''){
            Alert.alert('Registration','Please enter Leader Game Name and Game ID')
            return
        }
        if(members.length < (tournament.maxPlayers-1)){
            Alert.alert('Registration',`Please add ${(tournament.maxPlayers-1)} members`)
            return
        }

        if(members.filter(member=>member.error).length>0){
            Alert.alert('Registration','Please enter valid member usernames')
            return
        }

        const unique = getUniqueListBy(members,'_id')

        if(unique.length<memberSize){
            Alert.alert('Registration','Please remove any duplicate members !')
            return
        }

        

        const memberUsernames = members.map(member=>member.username )

        const body ={
            "players":memberUsernames,
            "leader":{
                "gameName":leaderName,
                "gameID":leaderGameId
            },
            "teamName":teamName,
            "whatsapp" : watsappNumber,
        }
        setIsLoading(true)
        await axios.put(`${ApiCollection.gamesController.registerForTournament}/${tournament._id}/player`,body,{headers:{'Authorization':'Bearer '+token}})
        .then(response=>{
            setIsLoading(false)
            Alert.alert('Registration','Registration Successful, All the details regarding this tournament will be sent to you on your registered mail !')
            navigation.goBack()
        })
        .catch(error=>{
            setIsLoading(false)
            console.log(error.response.data)
            const type = error.response.data.data.type
            try{
                if(type!=='other' || type!=='others'){
                    Alert.alert(
                        "Profile Incomplete",
                        `${type=='email'?error.response.data.message:"Please complete your contact details to register for this tournament"}`,
                        [
                            {
                                text: "Cancel",
                                onPress: null,
                                style: "cancel"
                            },
                            {
                                text: "Update", onPress: () => {
                                    console.log(type)
                                    if(type=='email'){
                                        navigation.navigate(Routes.tabStack.tournamentStack.updateEmailScreen)
                                    }
                                }
                            }
                        ]
                    );
                }else{
                    Alert.alert('Registration',error.response.data.message?error.response.data.message:'Registration Failed')
                }
               
            }catch{
                Alert.alert('Registration','Registration Failed')
            }

            
          
        })

        
    }

    return(
        <View style={{flex:1,backgroundColor:'white'}}>
            <LoadingModal modalVisible={isLoading} />
            <ScrollView horizontal={false} contentContainerStyle={{paddingBottom:80}}>
                <View style={{width:Dimensions.get('window').width,height:230}}>
                    <Image style={{width:'100%',height:'100%',position:'absolute'}} source={{uri:`${tournament.banner}`}}/>
                    <LinearGradient colors={['transparent','rgba(0,0,0,0.2)','rgba(0,0,0,0.9)']} style={{width:'100%',height:'100%', position:'absolute',flexDirection:'row',justifyContent: 'space-between',alignItems:'flex-end' ,padding:10}}>
                        <View>
                            <Text style={{fontSize:18,fontWeight:'700',color:'white'}}>{tournament.eventName}</Text>
                            <Text style={{fontSize:14,color:'white',marginTop:5}}>{tournament.gameName}</Text>
                        </View>
                        <View style={{justifyContent:'center',alignItems:'center',padding:5,marginRight:10,flexDirection:'row'}}>
                            <Text style={{marginRight:10,fontSize:15,color:'white'}}>{tournament.slotsFilled} / {tournament.totalSlots}</Text>
                            <CustomIcon name='people' active={true} size={20}/>
                        </View>
                    
                    </LinearGradient>
                </View>
            
                <View style={{padding:10,paddingTop:20}}>
                    <View style={{width:'100%',marginVertical:5,marginBottom:20}}>
                        <Text style={styles.heading}>Team Name</Text>
                        <TextInput value={teamName} onChangeText={(text)=>setTeamName(text)} placeholder="Your Team Name" style={{paddingVertical:5,fontSize:18,marginTop:10,borderBottomWidth:1,borderBottomColor:'grey',width:'90%'}}/>
                    </View>
                    <View style={{width:'100%',marginVertical:5,marginBottom:20}}>
                        <Text style={styles.heading}>Whatsapp Number</Text>
                        <TextInput value={watsappNumber} onChangeText={(text)=>setWatsappNumber(text)} placeholder="Your Watsapp Number" style={{paddingVertical:5,fontSize:18,marginTop:10,borderBottomWidth:1,borderBottomColor:'grey',width:'90%'}}/>
                    </View>

                    <View style={{width:'100%',marginVertical:5,marginBottom:20}}>
                        <Text style={styles.heading}>Your In-Game Name {` (Leader)`}</Text>
                        <TextInput value={leaderName} onChangeText={(text)=>setLeaderName(text)} placeholder="Your in game name" style={{paddingVertical:5,fontSize:18,marginTop:10,borderBottomWidth:1,borderBottomColor:'grey',width:'90%'}}/>
                    </View>

                    <View style={{width:'100%',marginVertical:5,marginBottom:20}}>
                        <Text style={styles.heading}>Leader In-Game Id {` (Leader)`}</Text>
                        <TextInput value={leaderGameId} onChangeText={(text)=>setLeaderGameId(text)} placeholder="Your in game id" style={{paddingVertical:5,fontSize:18,marginTop:10,borderBottomWidth:1,borderBottomColor:'grey',width:'90%'}}/>
                    </View>

                    {TeamSize().length !== 0 &&
                        TeamSize().map((item,index)=>(
                            <View key={index} style={{width:'100%',marginVertical:5,marginBottom:20}}>
                                <Text style={styles.heading}>Member {index+1}</Text>
                                <View style={{width:'100%',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                                    <TextInput onEndEditing={(e)=>searchUser(e.nativeEvent.text,index)}  placeholder="Member Playwise Username" style={{paddingVertical:5,fontSize:18,marginTop:10,borderBottomWidth:1,borderBottomColor:'grey',width:'90%',marginRight:5}}/>

                                    {members[index] ?
                                        members[index]?.error==true ?
                                            <Entypo name="cross" size={28} color={'red'}/>
                                            :
                                            <IonIcons name="md-checkmark-sharp" size={28} color={'green'}/>
                                        :
                                    <></>
                                    }

                                </View>

                               
                            </View>
                        ))
                    }

                    <Text style={{marginVertical:10,color:'grey'}}>Make sure to update your Email ID and Mobile number in your profile section so you don't miss important information like Room id & Password.</Text>
                    
                    <View style={{width:'100%',justifyContent:'center',alignItems:'center'}}>
                        <TouchableOpacity onPress={submit} style={styles.bigButton} >
                            <Text style={{textAlign:'center',fontWeight:'500',fontSize:16,color:'white'}}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
           
               
            </ScrollView>

            {/* <BottomSheet ref={bottomSheerRef} heading="Select Member" height={Dimensions.get('screen').height*0.8}>   
                <TextInput style={styles.input} placeholder="Search users..."  onChangeText={(text)=>searchUser(text)}/>
                {!loading?
                     result!==null ?
                    result.length>0 ?
                        <FlatList 
                            data={result}
                            renderItem={ListingTab}
                            keyExtractor={(item,index)=>index.toString()}
                            style={{width:'100%'}}
                        />
                        :
                        <DefaultDisplay iconName='search' title={`No results found for "${search}"`}/>
                        :
                        <DefaultDisplay iconName='search' title='Start typing to search users'/>
                    :
                    <Loading/>
        }
           
            </BottomSheet> */}
            
        </View>
    )
}

const styles = StyleSheet.create({
    heading:{
        fontSize:15,
        color:Colors.primary,
        fontWeight:'700',
    },
    bigButton:{
        backgroundColor:Colors.primary,
        borderRadius:8,
        padding:15,
        marginTop:30,
        width:'90%',

    },
    input:{
        marginVertical:15,
        borderColor:'grey',
        borderWidth:1,
        padding:10,
        width:'100%',
        fontSize:16,
        borderRadius:5,
    },
    contactSlab:{
        flexDirection:'row',
        borderWidth:0.5,
        padding:10,
        paddingVertical:15,
        borderColor:'whitesmoke',
        backgroundColor:'white',
        borderRadius:5,
        justifyContent:'space-between',
        alignItems:'center',
      }
})