import React,{useState,useEffect} from "react";
import { View,Text, StyleSheet,ActivityIndicator,TouchableOpacity, Alert, ScrollView, Image, Platform } from "react-native";
import { Colors } from "../../utils/colors";
import OnBoardTemplate from '../../components/onBoardingTemplate'
import { Routes } from "../../utils/routes";
import axios from "axios";
import { ApiCollection } from "../../configs/envConfig";
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import CustomTextInput from "../../components/textInput";
import * as ImagePicker from 'expo-image-picker';
import LoadingModal from "../../components/loadingModal";
import IonIcons from 'react-native-vector-icons/Ionicons'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Dropdown } from "react-native-element-dropdown";


export default function UsernameScreen({route,navigation}){

    useEffect(()=>{
        getBasicInfo()
        getCountries()
    },[])


    const token = route.params.token;
    const loginType = route.params.loginType;



    const [username,setUsername] = useState("")
    const [avialable,setAvialable] = useState(null)
    const [loading,setLoading] = useState(false)
    const [fullName,setFullname] = useState("")
    const [isLoading,setIsLoading] = useState(false);
    const [profileImg,setProfileImg] = useState("https://websitehostaccount.blob.core.windows.net/image/posts/5896390300863004-profilepic.jpg")
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [dateOfBirth,setDateOfBirth] = useState(null);
    const [refCode,setRefCode] = useState("")
    const [selectedCountry,setSelectedCountry] = useState("")
    const [phone,setPhone] = useState(route.params.phone==null?"":route.params.phone)
    const [email,setEmail] = useState(route.params.email==null?"":route.params.email)
    

    const [countryNames,setCountryNames] = useState([])

    const getBasicInfo = async() => {
        await axios.get(`${ApiCollection.userController.getMyBasic}/${route.params.userId}/basic`, {headers:{Authorization:`Bearer ${token}`}})
        .then(res=>{
            console.log(res.data.data.email)
            setFullname(res.data.data.name?res.data.data.name:"")
            setEmail(res.data.data.email?res.data.data.email:"")
            setPhone(res.data.data.phone?res.data.data.phone:"")
            setProfileImg(res.data.data.profilePic)
        })
        .catch(err=>{
            console.log(err)
        })
    }


    const sendMail = async() => {
        await axios.put(ApiCollection.userController.editMail,{"email":email,},{headers:{'Authorization':`Bearer ${token}`}})
        .then(res=>{
          
            //Alert.alert("Success","We have sent an email verification link on your mail address !")
        })
        .catch(err=>{
      
           Alert.alert("Error",err.response.data.message)
           return
        })
    }

    
    const onContinue = async() => {

        if(fullName==''){
            Alert.alert('Personal Info',"Please enter full name")
            return
        }

        if(phone=='' && email==''){
            Alert.alert('Personal Info',"Please enter phone number or email")
            return
        }

        if(email==null && phone==null){
            Alert.alert('Personal Info',"Please enter phone number or email")
            return
        }


        // if( phone.length<10){
        //     Alert.alert('Personal Info',"Please enter valid phone number")
        //     return
        // }

        if(Platform.OS!=='ios'){
            if( dateOfBirth==null){
                Alert.alert('Personal Info',"Please enter date of birth")
                return
            }
        }


        if(selectedCountry==""){
            Alert.alert('Personal Info',"Please select country")
            return
        }

        let data ;

        if(username.trim()!==''){
            if(avialable){
                data = {
                    "name": fullName,
                    "username":username.trim(),
                    "dob":dateOfBirth,
                    "gender":"",
                    "role":"",
                    "refCode":refCode,
                    "address":{
                        "city":"",
                        "state":"",
                        "country":selectedCountry
                    },
                    "gamingGenre":[],
                }

                if(email!=='' && email!==null){
                    sendMail()
                }
            
                if(route.params.phone==null && phone!==''){
                    setLoading(true)
                    await axios.put(ApiCollection.userController.editPhone,{"phone":phone,},{headers:{'Authorization':`Bearer ${token}`}})
                    .then(response=>{
                        //Alert.alert('OTP',`OTP Sent sucessfully`)
                        setLoading(false)
                        navigation.navigate(Routes.onBoardingStack.otpScreen,{token:token,userId:route.params.userId,data:data,contact:phone})
                    })
                    .catch(err=>{
                        Alert.alert('Phone Number',err.response.data.message?err.response.data.message:'Something went wrong !')
                        setLoading(false)
                        navigation.navigate(Routes.onBoardingStack.otpScreen,{token:token,userId:route.params.userId,data:data,contact:phone})
                    })
                }else{
                    navigation.navigate(Routes.onBoardingStack.finalScreen,{token:token,userId:route.params.userId,data:data,contact:route.params.phone})
                }
    
                
      

           

              
            }else{
               Alert.alert('Personal Info',"Username not available")
            }
        }else{
            Alert.alert('Personal Info',"Please enter username")
        }
        
    }

    const getAuthToken = async () => {
        const res = await axios.get(
          "https://www.universal-tutorial.com/api/getaccesstoken",
          {
            headers: {
              Accept: "application/json",
              "api-token":
                "U1ZTNCkp7PvuRY38O7WQwv5zoZHuqYQc8CfATo4v8CpE8y3M2ZcxCfSDG6o3XY_jwg0",
              "user-email": "adityaditya711@gmail.com",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
        return res.data.auth_token;
      };

    const getCountries = async() =>{
        const token = await getAuthToken();

        const config = {
            method: "get",
            url: "https://www.universal-tutorial.com/api/countries",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          };

        const res = await axios(config)
          .then((response) => {
            setCountryNames(response.data)
          })
          .catch((error) => {
            console.log(error)
          })
      
    
        //return res.data;
    }

    const _renderCountries = item => {
        return (
            <View style={styles.item}>
                <Text key={item.country_phone_coded} style={styles.textItem}>{item.country_name}</Text>
            </View>
        );
    };

    const checkUsername= async(usernamex) => {
        setLoading(true)
        await axios.post(ApiCollection.userController.checkUsername,{"username":usernamex},{ headers: { Authorization: `Bearer ${token}` }})
        .then(response=>{
            setLoading(false)

            setAvialable(true)

        })
        .catch(error=>{
            setLoading(false)
            setAvialable(false)
        })

        if(username==""){
            setAvialable(null)
        }
        
    }

    const inputHandler=(username)=>{
        setUsername(username.replace(/\s/g, ''))
        checkUsername(username.replace(/\s/g, ''))
    }

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
                    'Authorization':'Bearer '+token
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

      const dateFormatter = (date) => {
        return `${date.getDate()} / ${date.getMonth()+1} / ${date.getFullYear()}`
    }





    return(
        
        <OnBoardTemplate showButton={true} onContinuePress={onContinue}>
             <LoadingModal modalVisible={isLoading}/>
            <View style={styles.scrollWrapper}>
            
                
                <Text style={{textAlign:'left',paddingVertical:5,color:Colors.primary,marginTop:20}}>Profile Image</Text>
                <View style={{width:'100%',flexDirection:'column',justifyContent:'flex-start',alignItems:'flex-start',marginVertical:20}}>
                    <Image source={{uri: profileImg}} style={{width:80,height:80,borderRadius:50,resizeMode:'cover',borderWidth:2,borderColor:Colors.primary}}/>
                    <TouchableOpacity onPress={pickImage} style={{flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:Colors.primary,padding:5,borderRadius:5,position:'absolute',bottom:0,left:50}}>
                        <FontAwesome name="edit" size={20}  color={'white'} />
                    </TouchableOpacity>
                </View>
                
                <CustomTextInput  label='Username *' onChangeText={(text)=>inputHandler(text)} placeholder="Enter username"/>
                <View style={{flexDirection:'row',width:'80%',marginVertical:10,justifyContent:'flex-start',alignItems:'center'}}>
                    {avialable==null ?
                                <></>
                                :
                                !loading ?
                                    avialable ?  
                                    <AntDesign name={"checkcircle"} size={22} color={'green'}/>
                                    :
                                    <Entypo name={"circle-with-cross"} size={25} color={'red'}/>
                                    :
                                <ActivityIndicator size={22} color={Colors.primary}/>
                                }
                        {username!=="" && avialable==true && <Text style={{marginLeft:5,color:!loading && avialable==true? 'green' :'black',width:'85%',textAlign:'left'}}>{username} will be your username !</Text>}
                </View>

               

                <CustomTextInput label='Full Name *' value={fullName} onChangeText={(text)=>setFullname(text)} placeholder="Enter fullname"/>
               {loginType!=='social'?
                <>
                    <CustomTextInput editable={route.params.phone==null}  value={route.params.phone} maxLength={10} keyboardType='phone-pad' label='Phone Number' onChangeText={(text)=>setPhone(text)} placeholder="Enter phone number"/>
                    <CustomTextInput editable={route.params.email==null}  value={route.params.email}  keyboardType='email-address' label='Email' onChangeText={(text)=>setEmail(text)} placeholder="Enter Email"/>
                </>      
                :
                <>
                    {phone!=="" &&
                        <View style={{width:'100%',marginTop:10,marginBottom:20}}>
                            <Text style={styles.heading}>Phone Number</Text>
                            <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                <Text style={{marginTop:10}}>{phone}</Text>
                            </View>
                        </View>
                    }
                    
                    {email!=="" &&
                        <View style={{width:'100%',marginTop:10}}>
                            <Text style={styles.heading}>Email</Text>
                            <View style={{width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                <Text style={{marginTop:10}}>{email}</Text>
                            </View>
                        </View>
                    }
                    

                   
                </>
                
               
               }
               
               

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
          
                <Text style={{width:'85%',textAlign:'left',paddingVertical:5,color:Colors.primary}}>Country Name *</Text>
            <Dropdown
                style={[styles.dropdownStyle]}
                containerStyle={styles.dropContainer}
                data={countryNames}
                selectedTextStyle={{  fontSize: 14,  }}
                search={true}
                labelField="country_name"
                valueField="country_name"
                value={selectedCountry}
                showsVerticalScrollIndicator={false}
                placeholder="Ex: India"
                placeholderStyle={{ color: '#DBD8C2',fontSize:14 }}
                onChange={item => {setSelectedCountry(item.country_name)}}
                renderItem={item => _renderCountries(item)}
                textError="Error"
            />


                    <CustomTextInput  label='Referral Code' onChangeText={(text)=>setRefCode(text)} placeholder="Enter your referral code "/>
    

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
    heading:{
        fontSize:14,
        fontWeight:'500',
        color:Colors.primary
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
