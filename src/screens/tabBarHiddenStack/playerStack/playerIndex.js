import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '../../../utils/routes';
import PlayerProfileScreen from './playerProfileScreen';
import ChatMessageScreen from '../chatStack/chatMessageScreen';
import ChatSettingScreen from '../chatStack/chatSettingsScreen';
import { TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import PubgStatsScreen from '../../../components/statsScreens/pubgStatScreen';
import FortniteStatsScreen from '../../../components/statsScreens/fortniteStatsScreen';
import ApexStatsScreen from '../../../components/statsScreens/apexStatsScreen';
import CocStatsScreen from '../../../components/statsScreens/cocStatScreen';
import CSGoStatsScreen from '../../../components/statsScreens/csgoStatsScreen';
import FollowerScreen from './followerScreen';
import PostNavigator from '../postStack/postIndex';
import { DarkModeStatus } from '../../../app/useStore';
import { getDarkTheme, getLightTheme } from '../../../utils/colors';



const PlayerStack = createStackNavigator();



const PlayerNavigator = ({route,navigation}) => {
  const mode = DarkModeStatus()
    return (
      <PlayerStack.Navigator initialRouteName={Routes.tabBarHiddenScreens.playerStack.playerInfoScreen}  screenOptions={{ 
        headerTintColor:  mode ? getDarkTheme.color : getLightTheme.color, headerStyle: { backgroundColor: mode?'#424240':"white" },
    
      }}>
        <PlayerStack.Screen initialParams={route.params} name={Routes.tabBarHiddenScreens.playerStack.playerInfoScreen} component={PlayerProfileScreen} options={{ headerShown: true,headerTitle:'',headerTransparent:true,headerTintColor:'white'}}screenOptions={{headerStyle: { backgroundColor: mode?'#424240':"white" },
        headerTintColor:  mode ? getDarkTheme.color : getLightTheme.color,}} />
        <PlayerStack.Screen name={Routes.tabBarHiddenScreens.playerStack.playerFollowersScreen} component={FollowerScreen} options={{ headerShown: true,headerTitle:'' , headerStyle: {
  backgroundColor: mode ? getDarkTheme.backgroundColor : getLightTheme.backgroundColor,
},

}} />


        <PlayerStack.Screen name={Routes.tabBarHiddenScreens.playerStack.playerStats.pubg} component={PubgStatsScreen} options={{ headerShown: false,headerTransparent:true,headerTitle:'', }} />
        <PlayerStack.Screen name={Routes.tabBarHiddenScreens.playerStack.playerStats.fortnite} component={FortniteStatsScreen} options={{ headerShown: false,headerTransparent:true,headerTitle:'' }} />
        <PlayerStack.Screen name={Routes.tabBarHiddenScreens.playerStack.playerStats.apex} component={ApexStatsScreen} options={{ headerShown: false,headerTransparent:true,headerTitle:'' }} />
        <PlayerStack.Screen name={Routes.tabBarHiddenScreens.playerStack.playerStats.coc} component={CocStatsScreen} options={{ headerShown: false,headerTransparent:true,headerTitle:'' }} />
        <PlayerStack.Screen name={Routes.tabBarHiddenScreens.playerStack.playerStats.csgo} component={CSGoStatsScreen} options={{ headerShown: false,headerTransparent:true,headerTitle:'' }} />

        <PlayerStack.Screen name={Routes.tabBarHiddenScreens.chatStack.chatMessageScreen} component={ChatMessageScreen} 
         options={({route})=>({ 
          headerShown: true,
          headerTitle:route.params.user.username,
          // headerRight:()=>(
          //   <TouchableOpacity onPress={()=>{navigation.navigate(Routes.tabBarHiddenScreens.chatStack.chatSettingsScreen,{user:route.params.chatPerson})}}>
          //        <Entypo name="dots-three-vertical" size={22} style={{marginHorizontal:15}} color={'black'} />
          //   </TouchableOpacity>
          // )
          
          })} />
          <PlayerStack.Screen name={Routes.tabBarHiddenScreens.postStack.tag} component={PostNavigator} options={{ headerShown: false,headerTransparent:true,headerTitle:'' }} />

      </PlayerStack.Navigator>
    )
  }


export default  PlayerNavigator;