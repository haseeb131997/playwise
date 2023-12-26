import React, { useEffect } from "react";
import { Text, View, StyleSheet } from 'react-native';
import { Colors } from "../../../../utils/colors";
export default function WinnerDetails (){



    return(
      <View style={{justifyContent:"center", alignContent:"center", alignItems:"center", padding:30}}>
        <Text style={{fontWeight:"bold", fontSize:18, color:Colors.primary}}>Coming soon</Text>
      </View>
      //   <View style={styles.page}>
      //   <View style={styles.subHeadTitle}>
      //      <Text style={styles.headTitle}>Winners Details</Text>
      //      <View style={styles.subHeadTitle}>
      //         <Text style={styles.textStyle}>#1 : Teams X  </Text>
      //         <Text style={styles.textStyle}>#2 : Teams Y </Text>
      //         <Text style={styles.textStyle}>#3 : Teams Z  </Text>
      //      </View>
      //  </View>
      // </View>
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