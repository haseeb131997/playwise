
import React, { useState } from 'react';
import { StyleSheet, Platform, Text, View, KeyboardAvoidingView, ScrollView } from 'react-native';
import { envConfig } from '../configs/envConfig';
import { Colors } from '../utils/colors';
import CustomButton from './customButtons';

const OnBoardTemplate = (props) => {
  

    return (
        <ScrollView contentContainerStyle={styles.base}>
            <View style={[styles.contentWrapper,props.customBodyStyle]}>{props.children}</View>
            {props.showButton && <CustomButton style={styles.bottomPanel} onPress={props.onContinuePress} type='primary' label={props.label? props.label: 'Continue'} />}
        </ScrollView>
    );

}

const styles = StyleSheet.create({
    base: {

        justifyContent:'flex-start',
        alignItems:'center',
        backgroundColor:'white',
       paddingBottom:70
    },

    contentWrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },


    button:{
        backgroundColor:Colors.primary,
        borderRadius:8,
        padding:15,
        width:'80%',
        ...envConfig.PlatformShadow,
    },

})

export default OnBoardTemplate;