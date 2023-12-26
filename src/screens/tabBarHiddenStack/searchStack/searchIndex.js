import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '../../../utils/routes';
import SearchScreen from './searchScreen';
import ScannerScreen from './scanScreen';
import { DarkModeStatus } from '../../../app/useStore';
import { getDarkTheme, getLightTheme } from '../../../utils/colors';

const SearchStack = createStackNavigator();



const SearchNavigator = () => {

  const mode = DarkModeStatus();
  
    return (
      <SearchStack.Navigator initialRouteName={Routes.tabBarHiddenScreens.searchStack.searchScreen} screenOptions={{headerStyle: { backgroundColor: mode?'#424240':"white" },
      headerTintColor:  mode ? getDarkTheme.color : getLightTheme.color,}}>
        <SearchStack.Screen name={Routes.tabBarHiddenScreens.searchStack.searchScreen} component={SearchScreen}  options={{ headerShown: true,}} />
        <SearchStack.Screen name={Routes.tabBarHiddenScreens.searchStack.scanScreen} component={ScannerScreen}  options={{ headerShown: true,}} />
      </SearchStack.Navigator>
    )
  }


export default  SearchNavigator;