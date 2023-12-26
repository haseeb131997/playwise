import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '../../../utils/routes';
import EditProfileScreen from './editProfileScreen';
import EditPrefrenceScreen from './editPrefScreen';
import ChangePasswordScreen from './securityScreen';
import SettingScreen from './settingScreen';
import { View,TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo'
import { Colors } from '../../../utils/colors';
import EditWorkScreen from './editWorkProfile';
import EditSystem from './editSystem';
import UpdatePhoneNumberScreen from './updatePhoneNumber';
import PhoneVerifyScreen from '../../onBoardingStack/phoneVerifyScreen';
import PhoneVerifySettingScreen from './otpScreen';
import BlockedUserScreen from './blockedUserScreen';
import AboutAppScreen from './aboutAppScreen';
import UpdateEmailScreen from './updateEmailScreen';

const SettingStack = createStackNavigator();


const SettingNavigator = () => {
  

  
    return (
      <SettingStack.Navigator initialRouteName={Routes.drawerStack.settingStack.tag} 
        screenOptions={{
          headerStyle: { backgroundColor:  Colors.gradientPack[1] },
          headerTintColor:'white'
        }}
      >

        <SettingStack.Screen name={Routes.drawerStack.settingStack.settingScreen} component={SettingScreen} 

          options={({route,navigation})=>({ 
            headerLeft: ({route}) => (
              <View style={{flexDirection:'row',alignItems:'center',}}>
                  <TouchableOpacity onPress={()=>navigation.openDrawer()}>
                      <Entypo name="menu" size={28} style={{marginLeft:15}} color={'white'} />
                  </TouchableOpacity>
              </View>
          ),
            headerShown: true})} />
        <SettingStack.Screen name={Routes.drawerStack.settingStack.editProfile} component={EditProfileScreen} options={{ headerShown: true}} />
        <SettingStack.Screen name={Routes.drawerStack.settingStack.blockedUser} component={BlockedUserScreen} options={{ headerShown: true}} />
        <SettingStack.Screen name={Routes.drawerStack.settingStack.editWorkProfile} component={EditWorkScreen} options={{ headerShown: true}} />
        <SettingStack.Screen name={Routes.drawerStack.settingStack.editSystemInfo} component={EditSystem} options={{ headerShown: true}} />
        <SettingStack.Screen name={Routes.drawerStack.settingStack.editPref} component={EditPrefrenceScreen} options={{ headerShown: true}} />
        <SettingStack.Screen name={Routes.drawerStack.settingStack.securityScreen} component={ChangePasswordScreen} options={{ headerShown: true}} />
        <SettingStack.Screen name={Routes.drawerStack.settingStack.updatePhone} component={UpdatePhoneNumberScreen} options={{ headerShown: true}} />
        <SettingStack.Screen name={Routes.drawerStack.settingStack.updateEmail} component={UpdateEmailScreen} options={{ headerShown: true}} />
        <SettingStack.Screen name={Routes.drawerStack.settingStack.verifyScreen} component={PhoneVerifySettingScreen} options={{ headerShown: true}} />
        <SettingStack.Screen name={Routes.drawerStack.settingStack.aboutUsScreen} component={AboutAppScreen} options={{ headerShown: true}} />
      </SettingStack.Navigator>
    )
  }


export default  SettingNavigator;