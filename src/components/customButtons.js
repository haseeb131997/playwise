import React from "react";
import { View,Text,TouchableOpacity,StyleSheet } from "react-native";
import { Colors } from "../utils/colors";

const PrimaryButton =(props)=>{
    return(
        <TouchableOpacity style={[styles.primary,props.style]} onPress={props.onPress}>
            <Text style={{textAlign:'center',fontWeight:'500',fontSize:16,color:'white'}}>{props.label ? props.label :"Submit"}</Text>
        </TouchableOpacity>
    )
}

const OutlineSmallButton =(props)=>{
    return(
        <TouchableOpacity style={[styles.outlineSmall,props.style]}  onPress={props.onPress} >
            <Text style={{color:Colors.primary,padding:5}}>{props.label ? props.label :"Submit"}</Text>
        </TouchableOpacity>
    )
}

const OutlineBigButton =(props)=>{
    return(
        <TouchableOpacity style={[styles.outlineBig,props.style]}  onPress={props.onPress} >
            <Text style={{textAlign:'center',fontWeight:'500',fontSize:16,color:Colors.primary}}>{props.label ? props.label :"Submit"}</Text>
        </TouchableOpacity>
    )
}



export default function CustomButton(props) {

    const buttonTypes =[
        {type:"primary",button:<PrimaryButton onPress={props.onPress} style={props.style} label={props.label} shadow={props.shadow}/>},
        {type:"follow",button:<PrimaryButton onPress={props.onPress} label={props.label} shadow={props.shadow}/>},
        {type:"follwing",button:<PrimaryButton onPress={props.onPress} label={props.label} shadow={props.shadow}/>},
        {type:"outline-small",button:<OutlineSmallButton onPress={props.onPress} style={props.style} label={props.label} shadow={props.shadow}/>},
        {type:"outline-big",button:<OutlineBigButton onPress={props.onPress} label={props.label} shadow={props.shadow}/>},
        {type:"solid-small",button:<PrimaryButton onPress={props.onPress} label={props.label} shadow={props.shadow}/>},
        {type:"icon-label",button:<PrimaryButton onPress={props.onPress} label={props.label} shadow={props.shadow}/>},

    ]
    
    const typeIndex = buttonTypes.findIndex(button=>button.type=== props.type)
    
    return buttonTypes[typeIndex].button;
}

const styles =StyleSheet.create({
    primary:{
        backgroundColor:Colors.primary,
        borderRadius:8,
        padding:15,
        marginTop:30,
        width:'90%',
    },
    outlineSmall:{
        borderColor:Colors.primary,
        borderWidth:1,
        borderRadius:5,
        paddingHorizontal:20,
        marginTop:20,
    },
    outlineBig:{
        borderColor:Colors.primary,
        borderWidth:1,
        borderRadius:8,
        padding:15,
        marginTop:30,
        width:'90%',
    }
})