import { StyleSheet,Dimensions } from "react-native";
import { envConfig } from "../../../../configs/envConfig";
import { Colors } from "../../../../utils/colors";

export const styles=StyleSheet.create({
    page:{
        flex:1,
        backgroundColor:'#fff',
        alignItems:'center',
        justifyContent:'flex-start',

    },

    tabHead:{
        fontSize:18,
        fontWeight:'700',
        color:Colors.primary,
        margin:15
    },
    statsCard:{
        width:Dimensions.get('window').width/2.4,
        height:130,
        ...envConfig.PlatformShadow,
        backgroundColor:'white',
        borderRadius:10,
        margin:10,
        overflow:'hidden',
      
    },

})