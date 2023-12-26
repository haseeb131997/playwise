import React,{useState,useEffect} from "react";
import {View,Text,Image,FlatList,TouchableOpacity,StyleSheet,Dimensions} from 'react-native'
import { ApiCollection } from "../../../configs/envConfig";
import { Colors } from "../../../utils/colors";
import { UserToken,UserId } from "../../../app/useStore";
import axios from "axios";
import { NoData,Loading,ServerError } from "../../../components/exceptionHolders";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "../../../utils/routes";


export default function PostLikesScreen({route,navigation}){

    useEffect(()=>{
        getLikes()
    },[])


    const token = UserToken()
    const currentUserId = UserId()
    const postId = route.params.postId


    const[likes,setLikes] = useState([])
    const [isLoading,setIsLoading] = useState(false)

    const getLikes=async()=>{
        setIsLoading(true)
        await axios.get(`${ApiCollection.postController.getLikes}/${postId}`,{headers:{'Authorization':'Bearer '+token}})
            .then(response=>{
                setIsLoading(false)
                setLikes(response.data.data)
            })
            .catch(err=>{
                setIsLoading(false)
                console.log(err)
                setLikes(null)
            })
    }

    const ListingTab = ({item})=>{

      
        return(
            <TouchableOpacity style={styles.contactSlab} onPress={()=>{navigation.push(Routes.tabBarHiddenScreens.playerStack.tag,{userId:item._id,username:item.username})}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image source={{uri:item.profilePic}} style={{width:40,height:40,borderRadius:50}}/>
                    <View style={{marginLeft:10}}>
                        <Text style={{fontSize:16}}>{item.username}</Text>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:12,marginTop:2,width:'100%',color:'grey'}}>{item.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
      }

    const renderItem = ({ item }) => {
        return (
            <ListingTab item={item}  />
        );
    }




    return(
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            {!isLoading ? 
                likes!=null?
                likes.length!=0?

                  <FlatList data={likes} renderItem={renderItem}/>

                  :
                  <NoData iconName='people' title='No Likes' onRefresh={()=>getLikes()}/>
                :
               <ServerError onRefresh={()=>getLikes()}/>
              :
              <Loading/>
            }
        </View>
    )




}

const styles = StyleSheet.create({

    contactSlab:{
      width:Dimensions.get('window').width,
      flexDirection:'row',
      borderWidth:0.5,
      padding:10,
      paddingVertical:15,
      borderColor:'whitesmoke',
      backgroundColor:'white',
      borderRadius:5,
      justifyContent:'space-between'
    }
    })