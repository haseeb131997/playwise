import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Colors, getDarkTheme, getLightTheme } from "../../../../utils/colors";
import { ApiCollection } from "../../../../configs/envConfig";
import { DarkModeStatus, UserToken } from "../../../../app/useStore";
import axios from "axios";
import { styles } from "./TabStyle";
import { UserId } from "../../../../app/useStore";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();

export default function MyDevicesTab(props) {
  useEffect(() => {
    getDevice();
  }, []);

  const mode = DarkModeStatus();

  const token = UserToken();
  const currentUserId = UserId();

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);

  const getDevice = async () => {
    setLoading(true);
    await axios
      .get(
        `${ApiCollection.userController.getPlayerUserInfos}/${currentUserId}/system`,
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((response) => {
        if (
          response.data.data.systemDetail.pc == null &&
          response.data.data.systemDetail.mobile == null
        ) {
          setDevice(null);
        } else {
          setDevice(response.data.data.systemDetail);
        }

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setDevice(null);
      });
  };

  const tabList = [{ name: "PC" }, { name: "Mobile" }];

  const PCSpecs = ({ pcDetails }) => {
    return (
      <View style={{ width: "100%", paddingHorizontal: 15 }}>
        <View
          style={{
            width: "100%",
            marginTop: 0,
            marginBottom: 20,
            borderRadius: 8,
            backgroundColor: "white",
            flexDirection: "column",
          }}
        >
          {pcDetails.image !== null && (
            <Image
              source={{ uri: pcDetails.image }}
              style={{
                width: "100%",
                height: 300,
                borderRadius: 8,
                resizeMode: "contain",
              }}
            />
          )}

          <View>
            <View style={{ width: "100%", marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 15,
                  color: Colors.primary,
                  fontWeight: "500",
                }}
              >
                CPU
              </Text>
              <Text
                style={{
                  paddingVertical: 5,
                  fontSize: 17,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                {pcDetails.cpu}
              </Text>
            </View>

            <View style={{ width: "100%", marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 15,
                  color: Colors.primary,
                  fontWeight: "500",
                }}
              >
                GPU
              </Text>
              <Text
                style={{
                  paddingVertical: 5,
                  fontSize: 17,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                {pcDetails.gpu}
              </Text>
            </View>

            <View style={{ width: "100%", marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 15,
                  color: Colors.primary,
                  fontWeight: "500",
                }}
              >
                Ram
              </Text>
              <Text
                style={{
                  paddingVertical: 5,
                  fontSize: 17,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                {pcDetails.ram}
              </Text>
            </View>

            <View style={{ width: "100%", marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 15,
                  color: Colors.primary,
                  fontWeight: "500",
                }}
              >
                SSD
              </Text>
              <Text
                style={{
                  paddingVertical: 5,
                  fontSize: 17,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                {pcDetails.ssd}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const MobileSpecs = ({ mobileDetails }) => {
    return (
      <View style={{ width: "100%", paddingHorizontal: 15 }}>
        <View
          style={{
            width: "100%",
            marginTop: 0,
            marginBottom: 20,
            borderRadius: 8,
            backgroundColor: "white",
            flexDirection: "column",
          }}
        >
          {mobileDetails.image !== null && (
            <Image
              source={{ uri: mobileDetails.image }}
              style={{
                width: "100%",
                height: 300,
                borderRadius: 8,
                resizeMode: "contain",
              }}
            />
          )}

          <View>
            <View style={{ width: "100%", marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 15,
                  color: Colors.primary,
                  fontWeight: "500",
                }}
              >
                Mobile Brand
              </Text>
              <Text
                style={{
                  paddingVertical: 5,
                  fontSize: 17,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                {mobileDetails.brand}
              </Text>
            </View>

            <View style={{ width: "100%", marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 15,
                  color: Colors.primary,
                  fontWeight: "500",
                }}
              >
                Model Name
              </Text>
              <Text
                style={{
                  paddingVertical: 5,
                  fontSize: 17,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                {mobileDetails.model}
              </Text>
            </View>

            <View style={{ width: "100%", marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 15,
                  color: Colors.primary,
                  fontWeight: "500",
                }}
              >
                RAM
              </Text>
              <Text
                style={{
                  paddingVertical: 5,
                  fontSize: 17,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                {mobileDetails.ram}
              </Text>
            </View>

            <View style={{ width: "100%", marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 15,
                  color: Colors.primary,
                  fontWeight: "500",
                }}
              >
                HDD
              </Text>
              <Text
                style={{
                  paddingVertical: 5,
                  fontSize: 17,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                {mobileDetails.hdd}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        backgroundColor: mode
          ? getDarkTheme.backgroundColor
          : getLightTheme.backgroundColor,
      }}
    >
      <Text style={styles.tabHead}>System Info</Text>
      {!loading ? (
        device !== null ? (
          <View style={{ marginTop: 20, width: "100%" }}>
            <View
              style={{
                width: "95%",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                backgroundColor: "white",
                borderBottomColor: "whitesmoke",
                borderBottomWidth: 1,
              }}
            >
              <TouchableOpacity
                onPress={() => setCurrentTab(0)}
                style={[
                  { width: "50%" },
                  tabList[currentTab].name == "PC" && {
                    borderBottomColor: Colors.primary,
                    borderBottomWidth: 2,
                  },
                ]}
              >
                <Text
                  style={{
                    padding: 10,
                    fontSize: 16,
                    textAlign: "center",
                    color:
                      tabList[currentTab].name == "PC"
                        ? Colors.primary
                        : "black",
                  }}
                >
                  PC
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCurrentTab(1)}
                style={[
                  { width: "50%" },
                  tabList[currentTab].name == "Mobile" && {
                    borderBottomColor: Colors.primary,
                    borderBottomWidth: 2,
                  },
                ]}
              >
                <Text
                  style={{
                    padding: 10,
                    fontSize: 16,
                    textAlign: "center",
                    color:
                      tabList[currentTab].name == "Mobile"
                        ? Colors.primary
                        : "black",
                  }}
                >
                  Mobile
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              {currentTab == 0 ? (
                device.pc !== null ? (
                  <PCSpecs pcDetails={device.pc} />
                ) : (
                  <View style={{ width: "90%", padding: 15, minHeight: 200 }}>
                    {/* <Text>{device.pc}</Text> */}
                    <Text
                      style={{
                        width: "100%",
                        textAlign: "left",
                        color: mode ? getDarkTheme.color : getLightTheme.color,
                      }}
                    >
                      You haven't filled your PC specs yet !
                    </Text>
                  </View>
                )
              ) : device.mobile !== null ? (
                <MobileSpecs mobileDetails={device.mobile} />
              ) : (
                <View
                  style={{
                    width: "90%",
                    margin: 15,
                    padding: 15,
                    minHeight: 200,
                  }}
                >
                  {/* <Text>{device.pc}</Text> */}
                  <Text
                    style={{
                      width: "100%",
                      textAlign: "left",
                      color: mode ? getDarkTheme.color : getLightTheme.color,
                    }}
                  >
                    You haven't filled your Mobile specs yet !
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={{ width: "90%", marginLeft: 15 }}>
            {/* <Text>{device.pc}</Text> */}
            <Text
              style={{
                width: "100%",
                textAlign: "left",
                color: mode ? getDarkTheme.color : getLightTheme.color,
                fontSize: 16,
              }}
            >
              You haven't filled your devices specs yet !
            </Text>
          </View>
        )
      ) : (
        <View style={[styles.page, { justifyContent: "center" }]}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text
            style={{
              fontSize: 16,
              marginVertical: 15,
              color: mode ? getDarkTheme.color : getLightTheme.color,
            }}
          >
            Loading device...
          </Text>
        </View>
      )}
    </View>
  );
}
