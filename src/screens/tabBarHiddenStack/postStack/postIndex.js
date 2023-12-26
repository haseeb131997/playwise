import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '../../../utils/routes';
import PlayerNavigator from '../playerStack/playerIndex';
import CommentScreen from './commentScreen';
import EditPostScreen from './editPostScreen';
import FullscreenView from './fullscreenView';

import PostLikesScreen from './likedUsers';
import RePostScreen from './repostScreen';
import DiscoverScrollScreen from './discoverScrollScreen';
import HorizontalView from './horizontalView';
import { DarkModeStatus } from '../../../app/useStore';
import { getDarkTheme, getLightTheme } from '../../../utils/colors';

const PostStack = createStackNavigator();

const PostNavigator = ({route}) => {

  const mode = DarkModeStatus();
    return (
      <PostStack.Navigator initialRouteName={route.params.target} screenOptions={{headerStyle: { backgroundColor: mode?'#424240':"white" },
        headerTintColor:  mode ? getDarkTheme.color : getLightTheme.color,}}>
        <PostStack.Screen initialParams={route.params} name={Routes.tabBarHiddenScreens.postStack.commentScreen} screenOptions={{
        headerMode: 'screen',
        headerTintColor: mode?getDarkTheme.color:getLightTheme.color,
        headerStyle: { backgroundColor: 'black' }}}component={CommentScreen}  options={{ headerShown: true,headerTitle:""}} />
        <PostStack.Screen initialParams={route.params} name={Routes.tabBarHiddenScreens.postStack.editPostScreen} component={EditPostScreen} options={{ headerShown: true }} screenOptions={{headerStyle: { backgroundColor: mode?'#424240':"white" },
        headerTintColor:  mode ? getDarkTheme.color : getLightTheme.color,}}/>
        <PostStack.Screen initialParams={route.params} name={Routes.tabBarHiddenScreens.postStack.repostScreen} component={RePostScreen} options={{ headerShown: true }} screenOptions={{headerStyle: { backgroundColor: mode?'#424240':"white" },
        headerTintColor:  mode ? getDarkTheme.color : getLightTheme.color,}}/>
        <PostStack.Screen initialParams={route.params} name={Routes.tabBarHiddenScreens.postStack.postLikes} component={PostLikesScreen} options={{ headerShown: true }} screenOptions={{headerStyle: { backgroundColor: mode?'#424240':"white" },
        headerTintColor:  mode ? getDarkTheme.color : getLightTheme.color,}}/>
        <PostStack.Screen initialParams={route.params}   name={Routes.tabBarHiddenScreens.postStack.fullScreenView} component={FullscreenView}
         options={({route,navigation})=>({ 
          headerTransparent:true,
          headerShown:false,
          })} />

        <PostStack.Screen initialParams={route.params}   name={Routes.tabBarHiddenScreens.postStack.horizontalView} component={HorizontalView}
         options={({route,navigation})=>({ 
          headerTransparent:true,
          headerShown:false,
          })} />
          <PostStack.Screen initialParams={route.params}   name={Routes.tabBarHiddenScreens.postStack.discoverScrollScreen} component={DiscoverScrollScreen}
         options={({route,navigation})=>({ 
          headerTransparent:true,
          headerShown:false,
          })} screenOptions={{headerStyle: { backgroundColor: mode?'#424240':"white" },
          headerTintColor:  mode ? getDarkTheme.color : getLightTheme.color,}}/>

        <PostStack.Screen name={Routes.tabBarHiddenScreens.playerStack.tag} component={PlayerNavigator} options={{ headerShown: false }} />
      </PostStack.Navigator>
    )
  }


export default  PostNavigator;