import React, { createRef, useState } from "react";
import { Colors, getDarkTheme, getLightTheme } from "../../../../utils/colors";
import { DarkModeStatus, UserToken } from "../../../../app/useStore";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDownPicker from "react-native-dropdown-picker";
import { BottomSheet } from "../../../../components/BottomSheet";
import { FontAwesome } from '@expo/vector-icons/FontAwesome';
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import axios from "axios";
import { ApiCollection } from "../../../../configs/envConfig";


  
export default function MatchDetails({ route, navigation }){
  const mode = DarkModeStatus();
const tncSheet = createRef();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([{label: 'Round-1', value: "Round-1"},
  {label: 'Round-2', value: "Round-2"},{label: 'Round-3', value: "Round-3"},{label: 'Round-4', value: "Round-4"}
    
  ]);

  const token = UserToken();
  const [isLoading, setIsLoading] = useState(true);
  const [roundNumber, setroundNumber] = useState(undefined);

  // const tournamentId = route.params.tournament
  // ? route.params.tournament._id
  // : route.params.tournamentId;
  const focused = useIsFocused();

  const tournamentId ="63d6ab1f84d4ce5439dc6398"

  useEffect(() => {
    getTournamentDetails();
  }, []);

  const getTournamentDetails = async () => {
    setIsLoading(true);
    await axios
      .get(
        `${ApiCollection.gamesController.getRoundNumber}/${tournamentId}/1`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setIsLoading(false);
        setroundNumber(response.data.players); 
        console.log(response,"response data");
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error,"error response data");
        // console.log(roundNumber,"response data....2");
        // console.log(response," error response data");
      });
  };

  // console.log(items.value,"lebbbbbbbbbbbbbbbbbbbbbbbbeeeeeeeeeeeeeeeeel")
    return(<View style={{justifyContent:"center", alignContent:"center", alignItems:"center", padding:30}}>
    <Text style={{fontWeight:"bold", fontSize:18, color:Colors.primary}}>Coming soon</Text>
  </View>
      
      //  <View style={styles.page}>
      //    <View style={styles.subHeadTitle}>
      //       <Text style={styles.headTitle}>Schedule of Matches</Text>
      //       <Text style={styles.textStyle}>Total Number of Matches : </Text>
      //       <View style={{width:"100%", height:100}}>
      //          <Text style={{marginTop:10,marginLeft:16,marginBottom:10,fontSize:16,fontWeight:"600"}}>Choose Tournament Rounds </Text>
      //         <DropDownPicker
      
      //             open={open}
      //             value={value}
      //             items={items}
      //             setOpen={setOpen}
      //             setValue={setValue}
      //             setItems={setItems}
      //             zIndex={3000}
      //             zIndexInverse={1000}
      //             placeholder="Choose Tournament Round"
      //             containerStyle={{height: 30, width:"90%", alignSelf:"center"}} />
      //       </View>
      //       <View>
      //        <Text style={styles.headTitle}>Match Details</Text>
      //        <Text style={styles.textStyle}>Match No : </Text>
      //        <Text style={styles.textStyle}>Room Id : </Text>
      //          <Text style={styles.textStyle}>Password : </Text>
      //        <Text style={styles.textStyle}>Time : </Text>
      //        </View>
      //        <View>
      //        <Text style={styles.headTitle}>General Instruction</Text>
      //        <Text style={styles.textStyle}>Instructions about the match will come from backend!!!  </Text>
      //        </View>
      //        <View style={{ width: "100%", marginVertical: 5 }}>
      //             <TouchableOpacity
      //               onPress={() => {tncSheet.current.open(), getTournamentDetails()}}
      //               style={{
      //                 width: 180,
      //                 borderColor: Colors.primary,
      //                 borderWidth: 1,
      //                 padding: 10,
      //                 paddingHorizontal: 20,
      //                 marginVertical: 10,
      //                 borderRadius: 5,
      //               }}
      //             >
      //               <Text style={{ color: Colors.primary, fontSize: 15 }}>
      //                 Term & Conditions
      //               </Text>
      //             </TouchableOpacity>
      //           </View>
      //           <BottomSheet
      //     ref={tncSheet}
      //     heading={"Terms & Conditions"}
      //     height={Dimensions.get("screen").height * 0.7}
      //     modeType={mode}
      //   >
      //     <ScrollView
      //       contentContainerStyle={{
      //         width: Dimensions.get("screen").width * 0.95,
      //         paddingBottom: 50,
      //         backgroundColor: mode
      //           ? getDarkTheme.backgroundColor
      //           : getLightTheme.backgroundColor,
      //       }}
      //       horizontal={false}
      //     >
      //       <View style={{ width: "100%" }}>
      //             <Text
      //               style={{
      //                 paddingVertical: 5,
      //                 fontSize: 16,
      //                 color: mode ? getDarkTheme.color : getLightTheme.color,
      //               }}
      //             >
      //               Terms and Condition
      //             </Text>
                
      //       </View>
      //     </ScrollView>
      //   </BottomSheet>
      //       {/* <View style={styles.subHeadTitle}>
      //         <Text style={styles.textStyle}>Match 2 : Date & Time </Text>
      //         <Text style={styles.textStyle}>Room Id : </Text>
      //         <Text style={styles.textStyle}>Password : </Text>
      //       </View>
      //       <View style={styles.subHeadTitle}>
      //         <Text style={styles.textStyle}>Match 3 : Date & Time </Text>
      //         <Text style={styles.textStyle}>Room Id : </Text>
      //         <Text style={styles.textStyle}>Password : </Text>
      //       </View> */}
      //   </View>
      //  </View>
    )
}

const styles = StyleSheet.create({
    page: {
        justifyContent: "flex-start",
        alignItems: "flex-start",
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
        fontSize:16,
        marginBottom:10, 
        color:"black",
        // mode ? getDarkTheme.color : getLightTheme.color,
      }
})