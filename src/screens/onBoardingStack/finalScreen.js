import React,{useState,useEffect} from "react";
import { View,Text,Image, Dimensions, Alert } from "react-native";
import OnBoardTemplate from "../../components/onBoardingTemplate";
import LoadingModal from "../../components/loadingModal";
import { Colors } from "../../utils/colors";
import logo from '../../../assets/logo/icon.png';
import axios from "axios";
import { ApiCollection } from "../../configs/envConfig";
import { Routes } from "../../utils/routes";
import { useDispatch } from "react-redux";
import { setActiveUser } from "../../features/userSlice";
import CustomButton from "../../components/customButtons";


export default function FinalizeScreen({route,navigation}){

    useEffect(()=>{
       finalizeProfile()
    },[])

    const [modalVisible, setModalVisible] = useState(true);
    const [modalTask, setModalTask] = useState('Finalizing profile !')
    const dispatch = useDispatch();



    const finalizeProfile=async()=>{
        setModalTask('Finalizing profile !')
        setModalVisible(true)

        let data = route.params.data

        await axios.post(ApiCollection.userController.addUserDetails,data,{headers:{'Authorization':'Bearer '+route.params.token}})
        .then((response)=>{
            setModalVisible(false)
            dispatch(setActiveUser({ userToken: route.params.token,userId:route.params.userId, loggedIn: true }));
            navigation.replace(Routes.drawerStack.drawerTag)
        })
        .catch((err)=>{
            console.log(data);
            const errMsg = err.response.data.message?err.response.data.message:'Something went wrong !';
            console.log(err.response.data);
            Alert.alert('Error', errMsg)
            setModalVisible(false)
        })
    }

    return(
       <OnBoardTemplate onContinuePress={finalizeProfile}>
            <LoadingModal color={Colors.primary} task={modalTask} modalVisible={modalVisible} />
            <View style={{ flexDirection: 'column', height: Dimensions.get('screen').height*0.8, width: '95%', justifyContent: 'center', alignItems: 'center' }}>
                <Image source={logo} style={{width:120,height:120}}/>
                <Text style={{ marginVertical: 20, fontSize: 25 }}>Almost There !</Text>
                <Text style={{ textAlign: 'center', width: '70%', color: Colors.primary }}>Profile building completed, Let's hit continue and Get Started !</Text>
                <CustomButton onPress={finalizeProfile} type='primary' label={'Continue'} />
            </View>
       </OnBoardTemplate>
    )
}

