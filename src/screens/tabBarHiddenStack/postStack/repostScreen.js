import React,{useEffect,useState,createRef} from "react";
import {View,Text,StyleSheet,RefreshControl,ActivityIndicator,FlatList,Image, TouchableOpacity, TextInput, Alert, ScrollView, Dimensions} from 'react-native';
import PostCard from "../../../components/postCard";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import { Routes } from "../../../utils/routes";
import IonIcons from '@expo/vector-icons/Ionicons'
import axios from "axios";
import { ApiCollection } from "../../../configs/envConfig";
import { UserToken,UserId, UserInfo, DarkModeStatus } from "../../../app/useStore";
import moment from 'moment'
import LoadingModal from '../../../components/loadingModal'
import Entypo from '@expo/vector-icons/Entypo'
import { BottomSheet } from "../../../components/BottomSheet";
import { DefaultDisplay, Loading } from "../../../components/exceptionHolders";
import { showCutomizedToast } from "../../../components/customToast";
import MentionsTextInput from 'react-native-mentions';

export default function RePostScreen({route,navigation}) {


    useEffect(()=>{
        getPostDetails()

        // navigation.setOptions({
        //     headerRight:()=>(              
        //         <TouchableOpacity style={{borderRadius:5,backgroundColor:Colors.primary,marginRight:10}}  onPress={submitRepost}>
        //             <Text style={{color:'white',padding:10}}>Share</Text>
        //         </TouchableOpacity>  
        //     )
        // })
    },[])


    const mode = DarkModeStatus();

    const postId = route.params.postId
    const token = UserToken()
    const currentUserInfo = UserInfo()
    const currentUserId = UserId()

    const [postData, setPostData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [caption, setCaption] = useState('')

    const [isModalLoading, setIsModalLoading] = useState(false);
    const [userList,setUserList] = useState([])

    let fields={
        responseType: "json", 
        headers: { 
            'content-type': 'multipart/form-data', 
            'accept': 'application/json',
            'Authorization':'Bearer '+token
        },
    }


    const getPostDetails = async()=>{

        setIsLoading(true)
        await axios.get(`${ApiCollection.postController.getPostById}/${postId}`,fields)
        .then(res=>{
            if(res.data.success){
                setPostData(res.data.post)
                setIsLoading(false)
            }
            
        })
        .catch(err=>{
            setPostData(null)
            setIsLoading(false)
        })
    }


    function findHashtags(searchText) {
        var regexp = /\B\#\w\w+\b/g
        let result = searchText.match(regexp);
        return result ? result: []
    }

    function findUsername(searchText) {
        var regexp = /\B\@\w\w+\b/g
        let result = searchText.match(regexp);
        let resArray = result ? result.map((item)=>item.replace('@','')) : []
        return resArray
    }

    const submitRepost=async()=>{

 
  
        setIsModalLoading(true)

        const taggedUsers = findUsername(caption);

        const bodyFormData = new FormData();
        bodyFormData.append("mediaType",'text');
        bodyFormData.append("visibilty",'public');
        bodyFormData.append("tags",`${findHashtags(caption)}`);
        bodyFormData.append("caption",caption);
        bodyFormData.append("parentPost",postId);
        bodyFormData.append("type",'repost');
       bodyFormData.append("taggedUsers",taggedUsers.length!==0? `${taggedUsers}`:null);


        await axios.post(ApiCollection.postController.addPost,bodyFormData,fields)
        .then(res=>{
            if(res.data.success){
                setIsModalLoading(false)
                showCutomizedToast("Reposted successfully",'success')
                navigation.goBack()
            }
        })
        .catch(err=>{
            console.log(err.response.data)
            setIsModalLoading(false)
            if(err?.response?.data?.message){
                showCutomizedToast(`${err?.response?.data?.message}`,'error')
            }else{
                Alert.alert('Error',`${JSON.stringify(err)}`)
            }
           
        })
    }

    const searchUser = async (searchText) => {
        const query = searchText.replace('@', '');
        if(searchText=="@"){
            setUserList([])
            return
        }
        await axios.get(`${ApiCollection.userController.userSearch}?search=${query}`,{headers:{Authorization:`Bearer ${token}`}})
        .then(res=> setUserList(res.data.data))
        .catch(err=> console.log(err))
        
    }

    const ListingTab = ({item})=>{

        const userPress=()=>{
            const lastIndexOfSpace = caption.lastIndexOf(' ')
            const newCaption  = caption.substring(0, lastIndexOfSpace)
            setCaption(newCaption + ` @${item.username} `)
        }

        return(
            <TouchableOpacity onPress={userPress} style={styles.contactSlab} >
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image source={{uri:item.profilePic}} style={{width:40,height:40,borderRadius:50}}/>
                    <View style={{marginLeft:10,}}>
                        <Text  style={{fontSize:16,height:20,color:mode?'white':'black'}}>{item.username}</Text>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:12,height:15,marginTop:2,width:'100%',color:'grey'}}>{item.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
      }
        

  

    return (
        <View style={{flex:1,backgroundColor:mode?getDarkTheme.backgroundColor:getLightTheme.backgroundColor}}>
            <LoadingModal modalVisible={isModalLoading}/>
            {
                !isLoading?
                    postData!=null ?
                    <ScrollView contentContainerStyle={{justifyContent:'center',alignItems:'center',marginTop:10,paddingBottom:50,paddingTop:20, backgroundColor:mode?getDarkTheme.backgroundColor:getLightTheme}}>

                           
                            <View style={[styles.card,{backgroundColor:mode?getDarkTheme.backgroundColor:getLightTheme.backgroundColor}]}>
                                <View style={{width:'100%',marginBottom:10}}>
                                <View activeOpacity={1} style={[styles.userHolder,{padding:15}]}>
                                    <Image style={{resizeMode:'cover',width:45,height:45,borderRadius:50}} source={{uri:currentUserInfo.profilePic}}/>
                                    <View  style={{width:120,paddingHorizontal:10,paddingVertical:5,justifyContent:'center',alignItems:'flex-start'}}>
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:15,fontWeight:'700',color:mode?getDarkTheme.color:getLightTheme.color,width:'100%'}}>{currentUserInfo.username}</Text>
                                        <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:11,color:mode?getDarkTheme.color:getLightTheme.color,paddingTop:2}}>{currentUserInfo.name}</Text>
                                    </View>
                                </View>

                                <View style={{width:Dimensions.get('screen').width,justifyContent:'flex-start',alignItems:'flex-start'}}>
                                        <MentionsTextInput
                                            textInputStyle={{...styles.input,color:mode?getDarkTheme.color:getLightTheme.color}}
                                            suggestionsPanelStyle={ userList.length!==0 && { backgroundColor: 'transparent',marginBottom:20 ,height:400}}
                                            loadingComponent={() => userList.length!==0 && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /></View>}
                                            textInputMinHeight={50}
                                            textInputMaxHeight={200}
                                            trigger={'@'}
                                            placeholder={'Share something'}
                                            placeholderTextColor={"grey"}
                                            triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
                                            value={caption}
                                            onChangeText={(text)=>{setCaption(text)}}
                                            triggerCallback={(text)=>searchUser(text)}
                                            renderSuggestionsRow={ListingTab}
                                            suggestionsData={userList} // array of objects
                                            keyExtractor={(item, index) => index} // this is required when using FlatList
                                            suggestionRowHeight={45}
                                            horizontal={true} // default is true, change the orientation of the list
                                            MaxVisibleRowCount={5} // this is required if horizontal={false}
                                        />
                      

                                
                             
                            </View>
                                </View>
                                      
                                <PostCard 
                                    post={postData}
                                    views={postData.views}
                                    visibility={postData.visibility}
                                    postId={postData._id}
                                    caption={postData.caption}
                                    commentCount={postData.comments}
                                    likeCount={postData.likeCount}
                                    mediaType={postData.mediaType?postData.mediaType: postData.typeOfPost}
                                    media={postData.media}
                                    username={postData.userId.username}
                                    userId={postData.userId._id}
                                    user={postData.userId}
                                    profilePic={postData.userId.profilePic}
                                    createdAt={postData.createdAt}
                                    isLiked={postData.isLiked}
                                    showFollow={true} 
                                    showFooter={true}
                                    showFullCaption={true}
                                    redirectUser={true}
                                    onDelete={null}
                                />

                            </View>

                            <TouchableOpacity style={{borderRadius:5,backgroundColor:Colors.primary,marginRight:10,width:'90%',paddingVertical:5,marginBottom:60}}  onPress={submitRepost}>
                                <Text style={{color:'white',padding:10,fontSize:16,textAlign:'center'}}>Submit</Text>
                            </TouchableOpacity>  
                      

                          
                    </ScrollView>
                    :
                    <DefaultDisplay showIcon={false}  title='Post Unavialable !'/>
                :
                <Loading/>
            }
            
        </View>
    );
}

