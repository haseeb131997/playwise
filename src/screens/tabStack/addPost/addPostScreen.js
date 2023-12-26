import React,{useEffect,useState} from "react";
import {View,Text,StyleSheet,Dimensions, ScrollView, Image, ActivityIndicator, TouchableOpacity,Alert,Platform} from 'react-native';
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import { ApiCollection } from "../../../configs/envConfig";
import { UserToken,UserId,UserInfo, DarkModeStatus } from "../../../app/useStore";
import LoadingModal from "../../../components/loadingModal";
import { Routes } from "../../../utils/routes";
import IonIcons from '@expo/vector-icons/Ionicons';
import * as Device from 'expo-device';
import CustomButton from "../../../components/customButtons";
import { Loading, ServerError } from "../../../components/exceptionHolders";
import {manipulateAsync,SaveFormat} from "expo-image-manipulator";
import MentionsTextInput from 'react-native-mentions';
import { showCutomizedToast } from "../../../components/customToast";

export default function AddPostScreen({navigation}) {

    useEffect(()=>{
        getMyBasicProfile()
    },[])

    const mode = DarkModeStatus();

    
    const token = UserToken()
    const currentUserId = UserId()
    const userInfo = UserInfo()

    const fields={headers:{Authorization:`Bearer ${token}`}}



    const [myProfile,setMyProfile] = useState(null)
    const [caption, setCaption] = useState('');
    const [media, setMedia] = useState([]);
    const [ isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isPublic,setAccIsPublic] = useState(true)
    const [userList,setUserList] = useState([])


    const getMyBasicProfile = async () => {
        setIsLoading(true)
        await axios.get(`${ApiCollection.userController.getMyBasic}/${currentUserId}/basic`,fields)
        .then(res=>{
            if(res.data.success){
                setMyProfile(res.data.data)
            }
            setIsLoading(false)
        })
        .catch(err=>{
            setIsLoading(false)
        })
    }



    const pickMedia = async () => {
        if(media.length < 10){
        
            let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            videoMaxDuration:30,
            quality: 0.5,
            });
        
            if (!result.cancelled) {
                const imgType = Platform.OS=='android' ? 'jpeg' : 'jpg';
                const compressResult = await manipulateAsync(result.uri, [], { compress: Platform.OS == 'ios' ? 0.2 : 0.5, format: SaveFormat.JPEG });
                const vidType = Platform.OS=='android' ? 'mp4' : 'mov';
                 
                const data = {
                    name: `${Date.now()}`,
                    uri:result.uri,
                    type:`${result.type}/${result.type=='image' ? imgType : vidType}`,
                 }
                setMedia([...media,data])
            }
        }
        else{
            Alert.alert('Create post','Maximum 10 images are allowed')
        }
      };

    const removeMedia=(item)=>{
        let temp = [...media];
        temp.splice(temp.indexOf(item),1);
        setMedia(temp)
    }

    function findUsername(searchText) {
        var regexp = /\B\@\w\w+\b/g
        let result = searchText.match(regexp);
        let resArray = result ? result.map((item)=>item.replace('@','')) : []
        return resArray
    }

    function findHashtags(searchText) {
        var regexp = /\B\#\w\w+\b/g
        let result = searchText.match(regexp);
        return result ? result: []
    }

    const submitPost=async()=>{

        // if(caption=="" || ){
        //     Alert.alert('Post',"Please enter a caption")
        //     return
        // }

        if(caption=="" && media.length==0){
            Alert.alert('Post',"Please add a media or caption")
            return
        }
        
        setModalVisible(true)

        const tagsArray = findHashtags(caption);
        const taggedUsers = findUsername(caption);

        const bodyFormData = new FormData();
        if(media.length > 0){
            media.forEach(slot=>{
                bodyFormData.append("media",slot);
            })
        }

        bodyFormData.append("caption",caption==""?" ":caption);
        bodyFormData.append("mediaType", media.length>0 ? "media":"text");
        bodyFormData.append("visibility",isPublic?'public':`followers`);  
        bodyFormData.append("taggedUsers",taggedUsers.length!==0? `${taggedUsers}`:null);
        bodyFormData.append("tags",`${tagsArray}`);

        let fields={
            responseType: "json", 
            headers: { 
                'content-type': 'multipart/form-data', 
                'accept': 'application/json',
                'Authorization':'Bearer '+token
            },
        }

        await axios.post(ApiCollection.postController.addPost,bodyFormData,fields)
        .then(res=>{
            setModalVisible(false)
            if(res.data.success){
                showCutomizedToast('Post created successfully','success')
                setCaption('')
                setMedia([])
                navigation.navigate(Routes.tabStack.homeStack.tag)
            }
        })
        .catch(err=>{
            setModalVisible(false)
            console.log(err.response.data)
            Alert.alert('Post','Something went wrong')
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
            <TouchableOpacity onPress={userPress} style={[styles.contactSlab,mode &&{ borderColor:'transparent',}]} >
                <View style={{flexDirection:'row',alignItems:'center',backgroundColor:mode?getDarkTheme.backgroundColor:getLightTheme.backgroundColor}}>
                    <Image source={{uri:item.profilePic}} style={{width:40,height:40,borderRadius:50}}/>
                    <View style={{marginLeft:10,}}>
                        <Text  style={{fontSize:16,height:20, color:mode?getDarkTheme.color:getLightTheme.color}}>{item.username}</Text>
                        <Text numberOfLines={1} ellipsizeMode='tail' style={{fontSize:12,height:15,marginTop:2,width:'100%',color:mode?getDarkTheme.color:getLightTheme.color}}>{item.name}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
      }

    return(
        <View style={[styles.page,{backgroundColor:mode?getDarkTheme.backgroundColor:getLightTheme.backgroundColor}]}>
            <LoadingModal modalVisible={isModalVisible} />
            {!isLoading ?
            
            myProfile!=null ?
            <ScrollView contentContainerStyle={{padding:10,justifyContent:'center',alignItems:'center'}}>
               <View style={{width:Dimensions.get('screen').width-20,flexDirection:'row',justifyContent:'space-between'}}>
                    <View style={{flexDirection:'row',padding:20,paddingBottom:10}}>
                        <Image style={{width:50,height:50,borderRadius:50}} source={{uri: userInfo!==null? userInfo.profilePic: myProfile.profilePic}}/>
                        <View style={{marginLeft:10}}>
                            <Text style={{fontSize:20,fontWeight:'bold',color:mode?getDarkTheme.color:getLightTheme.color}}>{userInfo!==null? userInfo.name: myProfile.name}</Text>
                            <Text style={{fontSize:14,fontWeight:'500',color:mode?getDarkTheme.color:getLightTheme.color}}>@{userInfo!==null? userInfo.username: myProfile.username}</Text>
                        </View>
                    </View>
               </View>
               <View style={{width:'100%',marginBottom:20,alignItems:'flex-start',justifyContent:'center'}}>
                        <Text style={styles.heading}>Visibility</Text>
                        <View  style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderColor:Colors.primary,borderWidth:1 ,borderRadius:5,marginTop:5,marginLeft:10}}>
        
                            <TouchableOpacity onPress={()=>setAccIsPublic(true)} style={[{paddingHorizontal:10,paddingVertical:8,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},isPublic && {backgroundColor:Colors.primary}]}>
                                {/* <Text style={{color:isPublic?'white': Colors.primary}}>Public</Text> */}
                                <Entypo name="globe" size={21} color={isPublic?'white':Colors.primary} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={()=>setAccIsPublic(false)} style={[{paddingHorizontal:10,paddingVertical:8,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},isPublic==false && {backgroundColor:Colors.primary}]}>
                                {/* <Text style={{color: isPublic ? Colors.primary:'white'}}>Followers</Text> */}
                               <IonIcons name="people" size={20} color={isPublic ? Colors.primary:'white'} />
                            
                            </TouchableOpacity>
                        </View>
                    </View>
               
            
                
                <View style={{width:Dimensions.get('screen').width-20,justifyContent:'center',alignItems:'center'}}>
                    {/* <TextInput value={caption} onChangeText={(text)=>setCaption(text)} placeholder="Share something" style={[styles.input,media.length!==0 &&{height:150}]} textAlignVertical='top' multiline={true}/> */}
                
                    <MentionsTextInput
                        textInputStyle={{...styles.input, color:mode?getDarkTheme.color:getLightTheme.color}}
                        suggestionsPanelStyle={ userList.length!==0 && { backgroundColor: mode?getDarkTheme.backgroundColor: getLightTheme.backgroundColor,marginBottom:20 ,height:400}}
                        loadingComponent={() => userList.length!==0 && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator /></View>}
                        textInputMinHeight={200}
                        textInputMaxHeight={200}
                        trigger={'@'}
                        placeholder={'Share something'}
                        placeholderTextColor={"grey"}
                        triggerLocation={'new-word-only'} // 'new-word-only', 'anywhere'
                        value={caption}
                        onChangeText={(text)=>setCaption(text)}
                        triggerCallback={(text)=>searchUser(text)}
                        renderSuggestionsRow={ListingTab}
                        suggestionsData={userList} // array of objects
                        keyExtractor={(item, index) => index} // this is required when using FlatList
                        suggestionRowHeight={45}
                        horizontal={true} // default is true, change the orientation of the list
                        MaxVisibleRowCount={5} // this is required if horizontal={false}
                    />
                </View>

                <View style={{width:'100%',flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                    
                    <TouchableOpacity style={styles.button} onPress={pickMedia}>
                        <MaterialIcons name='perm-media' color={Colors.primary} size={20}/>
                        <Text style={{color:Colors.primary,marginLeft:10}}>Add Media</Text>
                    </TouchableOpacity>

                    
                </View>

                <View style={{width:'90%',marginTop:20,flexDirection:'row',justifyContent:'flex-start',alignItems:'center',flexWrap:'wrap'}}>
                    {media.map((item,index)=>(
                        <View key={index} style={{width:100,height:100,marginRight:10,marginBottom:15}}>
                            {
                                item.type &&
                                <Image style={{width:'100%',height:'100%'}} source={{uri:item.uri}}/>
                            }
                            
                            <TouchableOpacity onPress={()=>removeMedia(item)} style={{backgroundColor:'lightgrey',borderRadius:50,padding:2,position:'absolute',top:-10,right:-5}}>
                                <Entypo name='cross' size={20}/>
                            </TouchableOpacity>
                        </View>
                        
                    ))}
                </View>

                <CustomButton onPress={submitPost} type='primary'/>
            </ScrollView>

            :
            <ServerError onRefresh={()=>getMyBasicProfile()}/>
            :
            <Loading/>

            }
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',

    },
    input:{
        height:200,
        width:Dimensions.get('screen').width*0.9,
        color:'black',
        padding:10,
        borderColor:'grey',
        borderWidth:1,
        borderRadius:8,
        textAlignVertical:'top',
        fontSize:16
    },
    heading:{
        fontSize:14,
        fontWeight:'500',
        margin:10,
        color:Colors.primary
    },
    button:{
        padding:8,
        paddingHorizontal:10,
        borderRadius:5,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        borderColor:Colors.primary,
        borderWidth:1,
        margin:10

    },
    bigButton:{
        backgroundColor:Colors.primary,
        borderRadius:8,
        padding:15,
        marginTop:30,
        width:'90%',
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
      }
})