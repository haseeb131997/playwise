import React,{createRef,useState} from "react";
import { View,Text,StyleSheet,Image, TouchableOpacity,Alert } from "react-native";
import { Colors } from "../../../utils/colors";
import { Routes } from "../../../utils/routes";
import { BottomSheet } from "../../../components/BottomSheet";
import { UserToken } from "../../../app/useStore";
import { ApiCollection } from "../../../configs/envConfig";
import LoadingModal from "../../../components/loadingModal";
import axios from "axios";

export default function ChatSettingScreen({route,navigation}){

    const user = route.params.user
    const OptionsBottomSheetRef = createRef()
    const token = UserToken()

    const [isLoading,setIsLoading] = useState(false)
    const [task,setTask] = useState(false)

    const openUser = (userId) => {
        navigation.navigate(Routes.tabBarHiddenScreens.playerStack.tag,{userId})
    }


    const report=async(reason)=>{
        setTask('Reporting...')
        setIsLoading(true)
        OptionsBottomSheetRef.current.close()

        await axios.post(`${ApiCollection.postController.reportUser}/${user.id}`,{reason:reason},{headers:{'Authorization':'Bearer '+token}})
        .then(response=>{
                Alert.alert('Report',`User reported successfully, our team will review it and take appropriate action`)
                setIsLoading(false)
        })
        .catch(error=>{
            Alert.alert('Error',error.response.data.message? error.response.data.message:`User could not be reported | Something went wrong`)
            setIsLoading(false)
        })
    }

 

    return(
        <View style={style.page}>
            <LoadingModal modalVisible={isLoading} task={task}/>
            <View style={{alignItems:'flex-start',width:'100%',padding:10,}}>
                <Text style={{fontWeight:'bold',fontSize:16,marginTop:10,color:Colors.primary}}>Members</Text>
                <TouchableOpacity onPress={()=>openUser(user.id)} style={{width:'100%',flexDirection:'row',justifyContent:'flex-start',alignItems:'center',marginTop:15}}>
                    <Image source={{uri:user.profilePic}} style={{width:50,height:50,borderRadius:50,borderWidth:2,borderColor:Colors.primary}}/>
                    <View style={{marginLeft:10}}>
                        <Text style={{fontWeight:'bold',fontSize:16}}>{user.name}</Text>
                        <Text style={{color:'grey',marginTop:5}}>{user.username}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{alignItems:'flex-start',width:'100%',padding:10,marginTop:20}}>
                <Text style={{fontWeight:'bold',fontSize:16,marginTop:10,color:Colors.primary}}>Chat Options</Text>
                
                <View style={{width:'100%'}}>
                    <TouchableOpacity style={{paddingTop:15,}}  onPress={()=>OptionsBottomSheetRef.current.open()}>
                        <Text>Report User</Text>
                    </TouchableOpacity>
                </View>
                
                
            </View>

            <BottomSheet  ref={OptionsBottomSheetRef} heading={'Reason for report'}>
                
                    <TouchableOpacity onPress={()=>report('Nudity')} style={{ padding: 5, width: '100%', paddingVertical: 10, }}>
                    <Text style={{ fontSize: 16 }}>Nudity</Text>
                    </TouchableOpacity>
    
                    <TouchableOpacity onPress={()=>report('Harrasment')} style={{ padding: 5, width: '100%', paddingVertical: 10, }}>
                    <Text style={{ fontSize: 16 }}>Harrasment</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>report('Voilence')} style={{ padding: 5, width: '100%', paddingVertical: 10, }}>
                    <Text style={{ fontSize: 16 }}>Voilence</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>report('Other')} style={{ padding: 5, width: '100%', paddingVertical: 10, }}>
                    <Text style={{ fontSize: 16 }}>Other</Text>
                    </TouchableOpacity>
               
            </BottomSheet>
                    
        </View>
    )
}

const style=StyleSheet.create({
    page:{
        flex:1,
        justifyContent:'flex-start',
        alignItems:'center',
        backgroundColor:'white',
    }
})