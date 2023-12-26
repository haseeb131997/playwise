import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  Linking,
  Alert,
  TextInput,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors, getDarkTheme, getLightTheme } from "../../../utils/colors";
import { ApiCollection, envConfig } from "../../../configs/envConfig";
import axios from "axios";
import { DarkModeStatus, UserId, UserToken } from "../../../app/useStore";
import IonIcons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import * as DocumentPicker from "expo-document-picker";
import LoadingModal from "../../../components/loadingModal";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as ImagePicker from "expo-image-picker";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import * as Device from "expo-device";

const EditPCScreen = ({ navigation }) => {
  useEffect(() => {
    getDevice();
  }, []);

  const mode = DarkModeStatus();

  const token = UserToken();
  const currentUserId = UserId();

  const [isLoading, setIsLoading] = useState(false);

  const [cpu, setCpu] = useState("");
  const [gpu, setGpu] = useState("");
  const [ram, setRam] = useState("");
  const [ssd, setSSD] = useState("");
  const [os, setOS] = useState("");
  const [device, setDevice] = useState(null);
  const [systemImage, setSystemImage] = useState(null);

  const getDevice = async () => {
    setIsLoading(true);
    await axios
      .get(
        `${ApiCollection.userController.getPlayerUserInfos}/${currentUserId}/system`,
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((response) => {
        setIsLoading(false);
        if (response.data.data.systemDetail.pc !== undefined) {
          setDevice(response.data.data.systemDetail.pc);
          setCpu(response.data.data.systemDetail.pc.cpu);
          setGpu(response.data.data.systemDetail.pc.gpu);
          setRam(response.data.data.systemDetail.pc.ram);
          setSSD(response.data.data.systemDetail.pc.ssd);
          setOS(response.data.data.systemDetail.pc.windows);
          setSystemImage(response.data.data.systemDetail.pc.image);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setDevice(null);
      });
  };

  const pickCoverImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.cancelled) {
      setSystemImage(result.uri);
    }
  };

  const submit = async () => {
    if (cpu === "" || ram === "" || gpu == "" || ssd == "" || os == "") {
      Alert.alert("Edit Work Profile", "Please fill all fields");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();

    if (systemImage !== null) {
      const imgType = Platform.OS == "android" ? "jpeg" : "jpg";
      const systemImgData = {
        name: `${Date.now()}`,
        uri: systemImage,
        type: `image/${imgType}`,
      };

      formData.append("system", systemImgData);
    }

    formData.append("ram", ram);
    formData.append("cpu", cpu);
    formData.append("gpu", gpu);
    formData.append("ssd", ssd);
    formData.append("windows", os);
    formData.append("device", "pc");

    let fields = {
      responseType: "json",
      headers: {
        "content-type": "multipart/form-data",
        accept: "application/json",
        Authorization: "Bearer " + token,
      },
    };

    await axios
      .put(ApiCollection.userController.editSystemInfo, formData, fields)
      .then((response) => {
        setIsLoading(false);
        Alert.alert("Edit System Info", "System updated successfully");
      })
      .catch((error) => {
        setIsLoading(false);
        Alert.alert("Edit System Info", "Something went wrong");
      });
  };

  return (
    <View style={[styles.page,{backgroundColor:mode?getDarkTheme.backgroundColor:getLightTheme.backgroundColor}]}>
      <LoadingModal modalVisible={isLoading} />
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        style={styles.scrollStyle}
      >
        <View
          style={{ width: Dimensions.get("window").width - 10, paddingTop: 10 }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.heading}>PC Image</Text>
            <TouchableOpacity onPress={pickCoverImage} style={styles.button}>
              <Entypo name="edit" color={Colors.primary} size={18} />
              <Text style={{ color: Colors.primary, marginLeft: 10 }}>
                Upload
              </Text>
            </TouchableOpacity>
          </View>
          {systemImage !== null ? (
            <Image
              source={{ uri: `${systemImage}` }}
              style={{ width: "100%", height: 150, resizeMode: "cover" }}
            />
          ) : (
            <Text style={[styles.heading, { color:mode? "white": "black" }]}>
              Select Image to upload
            </Text>
          )}
        </View>

        <View
          style={{
            width: Dimensions.get("window").width,
            paddingVertical: 10,
            paddingBottom: 50,
          }}
        >
          <View style={{ width: "100%", marginTop: 10 }}>
            <Text style={styles.heading}>CPU</Text>
            <TextInput
              value={cpu}
              onChangeText={(text) => setCpu(text)}
              style={[ styles.input,{ color: mode ? getDarkTheme.color : getLightTheme.color },]}
              placeholderTextColor={mode ? "#595957" : "#DBD8C2"} 
              placeholder={"CPU name"}
            />
          </View>

          <View style={{ width: "100%", marginTop: 10 }}>
            <Text style={styles.heading}>GPU</Text>
            <TextInput
              value={gpu}
              onChangeText={(text) => setGpu(text)}
              style={[ styles.input,{ color: mode ? getDarkTheme.color : getLightTheme.color },]}
              placeholderTextColor={mode ? "#595957" : "#DBD8C2"} 
              placeholder={"GPU"}
            />
          </View>

          <View style={{ width: "100%", marginTop: 10 }}>
            <Text style={styles.heading}>RAM</Text>
            <TextInput
              value={ram}
              onChangeText={(text) => setRam(text)}
              style={[ styles.input,{ color: mode ? getDarkTheme.color : getLightTheme.color },]}
              placeholderTextColor={mode ? "#595957" : "#DBD8C2"}
              placeholder={"Ram"}
            />
          </View>

          <View style={{ width: "100%", marginTop: 10 }}>
            <Text style={styles.heading}>SSD</Text>
            <TextInput
              value={ssd}
              onChangeText={(text) => setSSD(text)}
              style={[ styles.input,{ color: mode ? getDarkTheme.color : getLightTheme.color },]}
              placeholderTextColor={mode ? "#595957" : "#DBD8C2"}
              placeholder={"SSD"}
            />
          </View>

          <View style={{ width: "100%", marginTop: 10 }}>
            <Text style={styles.heading}>OS (Operating System )</Text>
            <TextInput
              value={os}
              onChangeText={(text) => setOS(text)}
              style={[ styles.input,{ color: mode ? getDarkTheme.color : getLightTheme.color },]}
              placeholderTextColor={mode ? "#595957" : "#DBD8C2"}
              placeholder={"Windows"}
            />
          </View>

          <View
            style={{
              width: "100%",
              marginTop: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={submit} style={styles.bigButton}>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "500",
                  fontSize: 16,
                  color: "white",
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const EditMobileScreen = ({ navigation }) => {
  useEffect(() => {
    getDBDevice();
  }, []);

  const mode= DarkModeStatus();

  const token = UserToken();
  const currentUserId = UserId();

  const [isLoading, setIsLoading] = useState(false);

  const [mobileBrand, setMobileBrand] = useState("");
  const [modelName, setModelName] = useState("");
  const [ram, setRam] = useState("");
  const [hdd, setHdd] = useState("");
  const [device, setDevice] = useState(null);
  const [systemImage, setSystemImage] = useState(null);

  const getDBDevice = async () => {
    setIsLoading(true);
    await axios
      .get(
        `${ApiCollection.userController.getPlayerUserInfos}/${currentUserId}/system`,
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((response) => {
        setIsLoading(false);
        if (response.data.data.systemDetail.mobile !== undefined) {
          setMobileBrand(response.data.data.systemDetail.mobile.brand);
          setModelName(response.data.data.systemDetail.mobile.model);
          setRam(response.data.data.systemDetail.mobile.ram);
          setHdd(response.data.data.systemDetail.mobile.hdd);
          setSystemImage(response.data.data.systemDetail.mobile.image);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setDevice(null);
      });
  };

  const getRealDevice = () => {
    setMobileBrand(Device.brand);
    setModelName(Device.modelName);
    setRam(`${Math.round(Device.totalMemory / 1000000000)} GB`);
  };

  const pickCoverImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.cancelled) {
      setSystemImage(result.uri);
    }
  };

  const submit = async () => {
    if (mobileBrand === "" || ram === "" || modelName == "" || hdd == null) {
      Alert.alert("Edit Work Profile", "Please fill all fields");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();

    if (systemImage !== null) {
      const imgType = Platform.OS == "android" ? "jpeg" : "jpg";
      const systemImgData = {
        name: `${Date.now()}`,
        uri: systemImage,
        type: `image/${imgType}`,
      };

      formData.append("system", systemImgData);
    }

    formData.append("ram", ram);
    formData.append("brand", mobileBrand);
    formData.append("model", modelName);
    formData.append("hdd", hdd);
    formData.append("device", "mobile");

    let fields = {
      responseType: "json",
      headers: {
        "content-type": "multipart/form-data",
        accept: "application/json",
        Authorization: "Bearer " + token,
      },
    };

    await axios
      .put(ApiCollection.userController.editSystemInfo, formData, fields)
      .then((response) => {
        setIsLoading(false);
        Alert.alert("Edit System Info", "System updated successfully");
      })
      .catch((error) => {
        setIsLoading(false);
        Alert.alert("Edit System Info", "Something went wrong");
      });
  };

  return (
    <View style={[styles.page,{backgroundColor:mode?getDarkTheme.backgroundColor:getLightTheme.backgroundColor}]}>
      <LoadingModal modalVisible={isLoading} />
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        style={styles.scrollStyle}
      >
        <View
          style={{ width: Dimensions.get("window").width - 10, paddingTop: 10 }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.heading}>Mobile Image</Text>
            <TouchableOpacity onPress={pickCoverImage} style={styles.button}>
              <Entypo name="edit" color={Colors.primary} size={18} />
              <Text style={{ color: Colors.primary, marginLeft: 10 }}>
                Upload
              </Text>
            </TouchableOpacity>
          </View>
          {systemImage !== null ? (
            <Image
              source={{ uri: `${systemImage}` }}
              style={{ width: "100%", height: 150, resizeMode: "cover" }}
            />
          ) : (
            <Text style={[styles.heading, { color:mode?"white": "black" }]}>
              Select Image to upload
            </Text>
          )}
        </View>

        <View
          style={{
            width: Dimensions.get("window").width,
            paddingVertical: 10,
            paddingBottom: 50,
          }}
        >
          <View style={{ width: "100%", marginTop: 10 }}>
            <Text style={styles.heading}>Mobile Brand</Text>
            <TextInput
              value={mobileBrand}
              onChangeText={(text) => setMobileBrand(text)}
              style={[ styles.input,{ color: mode ? getDarkTheme.color : getLightTheme.color },]}
              placeholderTextColor={mode ? "#595957" : "#DBD8C2"}
              placeholder={"CPU name"}
            />
          </View>

          <View style={{ width: "100%", marginTop: 10 }}>
            <Text style={styles.heading}>Model Name</Text>
            <TextInput
              value={modelName}
              onChangeText={(text) => setModelName(text)}
              style={[ styles.input,{ color: mode ? getDarkTheme.color : getLightTheme.color },]}
              placeholderTextColor={mode ? "#595957" : "#DBD8C2"}
              placeholder={"GPU Title"}
            />
          </View>

          <View style={{ width: "100%", marginTop: 10 }}>
            <Text style={styles.heading}>RAM</Text>
            <TextInput
              value={ram}
              onChangeText={(text) => setRam(text)}
              style={[ styles.input,{ color: mode ? getDarkTheme.color : getLightTheme.color },]}
              placeholderTextColor={mode ? "#595957" : "#DBD8C2"}
              placeholder={"Ram Title"}
            />
          </View>

          <View style={{ width: "100%", marginTop: 10 }}>
            <Text style={styles.heading}>HDD</Text>
            <TextInput
              value={hdd}
              onChangeText={(text) => setHdd(text)}
              style={[ styles.input,{ color: mode ? getDarkTheme.color : getLightTheme.color },]}
              placeholderTextColor={mode ? "#595957" : "#DBD8C2"}
              placeholder={"SSD Title"}
            />
          </View>

          <View
            style={{
              width: "100%",
              marginTop: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={getRealDevice}
              style={styles.bigButtonOutline}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "500",
                  fontSize: 16,
                  color: Colors.primary,
                }}
              >
                Retrieve Device specs
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={submit} style={styles.bigButton}>
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "500",
                  fontSize: 16,
                  color: "white",
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const Tab = createMaterialTopTabNavigator();

export default function EditSystem({ route }) {
  const mode = DarkModeStatus();

  const tabOptions = {
    tabBarIndicatorStyle: { backgroundColor: Colors.primary },
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: mode ? getDarkTheme.color : getLightTheme.color,
        tabBarStyle: {
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        },
      }}
    >
      <Tab.Screen
        name="Edit PC"
        component={EditPCScreen}
        options={tabOptions}
      />
      <Tab.Screen
        name="Edit Mobile"
        component={EditMobileScreen}
        options={tabOptions}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  button: {
    padding: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderColor: Colors.primary,
    borderWidth: 1,
    margin: 10,
  },
  heading: {
    fontSize: 14,
    fontWeight: "500",
    margin: 10,
    color: Colors.primary,
  },

  input: {
    width: "90%",
    padding: 10,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  bigButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 15,
    marginTop: 30,
    width: "90%",
  },
  bigButtonOutline: {
    borderColor: Colors.primary,
    borderRadius: 8,
    borderWidth: 1,
    padding: 15,
    marginTop: 30,
    width: "90%",
  },

  smallButtonsFilled: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    width: "60%",
    marginTop: 10,
    margin: 10,
    padding: 10,
  },

  smallButtonsEmpty: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    width: "60%",
    marginTop: 10,
    margin: 10,
    padding: 10,
  },
});
