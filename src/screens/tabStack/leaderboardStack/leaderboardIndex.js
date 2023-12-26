import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Routes } from "../../../utils/routes";
import LeaderBoardScreen from "./leaderBoardScreen";
import Modal from "react-native-modal";
import { TouchableOpacity, View, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import { DarkModeStatus } from "../../../app/useStore";

const LeaderBoardStack = createStackNavigator();

const LeaderboardNavigator = () => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const mode = DarkModeStatus();

  return (
    <>
      <Modal
        isVisible={modalVisible}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <View
          style={{
            width: "95%",
            borderRadius: 5,
            padding: 15,
            backgroundColor: mode
              ? getDarkTheme.backgroundColor
              : getLightTheme.backgroundColor,
            borderColor: Colors.primary,
            borderWidth: 1,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: Colors.primary,
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            Note
          </Text>
          <Text
            style={{ color: mode ? getDarkTheme.color : getLightTheme.color }}
          >
            Changes in board data and updates are subject to change by official
            game publishers, PlayWise doesn't change data or update data at
            their end as all details are provided by official publishers
          </Text>
        </View>
      </Modal>

      <LeaderBoardStack.Navigator
        initialRouteName={Routes.tabStack.leaderBoardStack.leaderBoardScreen} screenOptions={{headerStyle: { backgroundColor: mode?'#424240':"white" },
        headerTintColor:  mode ? getDarkTheme.color : getLightTheme.color,}}
      >
        <LeaderBoardStack.Screen
          name={Routes.tabStack.leaderBoardStack.leaderBoardScreen}
          component={LeaderBoardScreen}
          options={({}) => ({
            headerShown: true,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{ marginHorizontal: 10 }}
              >
                <MaterialIcons name="info" size={24} color={Colors.primary} />
              </TouchableOpacity>
            ),
          })}
        />
      </LeaderBoardStack.Navigator>
    </>
  );
};

export default LeaderboardNavigator;