const styles = StyleSheet.create({
    card:{
        width:Dimensions.get('screen').width-30,
        marginBottom:15,
        borderRadius:10,
        flexDirection:'column',
        borderWidth:0.2,
        borderColor:'lightgrey',
        borderColor:Colors.primary,
        borderWidth:1.5,
        overflow:'hidden',
    },
    contactSlab:{
        flexDirection:'row',
        borderWidth:0.5,
        paddingVertical:15,
        marginRight:15,
        borderColor:'transparent',
        backgroundColor:'transparent',
        borderRadius:5,
        justifyContent:'space-between',
      },
    userHolder:{
        flexDirection:'row',
        alignItems:'flex-start',
        width:'50%',
    },  
  
    header:{
        width:'100%',
        padding:10,
        paddingTop:15,
        flexDirection:'row',
        alignItems:'flex-start',
        justifyContent:'flex-start',

    },
    input:{
        height:200,
        width:Dimensions.get('screen').width*0.9,
        // color:'red',
        padding:10,
        // borderColor:'grey',
        // borderWidth:1,
        borderRadius:8,
        textAlignVertical:'top',
        fontSize:16,
    },
    commentInputHolder:{
        width:'95%',
        padding:6,
        alignItems:'flex-start',
        marginBottom:20
    },
    submit:{
       padding:10,
       paddingHorizontal:20,
       borderRadius:5,
       marginTop:10,
       backgroundColor:Colors.primary,
       flexDirection:'row',
       justifyContent:'flex-start',
       alignItems:'center',
    }
})