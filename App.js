import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { ActivityIndicator, useColorScheme } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import store from "./src/app/store";
import AppNavigator from "./src/screens/appIndex";
import { View,Image } from "react-native";
const Firebase = require("./src/firebase/config");
import * as Linking from "expo-linking";
import { ApiCollection } from "./src/configs/envConfig";
import { setActiveUser } from "./src/features/userSlice";
import { Colors, getDarkTheme, getLightTheme } from "./src/utils/colors";
import axios from "axios";


const prefix = Linking.createURL("/");

const App = () => {



  const linking = {

    prefixes: [prefix],
     };

  let persistor = persistStore(store);

  const scheme = useColorScheme();

  const Loader = () => {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:scheme === "dark" ? getDarkTheme.backgroundColor : getLightTheme.backgroundColor}}>
        <Image source={require('./assets/logo/icon.png')} style={{width:200,height:200}}/>
      </View>
    )
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer
          theme={scheme === "dark" ? DarkTheme : DefaultTheme}
          linking={linking}
          fallback={<Loader/>}
        >
          <AppNavigator />
         
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
