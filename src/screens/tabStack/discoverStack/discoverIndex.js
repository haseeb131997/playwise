import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '../../../utils/routes';
import DiscoverScreen from './discoverScreen';
import { View,Text,TouchableOpacity,Image } from 'react-native';
import { Colors } from '../../../utils/colors';
import IonIcons from 'react-native-vector-icons/Ionicons'
import PostNavigator from '../../tabBarHiddenStack/postStack/postIndex';
import CommentScreen from '../../tabBarHiddenStack/postStack/commentScreen';
import { DarkModeStatus } from '../../../app/useStore';
import { getDarkTheme,get
 } from '../../../utils/colors';


const DiscoverStack = createStackNavigator();

const DiscoverNavigator = () => {

    const mode = DarkModeStatus();
  
    return (
      <DiscoverStack.Navigator initialRouteName={Routes.tabStack.discoverStack.discoverScreen}>
        <DiscoverStack.Screen name={Routes.tabStack.discoverStack.discoverScreen} component={DiscoverScreen}  
       options={({ navigation, route })=>({ headerShown: true,
        headerTintColor:mode?getDarkTheme.color:'black',
        headerStyle:{
            backgroundColor:mode?getDarkTheme.backgroundColor:'white',
        },
        headerRight: () => (
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <TouchableOpacity onPress={()=>navigation.navigate(Routes.tabBarHiddenScreens.searchStack.tag)}>
                    <IonIcons name="search" size={25} style={{marginHorizontal:15}} color={Colors.primary} />
                </TouchableOpacity>
            </View>
        ),
        })} />

      </DiscoverStack.Navigator>
    )
  }


export default  DiscoverNavigator;