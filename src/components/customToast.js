import React from "react";
import Toast from 'react-native-root-toast';
import { Colors } from "../utils/colors";


export function showCutomizedToast (message,type) {
    Toast.show(message, {duration: Toast.durations.LONG,position:Toast.positions.BOTTOM,
        containerStyle:{marginBottom:80,paddingVertical:10,borderLeftColor:type=='success'? 'green':'red',borderLeftWidth:5,width:'70%',backgroundColor:'white',borderRadius:5},
        shadowColor:'grey',
        opacity:1,
        textColor:'black',
      });
}


