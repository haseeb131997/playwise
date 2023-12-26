import React,{useEffect,useState} from "react";
import { View,Text, StyleSheet,TextInput,ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { Colors } from "../../utils/colors";
import OnBoardTemplate from '../../components/onBoardingTemplate'
import { Routes } from "../../utils/routes";
import axios from "axios";
import { ApiCollection } from "../../configs/envConfig";
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import { Dropdown } from "react-native-element-dropdown";

export default function AddressScreen({route,navigation}){


    useEffect(()=>{
        getCountries()
    },[])

    const [apiToken,setApiToken] = useState(null)
    const [selectedCity,setSelectedCityName] = useState("")
    const [selectedState,setSelectedStateName] = useState("")
    const [selectedCountry,setSelectedCountry] = useState("")

    const [countryNames,setCountryNames] = useState([])
    const [stateNames,setStateNames] = useState([])
    const [cityNames,setCityNames] = useState([])

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

    const getStates = async(countryName) =>{
        const token = await getAuthToken();
        await axios.get('https://www.universal-tutorial.com/api/states/'+countryName,{headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },})
        .then((response)=>{
            console.log(response.data)
            setStateNames(response.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const getCities = async(stateName) =>{
        const token = await getAuthToken();
        await axios.get('https://www.universal-tutorial.com/api/cities/'+stateName,{headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },})
        .then((response)=>{
            console.log(response.data)
            setCityNames(response.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }


    const onContinue = () => {
        if(selectedCity.trim()!=='' && selectedState.trim()!=='' && selectedCountry.trim()!=='' && selectedState.trim()!==''){

            let data = route.params.data
            data.address = {
                "city":selectedCity,
                "state":selectedState,
                "country":selectedCountry
            }

            navigation.navigate(Routes.onBoardingStack.gamingGenreScreen,{token:route.params.token,userId:route.params.userId,data:data})
            }else{
               Alert.alert('Personal Info',"Please enter correct address !")
            }
        
    }

    const skipStep=()=>{
        let data = route.params.data
        data.address = {
            "city":null,
            "state":null,
            "country":null
        }   
        
        //
        navigation.navigate(Routes.onBoardingStack.gamingGenreScreen,{token:route.params.token,userId:route.params.userId,data:data})
    }
    const _renderCity = (item,index) => {
        return (
            <View key={index} style={styles.item}>
                <Text  style={styles.textItem}>{item.city_name}</Text>
            </View>
        );
    };

    const _renderState = (item,index) => {
        return (
            <View key={index} style={styles.item}>
                <Text  style={styles.textItem}>{item.state_name}</Text>
            </View>
        );
    };

    const _renderCountries = item => {
        return (
            <View style={styles.item}>
                <Text key={item.country_phone_coded} style={styles.textItem}>{item.country_name}</Text>
            </View>
        );
    };



    return(
        
        <OnBoardTemplate showButton={true} onContinuePress={onContinue}>


            <Text style={{width:'85%',textAlign:'left',paddingVertical:5,color:Colors.primary}}>Country Name</Text>
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
                onChange={item => {setSelectedCountry(item.country_name) ;getStates(item.country_name)}}
                renderItem={item => _renderCountries(item)}
                textError="Error"
            />

        {
            selectedCountry!=='' &&
            <>
            <Text style={{width:'85%',textAlign:'left',paddingVertical:5,color:Colors.primary}}>State Name</Text>
            <Dropdown
                style={[styles.dropdownStyle]}
                containerStyle={styles.dropContainer}
                data={stateNames}
                selectedTextStyle={{  fontSize: 14,  }}
                search={true}
                labelField="state_name"
                valueField="state_name"
                value={selectedState}
                showsVerticalScrollIndicator={false}
                placeholder="Ex: Rajasthan"
                placeholderStyle={{ color: '#DBD8C2',fontSize:14 }}
                onChange={item => { setSelectedStateName(item.state_name);getCities(item.state_name) }}
                renderItem={item => _renderState(item)}
                textError="Error"
            />
            </>
        }
        {
            selectedState!=='' &&
        <>
            <Text style={{width:'85%',textAlign:'left',paddingVertical:5,color:Colors.primary}}>City Name</Text>
            <Dropdown
                style={[styles.dropdownStyle]}
                containerStyle={styles.dropContainer}
                data={cityNames}
                selectedTextStyle={{  fontSize: 14,  }}
                search={true}
                labelField="city_name"
                valueField="city_name"
                value={selectedCity}
                showsVerticalScrollIndicator={false}
                placeholder="Ex: Jaipur"
                placeholderStyle={{ color: '#DBD8C2',fontSize:14 }}
                onChange={item => { setSelectedCityName(item.city_name) }}
                renderItem={item => _renderCity(item)}
                textError="Error"
            />
</>
        }
     
            <TouchableOpacity onPress={skipStep} style={{margin:20}}>
                <Text>Skip this step !</Text>
            </TouchableOpacity>
        </OnBoardTemplate>
    )
}

const styles = StyleSheet.create({

    input: {
        height: 50,
        margin: 5,
        borderWidth: 1,
        padding: 12,
        borderColor: '#DBD8C2',
        borderRadius: 8,
        width: '85%',
        flexDirection:'row',
        justifyContent:"space-between",
        backgroundColor: 'white',
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
        marginBottom: 0,
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

