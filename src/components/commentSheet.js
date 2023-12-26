import React,{useState,useEffect} from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import { Text,FlatList,View,ActivityIndicator,Image,StyleSheet,TextInput } from "react-native";
import { Colors } from "../utils/colors";
import axios from "axios";
import { ApiCollection } from "../configs/envConfig";
import { UserToken,UserId } from "../app/useStore";
import { DefaultDisplay } from "./exceptionHolders";
import LoadingModal from "./loadingModal";
import { color } from "react-native-reanimated";

export const CommentSheet = React.forwardRef((props, ref) => {

    useEffect(()=>
    {
        getComments()
    },[])

    const postId = props.postId;

    const [comments, setComment] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [isModalLoading, setIsModalLoading] = useState(false);
    const [modalTask, setModalTask] = useState("Loading...");

    const [commentInput,setCommentInput] = useState('')
    const [addingComment,setAddingComment] = useState(false)
    const [selectedComment,setSelectedComment] = useState(null)
    const [commetForReport,setCommetForReport] = useState(null)

    const [page, setPage] = useState(1);

    const token = UserToken();

    const getComments = async () => {
        axios.get(`${ApiCollection.postController.getPostComments}/${postId}/?page=${page}`,{headers:{Authorization:`Bearer ${token}`}})
        .then(res=>{setComment(res.data.comments);  setIsLoading(false)})
        .catch(err=>{setIsLoading(false)})
    }

    const _renderComments = ({item})=>{

        return(
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>openUserProfile(item.userId._id)}>
                    <Image style={{width:35,height:35,borderRadius:5}} source={{uri:`${item.userId.profilePic?item.userId.profilePic:""}`}}/>
                </TouchableOpacity>
            
                <View  style={{marginLeft:10,flex:3,}}>
                    <TouchableOpacity style={{marginBottom:5}} onPress={()=>openUserProfile(item.userId._id)}>
                        <Text style={{fontSize:14,fontWeight:'700',color:Colors.primary}}>{item.userId.username}</Text>
                    </TouchableOpacity>
                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',width:'100%',flexWrap:'wrap'}}>
                        {
                            item.comment.split(" ").map((word,index)=>{
                                if(word.split("@").length>1){
                                    return(
                                        <TouchableOpacity key={index} onPress={()=>openUserDetailsByName(word.split("@")[1])}>
                                            <Text style={{fontSize:14,fontWeight:'700',color:Colors.primary}}>{`${word} `}</Text>
                                        </TouchableOpacity>
                                    )
                                }else{
                                    return(
                                        <Text key={index} style={{fontSize:14}}>{`${word} `}</Text>
                                    )
                                }
                            })
                        }
                    </View>
                 
                    {/* <Text style={{fontSize:15,marginTop:2}}>{item.comment}</Text> */}
                

                    <View style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:15,marginRight:10}}>
                      <Text style={{color:'grey',marginRight:10}}>{moment(item.createdAt).fromNow()} | </Text>
                      
                       {item.userId._id!==currentUserId &&
                        <TouchableOpacity onPress={()=>{setCommetForReport(item._id);BottomSheetRef.current.open()}} style={{marginRight:10}}>
                            <Text style={{color:'grey'}}>Report</Text>
                        </TouchableOpacity>
                       }

                    {item.userId._id==currentUserId &&
                        <>
                             <TouchableOpacity onPress={()=> {setSelectedComment(item);setCommentInput(item.comment)}} style={{marginRight:10}}>
                                <Text style={{color:'grey'}}>Edit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={()=>showDeleteAlert(item._id)} style={{marginRight:10}}>
                                <Text style={{color:'grey'}}>Delete</Text>
                            </TouchableOpacity>
                        </>  
                    }
                        
                    </View>
                </View>

                <BottomSheet ref={BottomSheetRef} heading={'Reason'}>

                    <TouchableOpacity onPress={()=>reportComment('Nudity')} style={{ padding: 5, width: '100%', paddingVertical: 10, }}>
                    <Text style={{ fontSize: 16 }}>Nudity</Text>
                    </TouchableOpacity>
    
                    <TouchableOpacity onPress={()=>reportComment('Harrasment')} style={{ padding: 5, width: '100%', paddingVertical: 10, }}>
                    <Text style={{ fontSize: 16 }}>Harrasment</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>reportComment('Voilence')} style={{ padding: 5, width: '100%', paddingVertical: 10, }}>
                    <Text style={{ fontSize: 16 }}>Voilence</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>reportComment('Other')} style={{ padding: 5, width: '100%', paddingVertical: 10, }}>
                    <Text style={{ fontSize: 16 }}>Other</Text>
                    </TouchableOpacity>
            </BottomSheet>

        </View>
        )
    }

    
    return(
    
        <RBSheet
            ref={ref} closeOnDragDown={true} closeOnPressMask={props.closeOnPressMask? props.closeOnPressMask :true}
            height={props.height ? props.height : 300} animationType={'fade'} dragFromTopOnly
            customStyles={{
            container: { padding: 10, borderTopRightRadius: 10, borderTopLeftRadius: 10 },
            draggableIcon: { backgroundColor: Colors.primary }
            }}>

        <Text style={{ padding: 5, fontSize: 18, fontWeight: 'bold', color: Colors.primary, }}>Comments</Text>

        <View style={styles.page}>
            <LoadingModal modalVisible={isModalLoading} task={modalTask}/>
            {
                !isLoading?
                    comments!=null ?
                    <>
                    <FlatList 
                        contentContainerStyle={{paddingBottom:20}}
                        data={comments} renderItem={ _renderComments}/>

                        <View style={{width:'100%'}}>
                            {
                                selectedComment!==null &&
                                <View style={{width:'100%',padding:10,backgroundColor:'whitesmoke',borderTopColor:'lightgrey',borderTopWidth:1,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                     <Text>Editng comment - {selectedComment.comment}</Text>
                                     <TouchableOpacity onPress={()=>{setSelectedComment(null);setCommentInput("")}}>
                                        <Entypo name="cross" size={20} color={Colors.primary} />
                                     </TouchableOpacity>
                                 
                                </View>
                            }

                            <View style={styles.commentInputHolder}>
                                <TextInput multiline={true} value={commentInput} onChangeText={(text)=>setCommentInput(text)} placeholder="Your commenttt" style={styles.input}/>
                            
                            {!addingComment?
                                    <TouchableOpacity disabled={commentInput.trim()==""} onPress={handleSubmittion} style={{marginLeft:2}}>
                                        <MaterialCommunityIcons name="send-circle" size={40} color={commentInput.trim()==""?"lightgrey": Colors.primary} />
                                    </TouchableOpacity>
                                :
                                    <ActivityIndicator size="small" color={Colors.primary} />
                            }

                            </View>
                            
                        </View>
                    </>
                    :
                    <DefaultDisplay showIcon={false}  title='Post Unavialable !'/>
                :
                <Loading/>
            }
            
        </View>

        </RBSheet>
    )

})

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#fff',

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
        width:'85%',
        padding:5,
        fontSize:16,
        height:50
    },
    commentInputHolder:{
        width:'100%',
        padding:6,
        flexDirection:'row',
        borderWidth:0.5,
        borderColor:'lightgrey',
        alignItems:'center',
      
    }
})