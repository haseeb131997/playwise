import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '../../../utils/routes';
import TournamentListScreen from './tournamnetListScreen';
// import TournamentDetailsScreen from './tournamentDetailsScreen';
import RegisterTournamentScreen from './registerScreen';
import UpdateEmailScreen from '../../drawerStack/settingsStack/updateEmailScreen';
import TournamentScreen from './tournamentScreen';
import { DarkModeStatus } from '../../../app/useStore';
import { getDarkTheme, getLightTheme } from '../../../utils/colors';
import TournamentTopTabNavigator from './tournamentTopTabStack/tournamentTopTabIndex';
import FilterByGamesScreen from './filterByGamesScreen';

const TournamentStack = createStackNavigator();

const TournamentNavigator = () => {
   const mode = DarkModeStatus();
  
    return (
      <TournamentStack.Navigator initialRouteName={Routes.tabStack.tournamentStack.tournamentScreen} screenOptions={{headerStyle: { backgroundColor: mode?'#424240':"white" },
      headerTintColor:  mode ? getDarkTheme.color : getLightTheme.color,}}>
      <TournamentStack.Screen name={Routes.tabStack.tournamentStack.tournamentScreen} component={TournamentScreen}  options={({ navigation, route })=>({ headerShown: true,})} />
        <TournamentStack.Screen name={Routes.tabStack.tournamentStack.tournamentListScreen} component={TournamentListScreen}  options={({ navigation, route })=>({ headerShown: true,headerTitle:`${route.params.name} Tournaments`})} />
        
        {/* <TournamentStack.Screen name={Routes.tabStack.tournamentStack.tournamentDetailScreen} component={TournamentDetailsScreen}  options={({ navigation, route })=>({ headerShown: true,})} /> */}
        <TournamentStack.Screen name={Routes.tabStack.tournamentStack.registerScreen} component={RegisterTournamentScreen}  options={({ navigation, route })=>({ headerShown: true,})} />
        <TournamentStack.Screen name={Routes.tabStack.tournamentStack.updateEmailScreen} component={UpdateEmailScreen}  options={({ navigation, route })=>({ headerShown: true,})} />
        <TournamentStack.Screen name={Routes.tabStack.tournamentStack.filterByGamesScreen} component={FilterByGamesScreen}  options={({ navigation, route })=>({ headerShown: false,})} />
        <TournamentStack.Screen name={Routes.tabStack.tournamentStack.tournamentTopTabStack.tag} component={TournamentTopTabNavigator} />
      </TournamentStack.Navigator>
    )
  }


export default  TournamentNavigator;