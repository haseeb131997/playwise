import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Routes } from '../../utils/routes';
import { LogBox, View,Text } from 'react-native';
import LoginScreen from './loginScreen';
import SignUpScreen from './signUpScreen';
import ForgotPasswordScreen from './forgotPassword';
import PhoneVerifyScreen from './phoneVerifyScreen';
import UsernameScreen from './userNameScreen';
import PersonalDetailsScreen from './personalDetailsScreen';
import AddressScreen from './addressScreen';
import GamingGenreScreen from './gamingGenreScreen';
import SocialScreen from './socialScreen';
import FinalizeScreen from './finalScreen';
import PhoneScreen from './phoneScreen';
import OTPScreen from './otpScreen';
import ReferalScreen from './referalScreen';
import ForgotPwdOtpScreen from './forgotPwdOtpScreen';
import ResetPasswordScreen from './resetPasswordScreen';



const OnBoardStack = createStackNavigator();



const OnBoardNavigator = () => {
  

  
    return (
      <OnBoardStack.Navigator initialRouteName={Routes.onBoardingStack.loginScreen}>
        <OnBoardStack.Screen name={Routes.onBoardingStack.loginScreen} component={LoginScreen} options={{ headerShown: false }} />
        <OnBoardStack.Screen name={Routes.onBoardingStack.signUpScreen} component={SignUpScreen} options={{ headerShown: false }} />
        <OnBoardStack.Screen name={Routes.onBoardingStack.forgetPassword} component={ForgotPasswordScreen} options={{ headerShown: false }} />        
        <OnBoardStack.Screen name={Routes.onBoardingStack.forgotPwdOtpScreen} component={ForgotPwdOtpScreen} options={{ headerShown: false }} />        
        <OnBoardStack.Screen name={Routes.onBoardingStack.resetPasswordScreen} component={ResetPasswordScreen} options={{ headerShown: false }} />
        <OnBoardStack.Screen name={Routes.onBoardingStack.phoneVerify} component={PhoneVerifyScreen} options={{ headerShown: true }} />
        <OnBoardStack.Screen name={Routes.onBoardingStack.userNameScreen} component={UsernameScreen} options={{ headerShown: true }} />
        {/* <OnBoardStack.Screen name={Routes.onBoardingStack.referralCodeScreen} component={ReferalScreen} options={{ headerShown: true }} /> */}
        <OnBoardStack.Screen name={Routes.onBoardingStack.phoneScreen} component={PhoneScreen} options={{ headerShown: true }} />
        <OnBoardStack.Screen name={Routes.onBoardingStack.otpScreen} component={OTPScreen} options={{ headerShown: true }} />
        {/* <OnBoardStack.Screen name={Routes.onBoardingStack.personalDetails} component={PersonalDetailsScreen} options={{ headerShown: true }} /> */}
        {/* <OnBoardStack.Screen name={Routes.onBoardingStack.addressScreen} component={AddressScreen} options={{ headerShown: true }} />
        <OnBoardStack.Screen name={Routes.onBoardingStack.gamingGenreScreen} component={GamingGenreScreen} options={{ headerShown: true }} />
        <OnBoardStack.Screen name={Routes.onBoardingStack.socialScreen} component={SocialScreen} options={{ headerShown: true }} /> */}
        <OnBoardStack.Screen name={Routes.onBoardingStack.finalScreen} component={FinalizeScreen} options={{ headerShown: true }} />
      </OnBoardStack.Navigator>
    )
  }


export default OnBoardNavigator;