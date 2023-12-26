import React,{useEffect, useState} from "react";
import {View,Text,ScrollView,StyleSheet,Image, TouchableOpacity,Dimensions,ActivityIndicator, Linking, Alert, TextInput} from 'react-native'
import Entypo from '@expo/vector-icons/Entypo';
import {Colors, getDarkTheme, getLightTheme} from "../../../utils/colors";
import { ApiCollection, envConfig } from "../../../configs/envConfig";
import axios from "axios";
import { DarkModeStatus, UserToken } from "../../../app/useStore";
import IonIcons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import * as DocumentPicker from 'expo-document-picker';
import LoadingModal from "../../../components/loadingModal";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function EditWorkScreen({navigation}) {

    const mode = DarkModeStatus();

    const token = UserToken();

    const [profile,setProfile] = useState(null)
    const [isLoading,setIsLoading] = useState(false);
    const [jobTitle,setJobTitle] = useState("");
    const [description ,setDescription] = useState("");
    const [company,setCompany] = useState("");
    const [startDate,setStartDate] = useState(null);
    const [endDate,setEndDate] = useState(null);
    const [working,setWorking] = useState(false);
    const [resume,setResume] = useState(null);

    const [startDatePicker, setStartDatePicker] = useState(false);
    const [endDatePicker, setEndDatePicker] = useState(false);


   const  _pickDocument = async () => {
	    let result = await DocumentPicker.getDocumentAsync({type: '*/*'});
        if(result.type==='success'){
            const data ={
                uri:result.uri,
                type:result.mimeType,
                name: `${Date.now()}.pdf`
            }
            setResume(data);
        }
	}

    const showStartDatePicker = () => {
        setStartDatePicker(true);
       
      };

      const showEndDatePicker = () => {
        setEndDatePicker(true);
       
      };

    
      const hideStartDatePicker = () => {
        setStartDatePicker(false);
      };

      const hideEndDatePicker = () => {
        setEndDatePicker(false);
      };
    
      const handleStartConfirm = (date) => {
        setStartDate(date);
        hideStartDatePicker();
      };

      const handleEndConfirm = (date) => {
        setEndDate(date);
        hideEndDatePicker();
      };

 

      const submit =async()=>{

        if(endDate==null && working==false){
            alert("Please select end date")
            return;
        }
        
        
        if(jobTitle==="" || company==="" || description==""  || startDate==null ){
            Alert.alert('Edit Work Profile',"Please fill all fields")
            return
        }
        const startDateFormatted = new Date(startDate).toISOString().split('T')[0];

        const endDateFormatted = working?startDateFormatted : new Date(endDate).toISOString().split('T')[0];
  
        setIsLoading(true);


        const formData = new FormData();

        if(resume!==null){
            formData.append('resume',resume);
        }

        formData.append('companyName',company);
        formData.append('jobTitle',jobTitle);
        formData.append('description',description);
        formData.append('startDate',`${startDateFormatted}`);
        formData.append('endDate',`${endDateFormatted}`);

        let fields={
            responseType: "json", 
            headers: { 
                'content-type': 'multipart/form-data', 
                'accept': 'application/json',
                'Authorization':'Bearer '+token
            },
        }

        await axios.put(ApiCollection.userController.editWorkProfile,formData,fields)
            .then(response=>{
                setIsLoading(false);
                Alert.alert('Edit Work Profile',"Profile updated successfully")
            })
            .catch(error=>{
                setIsLoading(false);
                Alert.alert('Edit Work Profile',"Something went wrong")
            })

      }

      const dateFormat = (date) => {
        if(date==null){
            return "";
        }
        return new Date(date).toISOString().split('T')[0];
      }


    return(
        <View style={[styles.page,{ backgroundColor: mode?getDarkTheme.backgroundColor:getLightTheme.backgroundColor}]}>
            {/* < modalVisible={isLoading}/> */}
            <ScrollView contentContainerStyle={{alignItems:'center',}} style={styles.scrollStyle}>
                
                <View style={{width:Dimensions.get('window').width,paddingVertical:10,paddingBottom:50}}>
                    <View style={{width:'100%',marginTop:10}}>
                        <Text style={styles.heading}>Job Title</Text>
                        <TextInput value={jobTitle} 
                                   onChangeText={(text)=>setJobTitle(text)}  
                                   style={[ styles.input,{ color: mode ? getDarkTheme.color : getLightTheme.color },]}
                                    placeholderTextColor={mode ? "#595957" : "#DBD8C2"} 
                                    placeholder={"Job Title"}/>
                    </View>

                    <View style={{width:'100%',marginTop:10}}>
                        <Text style={styles.heading}>Company Name</Text>
                        <TextInput value={company} onChangeText={(text)=>setCompany(text)} style={[ styles.input,{ color: mode ? getDarkTheme.color : getLightTheme.color },]}
                                    placeholderTextColor={mode ? "#595957" : "#DBD8C2"}  placeholder={"Company Name"}/>
                    </View>

                    <View style={{width:'100%',marginTop:10}}>
                        <Text style={styles.heading}>Description</Text>
                        <TextInput value={description } multiline={true} onChangeText={(text)=>setDescription(text)}  style={[ styles.input,{ height:100,color: mode ? getDarkTheme.color : getLightTheme.color },]}
                                    placeholderTextColor={mode ? "#595957" : "#DBD8C2"}  textAlignVertical='top' placeholder={"Sales manager at xoxo.."}/>
                    </View>

                    <View style={{width:'100%',marginTop:10}}>
                        <Text style={styles.heading}>Duration</Text>
                        <View style={{width:'80%',alignItems:'flex-start'}}>
                            <TouchableOpacity onPress={showStartDatePicker} style={[startDate==null?styles.smallButtonsEmpty: styles.smallButtonsFilled]} >
                                <Text style={{textAlign:'center',fontWeight:'500',fontSize:14,color:startDate==null?Colors.primary:'white'}}>{startDate==null?"Starting Date":`${dateFormat(startDate)}`}</Text>
                            </TouchableOpacity>

                            {
                                working== false &&
                                <TouchableOpacity onPress={showEndDatePicker} style={[endDate==null?styles.smallButtonsEmpty: styles.smallButtonsFilled]} >
                                    <Text style={{textAlign:'center',fontWeight:'500',fontSize:14,color:endDate==null?Colors.primary:'white'}}>{endDate==null?"End Date":`${dateFormat(endDate)}`}</Text>
                                </TouchableOpacity>
                            }
                     

                            <TouchableOpacity onPress={()=>setWorking(!working)} style={[working==false?styles.smallButtonsEmpty: styles.smallButtonsFilled]} >
                                <Text style={{textAlign:'center',fontWeight:'500',fontSize:14,color:working==false?Colors.primary:'white'}}>Currently working here</Text>
                            </TouchableOpacity>
                        </View>

                        <DateTimePickerModal maximumDate={new Date()} isVisible={startDatePicker} mode="date"onConfirm={handleStartConfirm} onCancel={hideStartDatePicker}/>
                        <DateTimePickerModal maximumDate={new Date()} isVisible={endDatePicker} mode="date"onConfirm={handleEndConfirm} onCancel={hideEndDatePicker}/>
               
                    </View>

                    <View style={{width:'100%',marginTop:10}}>
                        <Text style={styles.heading}>Resume</Text>
                        <TouchableOpacity onPress={_pickDocument} style={[resume==null?styles.smallButtonsEmpty: styles.smallButtonsFilled]} >
                            <Text style={{textAlign:'center',fontWeight:'500',fontSize:14,color:resume==null?Colors.primary:'white'}}>{resume==null?"Select Resume":"File Selected"}</Text>
                        </TouchableOpacity>
                    </View>

                    

                    <View style={{width:'100%',marginTop:20,justifyContent:'center',alignItems:'center'}}>
                        <TouchableOpacity onPress={submit} style={styles.bigButton} >
                            <Text style={{textAlign:'center',fontWeight:'500',fontSize:16,color:'white'}}>Submit</Text>
                        </TouchableOpacity>
                    </View>

                </View>


            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
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
    heading:{
        fontSize:14,
        fontWeight:'500',
        margin:10,
        color:Colors.primary
    },

    input:{
        width:'90%',
        color:'black',
        padding:10,
        borderBottomColor:'grey',
        borderBottomWidth:1,
        borderRadius:8,
        fontSize:16
    },
    bigButton:{
        backgroundColor:Colors.primary,
        borderRadius:8,
        padding:15,
        marginTop:30,
        width:'90%',

    },
    smallButtonsFilled:{
        backgroundColor:Colors.primary,
        borderRadius:8,
        width:'60%',marginTop:10, margin:10,padding:10,
    },

    smallButtonsEmpty:{
        borderColor:Colors.primary,
        borderWidth:1,
        borderRadius:8,
        width:'60%',marginTop:10, margin:10,padding:10,
    }
})