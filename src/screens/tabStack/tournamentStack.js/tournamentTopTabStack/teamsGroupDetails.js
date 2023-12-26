import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Colors } from "../../../../utils/colors";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { ApiCollection } from "../../../../configs/envConfig";
import { UserToken } from "../../../../app/useStore";
import DropDownPicker from "react-native-dropdown-picker";

export default function TeamGroupDetails(){

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [value, setValue] = useState(null);
  const [value2, setValue2] = useState(null);
  const [items, setItems] = useState([{label: 'Group-1', value: "Group-1"},
     {label: 'Group-2', value: "Group-2"},{label: 'Group-3', value: "Group-3"},
     {label: 'Group-4', value: "Group-4"},{label: 'Group-5', value: "Group-5"},
     {label: 'Group-6', value: "Group-6"},{label: 'Group-7', value: "Group-7"}
  ]);
  const [items2, setItems2] = useState([{label: 'Team-1', value: "Team-1"},
     {label: 'Team-2', value: "Team-2"},{label: 'Team-3', value: "Team-3"},
     {label: 'Team-4', value: "Team-4"},{label: 'Team-5', value: "Team-5"},
     {label: 'Team-6', value: "Team-6"},{label: 'Team-7', value: "Team-7"}
  ]);

  const token = UserToken();
  const [isLoading, setIsLoading] = useState(true);
  const [playersDetails, setPlayersDetails] = useState(undefined);
  // const tournamentId ="63d6ab1f84d4ce5439dc6398"
  const tournamentId ="645e85cadd4OOd926764e3fd"
  // const focused = useIsFocused();


  useEffect(() => {
    getTeamsGroupDetails();
  }, []);

  const getTeamsGroupDetails = async () => {
    setIsLoading(true);
    await axios
      .get(
        `${ApiCollection.gamesController.getPlayersDetailss}/${tournamentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setIsLoading(false);
        setPlayersDetails(response.data.data); 
        console.log(playersDetails,"response datassssss");
      })
      .catch((error) => {
        setIsLoading(false);
        // console.log(error.response,"error response data");

      });
  };
    return(
      <View style={{justifyContent:"center", alignContent:"center", alignItems:"center",padding:30}}>
        <Text style={{fontWeight:"bold", fontSize:18, color:Colors.primary}}>Coming soon</Text>
      </View>
      
      //   <ScrollView style={styles.page}>
      //    <View style={styles.subHeadTitle}>
      //       <Text style={styles.headTitle}>Teams & Group Details</Text>
      //       <Text style={styles.textStyle}>List of Registered Teams: </Text>
      //       <View style={{padding:10,marginLeft:-30, marginBottom:20}}>
      //          <DropDownPicker
      //             open={open2}
      //             value={value2}
      //             items={items2}
      //             setOpen={setOpen2}
      //             setValue={setValue2}
      //             setItems={setItems2}
      //             placeholder="Teams"
      //             showsVerticalScrollIndicator="true"
      //             containerStyle={{height: 30, width:"90%", alignSelf:"center"}} />
      //          </View>
           
      //          <Text style={styles.textStyle}>Groups Details </Text>
      //          <View style={{padding:10,marginLeft:-30, marginBottom:20}}>
      //          <DropDownPicker
      //             open={open}
      //             value={value}
      //             items={items}
      //             setOpen={setOpen}
      //             setValue={setValue}
      //             setItems={setItems}
      //             dropdownPosition="auto"
      //             placeholder="Choose Group"
      //             maxHeight={items.height}
      //             showsVerticalScrollIndicator="true"
      //             containerStyle={{height: 30, width:"90%", alignSelf:"center"}} />
      //          </View>
      //          <Text style={{fontSize:18,marginBottom:10, color:"black", fontWeight:"600", marginTop:20}}>Group A Teams: </Text>
      //          <Text style={styles.subTextStyle}>Group B Teams: </Text>
      //          <Text style={styles.subTextStyle}>Group C Teams: </Text>
      //          <Text style={styles.subTextStyle}>Group D Teams: </Text>
        
      //   </View>
      //  </ScrollView >
    )
}
const styles = StyleSheet.create({
    page: {
        // justifyContent: "flex-start",
        // alignItems: "flex-start",
        backgroundColor:"white",
        //  mode? getDarkTheme.backgroundColor:getLightTheme.backgroundColor,
      },
      subHeadTitle:{
        marginTop:10,
        marginLeft:16,
      },
      headTitle:{
        fontSize:20,
        marginBottom:10, 
        color: Colors.primary,
        // mode ? getDarkTheme.color : Colors.primary, 
        fontWeight:"700",
      },
      textStyle:{
        fontSize:18,
        marginBottom:10, 
        color:"black",
        fontWeight:"600"
        // mode ? getDarkTheme.color : getLightTheme.color,
      },
      subTextStyle:{
        fontSize:16,
        marginBottom:10, 
        color:"black",
        // mode ? getDarkTheme.color : getLightTheme.color,
      }
})