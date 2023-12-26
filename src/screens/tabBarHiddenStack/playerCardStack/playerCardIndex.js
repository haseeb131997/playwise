import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Routes } from "../../../utils/routes";
import MyStatsTab from "../../drawerStack/profileStack/myProfileTabs/myStatsTab";
import GameCardsScreen from "./gameCard";
import PubgStatsScreen from "../../../components/statsScreens/pubgStatScreen";
import FortniteStatsScreen from "../../../components/statsScreens/fortniteStatsScreen";
import ApexStatsScreen from "../../../components/statsScreens/apexStatsScreen";
import CocStatsScreen from "../../../components/statsScreens/cocStatScreen";
import CSGoStatsScreen from "../../../components/statsScreens/csgoStatsScreen";
import ShareCardScreen from "../../../components/statsScreens/shareCardScreen";


const PlayerCardStack = createStackNavigator();

const PlayerCardNavigator = ({route}) => {

  
    return (
      <PlayerCardStack.Navigator initialRouteName={Routes.tabStack.playerCardStack.gameCardsScreen}>
        <PlayerCardStack.Screen name={Routes.tabStack.playerCardStack.gameCardsScreen} component={GameCardsScreen}  options={{ headerShown: true,}} />
        <PlayerCardStack.Screen name={Routes.tabStack.playerCardStack.myStats.pubg} component={PubgStatsScreen} options={{ headerShown: false,headerTransparent:true,headerTitle:'' }} />
        <PlayerCardStack.Screen name={Routes.tabStack.playerCardStack.myStats.fortnite} component={FortniteStatsScreen} options={{ headerShown: false,headerTransparent:true,headerTitle:'' }} />
        <PlayerCardStack.Screen name={Routes.tabStack.playerCardStack.myStats.apex} component={ApexStatsScreen} options={{ headerShown: false,headerTransparent:true,headerTitle:'', }} />
        <PlayerCardStack.Screen name={Routes.tabStack.playerCardStack.myStats.coc} component={CocStatsScreen} options={{ headerShown: false,headerTransparent:true,headerTitle:'' }} />
        <PlayerCardStack.Screen name={Routes.tabStack.playerCardStack.myStats.csgo} component={CSGoStatsScreen} options={{ headerShown: false,headerTransparent:true,headerTitle:'' }} />
        <PlayerCardStack.Screen name={Routes.drawerStack.profileStack.myStats.shareCardScreen} component={ShareCardScreen} options={{ headerShown: true}} />
      </PlayerCardStack.Navigator>
    )
  }


export default  PlayerCardNavigator;