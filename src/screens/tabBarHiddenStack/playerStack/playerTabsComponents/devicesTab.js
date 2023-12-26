import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { DarkModeStatus, UserToken } from "../../../../app/useStore";
import { ApiCollection } from "../../../../configs/envConfig";
import { Colors, getDarkTheme, getLightTheme } from "../../../../utils/colors";

export default function DevicesTab(props) {
  useEffect(() => {
    getDevice();
  }, []);

  const mode = DarkModeStatus();

  const userId = props.userId;
  const token = UserToken();

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);

  const getDevice = async () => {
    setLoading(true);

    await axios
      .get(
        `${ApiCollection.userController.getPlayerUserInfos}/${userId}/system`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setLoading(false);
        if (response.data.data.systemDetail !== undefined) {
          if (
            response.data.data.systemDetail.pc == null &&
            response.data.data.systemDetail.mobile == null
          ) {
            setDevice(null);
          } else {
            setDevice(response.data.data.systemDetail);
          }
        }
      })
      .catch((err) => {
        setLoading(false);
        setDevice(null);
      });
  };

  const tabList = [{ name: "PC" }, { name: "Mobile" }];

  const PCSpecs = ({ pcDetails }) => {
    return (
      <View
        style={{
          width: "100%",
          paddingHorizontal: 15,
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        }}
      >
        <View
          style={{
            width: "100%",
            marginTop: 0,
            marginBottom: 20,
            borderRadius: 8,
            backgroundColor: "black",
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
            <View
              style={{
                width: "100%",
                marginTop: 10,
                backgroundColor: mode
                  ? getDarkTheme.backgroundColor
                  : getLightTheme.backgroundColor,
              }}
            >
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

            <View
              style={{
                width: "100%",
                marginTop: 10,
                backgroundColor: mode
                  ? getDarkTheme.backgroundColor
                  : getLightTheme.backgroundColor,
              }}
            >
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

            <View
              style={{
                width: "100%",
                marginTop: 10,
                backgroundColor: mode
                  ? getDarkTheme.backgroundColor
                  : getLightTheme.backgroundColor,
              }}
            >
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

            <View
              style={{
                width: "100%",
                marginTop: 10,
                backgroundColor: mode
                  ? getDarkTheme.backgroundColor
                  : getLightTheme.backgroundColor,
              }}
            >
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
      <View
        style={{
          width: "100%",
          paddingHorizontal: 15,
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        }}
      >
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
            <View
              style={{
                width: "100%",
                marginTop: 10,
                backgroundColor: mode
                  ? getDarkTheme.backgroundColor
                  : getLightTheme.backgroundColor,
              }}
            >
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

            <View
              style={{
                width: "100%",
                marginTop: 10,
                backgroundColor: mode
                  ? getDarkTheme.backgroundColor
                  : getLightTheme.backgroundColor,
              }}
            >
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

            <View
              style={{
                width: "100%",
                marginTop: 10,
                backgroundColor: mode
                  ? getDarkTheme.backgroundColor
                  : getLightTheme.backgroundColor,
              }}
            >
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

            <View
              style={{
                width: "100%",
                marginTop: 10,
                backgroundColor: mode
                  ? getDarkTheme.backgroundColor
                  : getLightTheme.backgroundColor,
              }}
            >
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
      <View
        style={{
          width: "100%",
          paddingHorizontal: 15,
          backgroundColor: mode
            ? getDarkTheme.backgroundColor
            : getLightTheme.backgroundColor,
        }}
      >
        {!loading ? (
          device != null ? (
            <View style={{ marginTop: 20, width: "100%" }}>
              <View
                style={{
                  width: "95%",
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  backgroundColor: mode
                    ? getDarkTheme.backgroundColor
                    : getLightTheme.backgroundColor,
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
                          : mode
                          ? getDarkTheme.color
                          : getLightTheme.color,
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
                          : mode
                          ? getDarkTheme.color
                          : getLightTheme.color,
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
                    <View
                      style={{
                        width: "90%",
                        padding: 15,
                        minHeight: 200,
                        backgroundColor: mode
                          ? getDarkTheme.backgroundColor
                          : getLightTheme.backgroundColor,
                      }}
                    >
                      {/* <Text>{device.pc}</Text> */}
                      <Text
                        style={{
                          width: "100%",
                          textAlign: "left",
                          color: mode
                            ? getDarkTheme.color
                            : getLightTheme.color,
                        }}
                      >
                        The user hasn't uploaded his PC Specs yet !
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
                      backgroundColor: mode
                        ? getDarkTheme.backgroundColor
                        : getLightTheme.backgroundColor,
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
                      The user hasn't uploaded his mobile specs yet !
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <View>
              <Text
                style={{
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                  fontSize: 16,
                }}
              >
                The user hasn't uploaded his Device specs yet!
              </Text>
            </View>
          )
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: mode
                ? getDarkTheme.backgroundColor
                : getLightTheme.backgroundColor,
            }}
          >
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
    </View>
  );
}

const styles = StyleSheet.create({
  tabHead: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    margin: 15,
  },
});
