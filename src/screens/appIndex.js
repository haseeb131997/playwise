import React,{useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '../utils/routes';
import OnBoardNavigator from './onBoardingStack/onBoardIndex';
import BottomTabNavigator from './tabStack/tabIndex';
import { DarkModeStatus, LoggedIn } from '../app/useStore';
import PostNavigator from './tabBarHiddenStack/postStack/postIndex';
import PlayerNavigator from './tabBarHiddenStack/playerStack/playerIndex';
import ChatNavigator from './tabBarHiddenStack/chatStack/chatIndex';
import SearchNavigator from './tabBarHiddenStack/searchStack/searchIndex';
import DrawerStack from './drawerStack/drawerIndex';
import CommentScreen from './tabBarHiddenStack/postStack/commentScreen';
import { TouchableOpacity } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import TournamentTopTabNavigator from './tabStack/tournamentStack.js/tournamentTopTabStack/tournamentTopTabIndex';
import TournamentDetailsScreen from './tabStack/tournamentStack.js/tournamentDetailsScreen';
import RegisterTournamentScreen from './tabStack/tournamentStack.js/registerScreen';
import UpdateEmailScreen from './drawerStack/settingsStack/updateEmailScreen';
import { getDarkTheme, getLightTheme } from '../utils/colors';
import * as Notifications from "expo-notifications";
import { UserToken } from '../app/useStore';
import { useNavigation } from '@react-navigation/native';

const AppStack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


const AppNavigator = () => {

  const token = UserToken();
  const navigation = useNavigation();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const notification = response.notification.request.content.data;
        if (token !== null) {
          if (notification.type == "post") {
            navigation.navigate(Routes.tabBarHiddenScreens.postStack.tag, {
              postId: notification.data.postId,
            });
          }
          if (notification.type == "follow") {
            navigation.navigate(Routes.tabBarHiddenScreens.playerStack.tag, {
              userId: notification.sender._id,
            });
          } else {
            navigation.navigate(Routes.tabStack.homeStack.notificationScreen);
          }
        }
        else { navigation.replace(Routes.onBoardingStack.tag) }
      }
    );
    return () => subscription.remove();
  }, []);

  
  const loggedIn = LoggedIn();

  const mode = DarkModeStatus();
  
    return (
      <AppStack.Navigator initialRouteName={loggedIn?Routes.drawerStack.drawerTag :Routes.onBoardingStack.tag} screenOptions={{
        headerTintColor:  mode ? getDarkTheme.color : getLightTheme.color}}>
        <AppStack.Screen name={Routes.onBoardingStack.tag} component={OnBoardNavigator} options={{ headerShown: false }} />
        <AppStack.Screen name={Routes.drawerStack.drawerTag} component={DrawerStack} options={{ headerShown: false }} />
        
        {/* Stack for hidden Tab bar */}
        <AppStack.Screen name={Routes.tabBarHiddenScreens.postStack.tag} component={PostNavigator} options={{ headerShown: false }}/>
        <AppStack.Screen name={Routes.tabBarHiddenScreens.playerStack.tag} component={PlayerNavigator} options={{ headerShown: false }} />
        <AppStack.Screen name={Routes.tabBarHiddenScreens.chatStack.tag} component={ChatNavigator} options={{ headerShown: false }} />
        <AppStack.Screen name={Routes.tabBarHiddenScreens.searchStack.tag} component={SearchNavigator}  options={{ headerShown: false }} />
        <AppStack.Screen name={Routes.sharedPostView}  component={CommentScreen} 
          options={({route,navigation})=>({ 
            headerShown: true,
            headerTitle:'Post',
            headerStyle:{
              backgroundColor:!mode ? getDarkTheme.color : getLightTheme.color,
            },
            headerTintColor:mode ? getDarkTheme.color : getLightTheme.color,
            headerLeft:()=>null
            })} />
             <AppStack.Screen name={Routes.sharedTournamentView} component={TournamentTopTabNavigator} 
                options={({route,navigation})=>({ 
                headerShown: true,
                headerTitle:'Tournament Details',
                headerStyle:{
                  backgroundColor:!mode ? getDarkTheme.color : getLightTheme.color,
                },
                headerTintColor:mode ? getDarkTheme.color : getLightTheme.color,
                headerLeft:()=>null
            })} />

            <AppStack.Screen name={Routes.tabStack.tournamentStack.registerScreen} component={RegisterTournamentScreen}  options={({ navigation, route })=>({ headerShown: true,})} />
            <AppStack.Screen name={Routes.tabStack.tournamentStack.updateEmailScreen} component={UpdateEmailScreen}  options={({ navigation, route })=>({ headerShown: true,})} />

      </AppStack.Navigator>
    )
  }


export default AppNavigator;