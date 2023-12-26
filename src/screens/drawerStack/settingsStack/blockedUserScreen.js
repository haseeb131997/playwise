import React,{useEffect,useState} from "react";
import { View,Text,TouchableOpacity,Image ,ActivityIndicator, FlatList,StyleSheet, Dimensions, Alert} from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Colors } from "../../../utils/colors";
import axios from "axios";
import { DarkModeStatus, UserId, UserToken } from "../../../app/useStore";
import { ApiCollection } from "../../../configs/envConfig";
import { Routes } from "../../../utils/routes";
import { useNavigation } from "@react-navigation/native";
import { Loading, NoData, ServerError } from "../../../components/exceptionHolders";
import CustomButton from "../../../components/customButtons";
import { CustomIcon } from "../../../components/customIconPack";
import LoadingModal from "../../../components/loadingModal";

const ListingTab = ({item,type})=>{

    const mode = DarkModeStatus();

    const navigation = useNavigation()
    const token = UserToken()


    const unBlockUser = async () => {
        await axios.patch(`${ApiCollection.userController.unBlockUser}/${item._id}`, {}, { headers: { 'Authorization': 'Bearer ' + token } })
            .then(response => {
                Alert.alert('Un-Block', 'User Unblocked successfully !')
                navigation.goBack()
            })
            .catch(error => {
                Alert.alert("Un-Block", 'Some error occured,please try again later !')
            })
    }



  
    return(
        <TouchableOpacity style={[styles.contactSlab,{backgroundColor:mode?'black':"white",}]} onPress={()=>{navigation.navigate(Routes.tabBarHiddenScreens.playerStack.tag,{userId:item._id,username:item.username})}}>

            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',width:'100%'}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Image source={{uri:item.profilePic}} style={{width:40,height:40,borderRadius:50}}/>
                  <View style={{marginLeft:10}}>
                      <Text style={{fontSize:16, color:mode?"white":"black"}}>{item.username}</Text>
                      <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:12,marginTop:2,width:'100%',color:'grey'}}>{item.name}</Text>
                     
                  </View>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <CustomButton onPress={unBlockUser} style={{marginTop:0,paddingHorizontal:8}} type='outline-small' label='Unblock'/>                 
               </View>
              
              
            </View>
        </TouchableOpacity>
    )
  }


  export default function BlockedUserScreen  ({navigation}) {

    useEffect(()=>{
      getBlockedUsers()
    },[])
    
    const mode = DarkModeStatus();
      const token = UserToken();
      const currentUserId = UserId()
      const [blockedUsers, setBlockedUsers] = useState(null);
      const [loading, setLoading] = useState(true);
  
      const getBlockedUsers = async () => {
          setLoading(true);
          await axios.get(`${ApiCollection.userController.getBlockedUsers}`,{headers:{Authorization:`Bearer ${token}`}})
              .then(res => {
                  setBlockedUsers(res.data.data);
                  setLoading(false);
              })
              .catch(err => {
                  setLoading(false);
              })
  
      }
  
      const renderItem = ({ item }) => {
          return (
              <ListingTab item={item} />
          );
      }
  
  
  
      return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor:mode?"black":"white" }}>
            {!loading ? 
                blockedUsers!=null?
                blockedUsers.length!=0?
  
                  <FlatList data={blockedUsers} renderItem={renderItem}/>
  
                  :
                  <NoData iconName='people' title='No Blocked Users' onRefresh={()=>getBlockedUsers()}/>
                  :
                 <ServerError onRefresh={()=>getBlockedUsers()}/>
                :
                <Loading/>
            }
        </View>
    );
  }
  

  const styles = StyleSheet.create({

    contactSlab:{
      width:Dimensions.get('window').width,
      flexDirection:'row',
      borderWidth:0.5,
      padding:10,
      paddingVertical:15,
      borderColor:'whitesmoke',
      borderRadius:5,
      justifyContent:'space-between'
    }
    })