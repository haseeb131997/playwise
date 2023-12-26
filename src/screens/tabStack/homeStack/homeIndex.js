import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '../../../utils/routes';
import { View,Text,TouchableOpacity,Image, Dimensions,StyleSheet, Platform,StatusBar } from 'react-native';
import { Colors, getDarkTheme, getLightTheme } from '../../../utils/colors';
import homeLogo from '../../../../assets/logo/homeLogo.png';
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import HomeScreen from './homeScreen';
import NotificationScreen from './notificationsScreen';
import Entypo from '@expo/vector-icons/Entypo'
import { envConfig, ScreenWidthResponser } from '../../../configs/envConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { Header } from '@react-navigation/stack';
import ChatBadge from '../../../components/chatBadgeHandler';
import NotificationBadge from '../../../components/notificationsBadgeHandler';
import { SafeAreaView } from 'react-native';
import Constants from 'expo-constants';
import ProfilNavigator from '../../drawerStack/profileStack/profileIndex';
import DiscoverNavigator from '../discoverStack/discoverIndex';
import PlayerCardNavigator from '../../tabBarHiddenStack/playerCardStack/playerCardIndex';
import { DarkModeStatus } from '../../../app/useStore';


const shadowAndroid = {
  shadowColor: 'black',
    shadowOpacity: 1,
    elevation: 6,
}

const shadowIos = {
  shadowColor: 'grey',
  shadowOpacity: 0.8,
  shadowRadius: 3,
  shadowOffset: { width: 8, height: 5},
}

const HomeStack = createStackNavigator();

const CornerTriangle =({modeType})=>{

  const mode = DarkModeStatus()
  const styles = StyleSheet.create({
    headerTriangleCorne:{
      width: 0,
      height: 0,
      backgroundColor:  "transparent",
      borderStyle: "solid",
      borderLeftWidth: 0,
      borderRightWidth: 25,
      borderTopWidth: 50,
      borderRightColor: "transparent",
      borderTopColor: modeType ? getDarkTheme.backgroundColor : 'whitesmoke',
      transform: [{ rotate: "180deg" }],
    },

  })

  return(
    <View style={styles.headerTriangleCorne}></View>
  )

}

const GradientHeader = props => (
  <View style={{marginTop:Constants.statusBarHeight}}>
    <LinearGradient colors={Colors.gradientPack} 
      start={{x: 0, y: 0}} end={{x: 1, y: 0}}
      style={[StyleSheet.absoluteFill ]}
    />
    <Header {...props}  />
  </View>
);



const HomeNavigator = () => {
  const mode = DarkModeStatus()
    return (

      <HomeStack.Navigator initialRouteName={Routes.tabStack.homeStack.homeScreen} screenOptions={{headerStyle: { backgroundColor: mode?'#424240':"white" },
      headerTintColor:  mode ? getDarkTheme.color : getLightTheme.color,}}>
        <HomeStack.Screen name={Routes.tabStack.homeStack.homeScreen} component={HomeScreen}  
        options={({ navigation, route })=>({ headerShown: true,headerStatusBarHeight:0,headerTitle:'',
        header: (props) => <GradientHeader {...props} />,
        headerStyle: [{
          elevation: 0, // remove shadow on Android
          shadowOpacity: 0, // remove shadow on iOS
          backgroundColor: 'transparent',

        },Platform.OS=='android' && {height:50}],
          headerLeft: ({route}) => (
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-start'}}>
                <TouchableOpacity onPress={()=>navigation.openDrawer()}>
                    <Entypo name="menu" size={25} style={{marginLeft:10}} color={'white'} />
                </TouchableOpacity>
                
                <NotificationBadge/>

                <ChatBadge/>

                <TouchableOpacity onPress={()=>navigation.navigate(Routes.tabBarHiddenScreens.searchStack.tag)}>
                    <Feather name={'search'} size={22} style={{marginLeft:15}} color={'white'} />
                </TouchableOpacity>
          

     
            </View>
        ),
        headerRight: () => (
            <View style={{flexDirection:'row',alignItems:'flex-end',backgroundColor: 'transparent',height:'100%',width:Dimensions.get('screen').width/1.8,justifyContent:'center'}}>
              <CornerTriangle modeType ={mode} />
              <View style={{backgroundColor: mode ? getDarkTheme.backgroundColor : 'whitesmoke',height:'100%',width:'90%',justifyContent:'center',alignItems:'center'}}>
                <Image source={homeLogo} style={[{width:ScreenWidthResponser(210,200,180),height:30}]}/>
              </View>
              
            </View>
            
        ),
        })} />
         <HomeStack.Screen name={Routes.tabStack.homeStack.notificationScreen} component={NotificationScreen} options={{ headerShown: true,}} />
         <HomeStack.Screen name={Routes.tabStack.discoverStack.tag} component={DiscoverNavigator} options={{ headerShown: false,}} />
         <HomeStack.Screen name={Routes.tabStack.playerCardStack.tag} component={PlayerCardNavigator} options={{ headerShown: false,}} />
      </HomeStack.Navigator>

    )
  }


export default  HomeNavigator;