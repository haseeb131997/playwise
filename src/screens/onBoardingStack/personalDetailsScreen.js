import React,{useState} from "react";
import { View,Text, StyleSheet,TextInput,TouchableOpacity, Alert, ScrollView, Image } from "react-native";
import { Colors } from "../../utils/colors";
import OnBoardTemplate from '../../components/onBoardingTemplate'
import { Routes } from "../../utils/routes";
import CustomTextInput from "../../components/textInput";
import CustomButton from "../../components/customButtons";
import IonIcons from 'react-native-vector-icons/Ionicons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import axios from "axios";
import LoadingModal from "../../components/loadingModal";
import { ApiCollection } from "../../configs/envConfig";
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dropdown } from "react-native-element-dropdown";

export default function PersonalDetailsScreen({route,navigation}){

    const [fullName,setFullname] = useState("")
    const [day,setDay] = useState("")
    const [month,setMonth] = useState("")
    const [year,setYear] = useState("")
    const [selected,setSelected] = useState(0)
    const [accIsPublic,setAccIsPublic] = useState(true)
    const [role,setRole] = useState("")
    const [customRole,setCustomRole] = useState("");
    const [isLoading,setIsLoading] = useState(false);
    const [profileImg,setProfileImg] = useState("https://st4.depositphotos.com/4329009/19956/v/600/depositphotos_199564354-stock-illustration-creative-vector-illustration-default-avatar.jpg")
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [dateOfBirth,setDateOfBirth] = useState(null);

    const genders=[
        {title:'Male',index:0,value:'male'},
        {title:'Female',index:1,value:'female'},
        {title:'Others',index:2,value:'other'}
    ]

    const avialableRoles = [
        {label:"Gamer",value:"Gamer"},
        {label:"Assaulter",value:"Assaulter"},
        {label:"Defender",value:"Defender"},
        {label:"Graphic Designer",value:"Graphic Designer"},
        {label:"Coach",value:"Coach"},
        {label:"Game developer",value:"Game developer"},
        {label:"Developer",value:"Developer"},
        {label:"Squad Leader",value:"Squad Leader"},
        {label:"Tournament Organizer",value:"Tournament Organizer"},
        {label:"Other",value:"Other"},
    ]

    const _renderRoles = item => {
        return (
            <View style={styles.item}>
                <Text key={item.label} style={styles.textItem}>{item.label}</Text>
            </View>
        );
    };


    const pickImage = async () => {

        
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.5,
        });
    
        if (!result.cancelled) {

            const imgType = Platform.OS=='android' ? 'jpeg' : 'jpg';

            const imageData ={
                name: `${Date.now()}`,
                uri: result.uri,
                type:`image/${imgType}`,
             }

             setProfileImg(imageData.uri)
    
            
            const bodyFormData = new FormData();
            bodyFormData.append("image", imageData);
            bodyFormData.append("type","profilePic");



            let fields={
                responseType: "json", 
                headers: { 
                    'content-type': 'multipart/form-data', 
                    'accept': 'application/json',
                    'Authorization':'Bearer '+route.params.token
                },
            }
            setIsLoading(true)
            await axios.post(ApiCollection.mediaController.uploadProfilePic,bodyFormData,fields)
                .then(res=>{
                    setIsLoading(false)
                })
                .catch(err=>{
                    setIsLoading(false)
                })


           
        }
      };

      const showPicker = () => {
        setDatePickerVisible(true);
       
      };

      const hidePicker = () => {
        setDatePickerVisible(false);
      };

      const handleDOB = (date) => {
        setDateOfBirth(date);
        hidePicker();
      };


    const onContinue = () => {
        let data = route.params.data
        if(fullName.trim()==''){
            Alert.alert('Personal Info',"Please enter your full name")
            return
        } 

        if(dateOfBirth==null){
            Alert.alert('Personal Info',"Invalid Date")
            return
        }

        if(role.trim()==''){
            Alert.alert('Personal Info',"Please enter your role")
            return
        }


        else{
            data.name = fullName
            data.gender = genders[selected].value
            data.accountType =accIsPublic?"public":"private"
            data.role = role=="Other"?customRole:role
            data.dob = dateOfBirth.getTime()

            navigation.navigate(Routes.onBoardingStack.addressScreen,{token:route.params.token,userId:route.params.userId,data:data})
        }
    }

    const dateFormatter = (date) => {
        return `${date.getDate()} / ${date.getMonth()+1} / ${date.getFullYear()}`
    }



    return(
        
        <OnBoardTemplate showButton={false}>
            <LoadingModal modalVisible={isLoading}/>
            <View style={styles.scrollWrapper}>
                <ScrollView contentContainerStyle={{paddingBottom:40}}  showsVerticalScrollIndicator={false} style={{ width: '100%', height: '100%' }}>

                <Text style={{textAlign:'left',paddingVertical:5,color:Colors.primary,marginTop:20}}>Profile Image</Text>
                
                <View style={{width:'100%',flexDirection:'column',justifyContent:'flex-start',alignItems:'flex-start',marginVertical:20}}>
                    <Image source={{uri: profileImg}} style={{width:80,height:80,borderRadius:50,resizeMode:'cover',borderWidth:2,borderColor:Colors.primary}}/>
                    <TouchableOpacity onPress={pickImage} style={{flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:Colors.primary,padding:5,borderRadius:5,position:'absolute',bottom:0,left:50}}>
                        <FontAwesome name="edit" size={20}  color={'white'} />
                    </TouchableOpacity>
                </View>

                <CustomTextInput label='Full Name *' onChangeText={(text)=>setFullname(text)} placeholder="Enter fullname"/>
                
                <Text style={{textAlign:'left',paddingVertical:5,color:Colors.primary,marginTop:30}}>Date of Birth *</Text>
                <TouchableOpacity onPress={showPicker} style={{marginBottom:30,padding:10,paddingVertical:10, borderColor: '#DBD8C2', borderRadius: 8,borderWidth:1,flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                    {
                        dateOfBirth==null?
                        <>
                        <Text style={{color:'lightgrey',padding:5,fontSize:16}}>dd</Text>
                        <Text style={{color:'lightgrey',}}>/</Text>
                        <Text style={{color:'lightgrey',padding:5,fontSize:16}}>mm</Text>
                        <Text style={{color:'lightgrey',}}>/</Text>
                        <Text style={{color:'lightgrey',padding:5,fontSize:16}}>yyyy</Text>
                        </>
                        :
                        <Text style={{padding:5,fontSize:15}}>{dateFormatter(dateOfBirth)}</Text>
                    }

                </TouchableOpacity>
                <DateTimePickerModal maximumDate={new Date()} isVisible={datePickerVisible} mode="date"onConfirm={handleDOB} onCancel={hidePicker}/>
          

                <Text style={{width:'85%',textAlign:'left',paddingVertical:5,color:Colors.primary}}>Gender</Text>

                {genders.map((gender,index)=>(
                    <TouchableOpacity onPress={()=>setSelected(gender.index)} key={index} style={[styles.genderSelect, selected==gender.index && {backgroundColor:Colors.primary} ]}>
                        <Text style={{color: selected==gender.index ? 'white': 'black'}}>{gender.title}</Text>
                    </TouchableOpacity>
                ))}

                

                <View style={{width:'100%',marginVertical:10,marginTop:30}}>
                        <Text  style={{width:'85%',textAlign:'left',paddingVertical:5,color:Colors.primary}}>Account Type</Text>
                        <View  style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',borderColor:Colors.primary,borderWidth:1 ,width:'90%',borderRadius:5,marginTop:5}}>
        
                            <TouchableOpacity onPress={()=>setAccIsPublic(true)} style={[{width:'50%',padding:10,paddingVertical:8,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},accIsPublic && {backgroundColor:Colors.primary}]}>
                            <Text style={{color:accIsPublic?'white': Colors.primary}}>Public</Text>
                            {
                                accIsPublic && <IonIcons name="checkmark" size={25} color={'white'} />
                            }
                            
                            </TouchableOpacity>

                            <TouchableOpacity onPress={()=>setAccIsPublic(false)} style={[{width:'50%',padding:10,paddingVertical:8,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},accIsPublic==false && {backgroundColor:Colors.primary}]}>
                            <Text style={{color: accIsPublic ? Colors.primary:'white'}}>Private</Text>
                            {
                                accIsPublic==false && <IonIcons name="checkmark" size={25} color={'white'} />
                            }
                            
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={{width:'100%',textAlign:'left',paddingVertical:5,color:Colors.primary,marginTop:10}}>Role</Text>

                    <Dropdown
                            style={[styles.dropdownStyle]}
                            containerStyle={styles.dropContainer}
                            data={avialableRoles}
                            selectedTextStyle={{  fontSize: 14,  }}
                            search={false}
                            labelField="label"
                            valueField="value"
                            value={role}
                            showsVerticalScrollIndicator={false}
                            placeholder={`${role}`}
                            placeholderStyle={{ color: 'black',fontSize:14 }}
                            onChange={item => {setRole(item.value) }}
                            renderItem={item => _renderRoles(item)}
                            textError="Error"
                        />        
                     {
                        role=="Other" &&
                        <CustomTextInput  onChangeText={(text)=>setCustomRole(text)} placeholder="Enter your role.."/>
                     }

                

                <CustomButton type='primary' style={{width:'100%',marginVertical:20}}  label={'Continue'} onPress={onContinue}/>
                

                
                </ScrollView>
            </View>
        </OnBoardTemplate>
    )
}


const styles = StyleSheet.create({

    input: {
        height: 50,
        width:55,
        margin: 5,
        padding: 12,
    },

    scrollWrapper: {
        width: '90%',
        // height: Dimensions.get('window').height < 750 ? '80%' : '90%',
    },

    genderSelect:{
        width:'100%',
        marginTop:10,
        padding:15,
        borderColor:Colors.primary,
        borderWidth:1,
        borderRadius:8
    },
    dropdownStyle: {
        borderColor: 'lightgrey',
        borderWidth: 0.5,
        padding: 7,
        borderRadius: 8,
        width: '85%',
        fontSize: 18,
        color: Colors.primary,
        backgroundColor: 'white',
        margin: 10,
        marginLeft:0,
        shadowColor: 'grey',
        elevation: 3,
        marginBottom: 10
    },

    item: {
        paddingVertical: 17,
        paddingHorizontal: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },

    dropContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        paddingLeft: 5,
    },
})


