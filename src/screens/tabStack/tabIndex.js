import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Entypo from '@expo/vector-icons/Entypo'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { Routes } from '../../utils/routes';
import { Colors, getDarkTheme, getLightTheme } from '../../utils/colors';
import LeaderboardNavigator from './leaderboardStack/leaderboardIndex';
import DiscoverNavigator from './discoverStack/discoverIndex';
import HomeNavigator from './homeStack/homeIndex';
import AddPostScreen from './addPost/addPostScreen';
import { Dimensions } from 'react-native';
import { View ,Text,StyleSheet,TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CustomIcon } from '../../components/customIconPack';
import TournamentNavigator from './tournamentStack.js/tournamentIndex';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import { DarkModeStatus } from '../../app/useStore';


const BottomTabStack = createBottomTabNavigator();

export default function BottomTabNavigator() {

const mode = DarkModeStatus()
  const [modalVisible, setModalVisible] = React.useState(false);


  const tabProperties={
    headerShown: false,
  }

  const smallTabStyle={
    tabBarShowLabel:false,

  }

  const CornerTriangle =()=>{


    const styles = StyleSheet.create({
      headerTriangleCorne:{
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 0,
        borderRightWidth: 25,
        borderTopWidth: 54.6,
        borderRightColor: "transparent",
        borderTopColor:'blue',
        position:'absolute',
        left:-21,
        zIndex:-10,
        borderTopColor: '#F12422',
        transform: [{ rotate: "180deg" }],
      },

    })

    return(
      <View style={styles.headerTriangleCorne}></View>
    )


   
  }
  


  return (
   <>
      <Modal isVisible={modalVisible} onBackButtonPress={()=>setModalVisible(false)} onBackdropPress={()=>setModalVisible(false)} style={{justifyContent:'center',alignItems:'center'}}>
          <View style={{width:'95%',borderRadius:5,padding:15,backgroundColor:mode?getDarkTheme.backgroundColor:getLightTheme.backgroundColor,borderColor:Colors.primary,borderWidth:1}}>
            <Text style={{fontWeight:'bold',color:Colors.primary,fontSize:18,marginBottom:10}}>Note</Text>
            <Text style={{color:mode?getDarkTheme.color:getLightTheme.color}}>
              Recommended max size for all videos is 150MB.
            </Text>
          </View>
        </Modal>
   

      <BottomTabStack.Navigator 
          initialRouteName={Routes.tabStack.tag}
          screenOptions={{  
            headerStyle: { backgroundColor: mode?'#424240':"white" },
            headerTintColor:  mode ? getDarkTheme.color : getLightTheme.color,
            tabBarHideOnKeyboard: true,
            tabBarShowLabel:false,
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor:  'grey',
            //tabBarActiveBackgroundColor:'white',
            tabBarStyle:{backgroundColor: mode ? getDarkTheme.backgroundColor : getLightTheme.backgroundColor}
            }} >

        <BottomTabStack.Screen name={Routes.tabStack.homeStack.tag} component={HomeNavigator} 
            options={({ navigation, route }) => ({...tabProperties,headerShown:false,
            tabBarIcon:({size,color,focused })=> <CustomIcon name='home' active={focused} />})}
        />


        <BottomTabStack.Screen name={Routes.tabStack.tournamentStack.tag} component={TournamentNavigator} 
          options={({ navigation, route }) => ({...tabProperties,headerTitle:'My Profile',
          tabBarIcon:({size,color,focused })=> <CustomIcon name='tournament' active={focused} modeTye={mode} color={color} />})}
        />



{/* <FontAwesome5 name={'home'} size={22} color={color}  /> */}
        <BottomTabStack.Screen name={Routes.tabStack.leaderBoardStack.tag} component={LeaderboardNavigator} 
            options={({ navigation, route }) => ({...tabProperties,headerTitle:'LeaderBoard',
            tabBarIcon:({size,color,focused })=> <CustomIcon name='leaderboard' active={focused} /> })}
        />  

      <BottomTabStack.Screen name={"Placeholder0"} component={AddPostScreen}  
            options={({ navigation, route }) => ({...tabProperties,  headerTitle:'Create a Post',
            headerShown:true,
            tabBarLabel:'Post',
            tabBarIcon:({size,color,focused })=> <Entypo name={'squared-plus'} size={25}  color={mode?'black':'white'} /> })}
        />

    <BottomTabStack.Screen name={"Placeholder1"} component={AddPostScreen}  
            options={({ navigation, route }) => ({...tabProperties,  headerTitle:'Create a Post',
            headerShown:true,
            tabBarLabel:'Post',
            tabBarIcon:({size,color,focused })=> <Entypo name={'squared-plus'} size={25}  color={ mode?getDarkTheme.backgroundColor: 'white'} /> })}
        />


         <BottomTabStack.Screen name={Routes.tabStack.addPostStack.addPostScreen} component={AddPostScreen}  
            options={({ navigation, route }) => ({
              tabBarItemStyle:{
                position:'absolute',
                left:Dimensions.get('window').width/1.5,
                bottom:0,
                height:60,
                width:150,
              },
              headerTitle:'Create a Post',
              headerShown:true,
              tabBarLabel:'Post',
              headerRight:()=>(
                <TouchableOpacity onPress={()=>setModalVisible(true)} style={{marginHorizontal:10}}>
                  <MaterialIcons name="info" size={24} color={Colors.primary} />
                </TouchableOpacity>
              ),

            tabBarIcon:({ color })=> 
            <View style={{flexDirection:'row',justifyContent:'center',marginLeft:10,alignItems:'flex-end'}}>
              
              <CornerTriangle/>
              <LinearGradient colors={['#F12422', '#F14722',"#F16B22","#F29923"]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={{flexDirection:'row',height:55,borderTopLeftRadius:10,width:'93%',justifyContent:'center',alignItems:'center',backgroundColor:Colors.primary}}>
                <Entypo name={'squared-plus'} size={25}  color={'white'} />
                <Text style={{color:'white',marginLeft:10,fontSize:18}}>Post</Text>
              </LinearGradient>
              
            </View>
             })}
        />


      </BottomTabStack.Navigator>
      </>
  );
}