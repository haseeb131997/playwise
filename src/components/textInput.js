import React from "react";
import { View,Text, StyleSheet,TextInput,ActivityIndicator, Alert } from "react-native";
import { Colors } from "../utils/colors";



export default function CustomTextInput(props){  

    return(
        <View style={[{width:'100%',marginTop:10},props.style]}>
            {props.label && <Text style={{width:'100%',textAlign:'left',paddingVertical:5,color:Colors.primary}}>{props.label}</Text>}
            <TextInput editable={props.editable} value={props.value} maxLength={props.maxLength} keyboardType={props.keyboardType} style={[styles.input]} onChangeText={props.onChangeText} placeholder={props.placeholder} placeholderTextColor={'#DBD8C2'}/>
        </View>  
    )
}

const styles = StyleSheet.create({

    input: {
        height: 50,
        marginTop: 5,
        borderWidth: 1,
        padding: 12,
        borderColor: '#DBD8C2',
        borderRadius: 8,
        width: '98%',
        backgroundColor: 'white',
    },
})

