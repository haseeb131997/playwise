import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { Colors, getDarkTheme, getLightTheme } from "../../../../utils/colors";
import { DarkModeStatus } from "../../../../app/useStore";
import { Routes } from "../../../../utils/routes";
import TournamentDetailsScreen from './../tournamentDetailsScreen';
import MatchDetails from "./matchDetails";
import TeamGroupDetails from "./teamsGroupDetails";
import WinnerDetails from "./winnerDetails";
const Tab = createMaterialTopTabNavigator();

export default function TournamentTopTabNavigator({ route }) {
  const mode = DarkModeStatus();
  const tabOptions = {
    tabBarIndicatorStyle: { backgroundColor: "white", }

  };

  return (
    <Tab.Navigator
      initialRouteName={Routes.tabStack.tournamentStack.tournamentTopTabStack.tournamentDetailScreen}
      screenOptions={{ tabBarActiveTintColor: "white",pressColor: 'transparent',
      pressOpacity: 1,
      labelStyle: {
        fontSize: 16,
        textTransform: 'none',
      },
      style: {
        backgroundColor: 'white',
        elevation: 1,
      },
      tabStyle: { marginLeft: 5, alignItems: 'center'},
      
        tabBarStyle: {backgroundColor: mode ? getDarkTheme.backgroundColor: Colors.primary, },
      }}
    >
      <Tab.Screen
        name={Routes.tabStack.tournamentStack.tournamentTopTabStack.tournamentDetailScreen}
        component={TournamentDetailsScreen}
        options={tabOptions}
        initialParams={route.params}
      />
      <Tab.Screen
          name={Routes.tabStack.tournamentStack.tournamentTopTabStack.teamsGroupDetails}
          component={TeamGroupDetails}
          options={tabOptions}
          initialParams={route.params}
        />
      <Tab.Screen
        name={Routes.tabStack.tournamentStack.tournamentTopTabStack.matchDetails}
        component={MatchDetails}
        options={tabOptions}
        initialParams={route.params}
      />
        <Tab.Screen
        name={Routes.tabStack.tournamentStack.tournamentTopTabStack.winnerDetails}
        component={WinnerDetails}
        options={tabOptions}
        initialParams={route.params}
      />
    </Tab.Navigator>
  );
}