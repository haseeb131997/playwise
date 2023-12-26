import React,{useEffect,useState,createRef} from "react";
import {View,Text,StyleSheet,Dimensions,ActivityIndicator,FlatList,Image, TouchableOpacity, TextInput, Alert, ScrollView} from 'react-native';
import PostCard from "../../../components/postCard";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import { Routes } from "../../../utils/routes";
import IonIcons from '@expo/vector-icons/Ionicons'
import axios from "axios";
import { ApiCollection } from "../../../configs/envConfig";
import { UserToken,UserId, DarkModeStatus } from "../../../app/useStore";
import moment from 'moment'
import LoadingModal from '../../../components/loadingModal'
import Entypo from '@expo/vector-icons/Entypo'
import { BottomSheet } from "../../../components/BottomSheet";
import { DefaultDisplay, Loading } from "../../../components/exceptionHolders";
import { showCutomizedToast } from "../../../components/customToast";
import MentionsTextInput from 'react-native-mentions';

export default function EditPostScreen({route,navigation}) {

    useEffect(()=>{
        getPostDetails()
    },[])

    const mode = DarkModeStatus();

    const BottomSheetRef = createRef()

    const postId = route.params.postId
    const token = UserToken()
    const currentUserId = UserId()

    const [postData, setPostData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [caption, setCaption] = useState('')

    const [isModalLoading, setIsModalLoading] = useState(false);
    const [modalTask, setModalTask] = useState("Loading...");

    const [userList,setUserList] = useState([])

    const fields={headers:{Authorization:`Bearer ${token}`}}

    const getPostDetails = async()=>{
        console.log(postId)
        setIsLoading(true)
        await axios.get(`${ApiCollection.postController.getPostById}/${postId}`,fields)
        .then(res=>{
            if(res.data.success){
                console.log(res.data.post)
                setPostData(res.data.post)
                setCaption(res.data.post.caption)
                setIsLoading(false)
            }
            
        })
        .catch(err=>{
            console.log(err)
            setPostData(null)
            setIsLoading(false)
        })
    }


    const handleEditPost = async()=>{
        if(caption.trim()==""){
            Alert.alert("Caption is required")
            return
        }
        setIsModalLoading(true)
        setModalTask("Updating...")
        await axios.put(`${ApiCollection.postController.editPost}/${postId}`,{"caption":caption},fields)
        .then(res=>{
            if(res.data.success){
                setIsModalLoading(false)
                showCutomizedToast("Post updated successfully",'success')
                navigation.goBack()
            }
        })
        .catch(err=>{
            setIsModalLoading(false)
            Alert.alert('Edit Post',"Soemthing went wrong")
        })
    }

    const deletePostHandler=(postId)=>{
        setPostData(postData.filter(post=>post._id!==postId))
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
            <TouchableOpacity onPress={userPress} style={[styles.contactSlab,mode &&{ borderColor:'transparent',}]} >
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Image source={{uri:item.profilePic}} style={{width:30,height:30,borderRadius:50}}/>
                    <View style={{marginLeft:10,}}>
                        <Text  style={[{fontSize:14,height:20,},mode &&{color:'white'}]}>{item.username}</Text>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:12,height:15,marginTop:2,width:'100%',color:'grey'}}>{item.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
      }
        

  

    return (
        <View style={{flex:1,backgroundColor:mode?getDarkTheme.backgroundColor:getLightTheme.backgroundColor}}>
            <LoadingModal modalVisible={isModalLoading} task={modalTask}/>
            {
                !isLoading?
                    postData!=null ?
                    <ScrollView contentContainerStyle={{justifyContent:'center',alignItems:'center',marginTop:10,paddingBottom:50}}>
                            <PostCard 
                            post={postData}
                             views={postData.views}
                             captionInput={
                                <View style={{width:Dimensions.get('screen').width*0.9,justifyContent:'center',alignItems:'flex-start',paddingLeft:10}}>
                                    <MentionsTextInput
                                        textInputStyle={{...styles.input,color:mode?'white':'black'}}
                                        suggestionsPanelStyle={ userList.length!==0 && { backgroundColor:mode?getDarkTheme.backgroundColor :'white',marginBottom:20 ,height:400}}
                                        loadingComponent={() => userList.length!==0 && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /></View>}
                                        textInputMinHeight={100}
                                        textInputMaxHeight={200}
                                        trigger={'@'}
                                        placeholder={'Share something'}
                                        placeholderColor={"grey"}
                                        triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
                                        value={caption}
                                        onChangeText={(text)=>{setCaption(text)}}
                                        triggerCallback={(text)=>searchUser(text)}
                                        renderSuggestionsRow={ListingTab}
                                        suggestionsData={userList} // array of objects
                                        keyExtractor={(item, index) => item._id} // this is required when using FlatList
                                        suggestionRowHeight={45}
                                        horizontal={true} // default is true, change the orientation of the list
                                        MaxVisibleRowCount={5} // this is required if horizontal={false}
                                    />
                                    </View>
                                }
                                visibility={postData.visibility}
                                postId={postData._id}
                                caption={""}
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
                                showFollow={false} 
                                showFooter={true}
                                
                                showFullCaption={true}
                                redirectUser={true}
                                onDelete={()=>deletePostHandler(postData._id)}
                            />


                            <TouchableOpacity style={{borderRadius:5,backgroundColor:Colors.primary,marginRight:10,marginTop:20,width:'90%',paddingVertical:5,marginBottom:60}}  onPress={handleEditPost}>
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
        // borderColor:'grey',
        // borderWidth:1,
        borderRadius:8,
        textAlignVertical:'top',
        fontSize:16,
    },
    contactSlab:{
        flexDirection:'row',
        borderWidth:0.5,
        paddingVertical:15,
        marginRight:15,
        borderColor:'whitesmoke',
        borderRadius:5,
        paddingHorizontal:10,
        justifyContent:'space-between',
      },
    userHolder:{
        flexDirection:'row',
        alignItems:'flex-start',
        width:'50%',
    },  
    commentInputHolder:{
        width:'100%',
        padding:6,
        alignItems:'flex-start',
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