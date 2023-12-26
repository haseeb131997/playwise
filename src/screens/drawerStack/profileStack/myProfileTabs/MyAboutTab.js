import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Colors, getDarkTheme, getLightTheme } from "../../../../utils/colors";
import { DarkModeStatus, UserToken } from "../../../../app/useStore";
import axios from "axios";
import { styles } from "./TabStyle";
import { ApiCollection } from "../../../../configs/envConfig";

export default function MyAboutTab(props) {
  useEffect(() => {
    getAbout();
  }, []);

  const mode = DarkModeStatus();

  const [about, setAbout] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = UserToken();

  const getAbout = () => {
    setIsLoading(true);
    axios
      .get(ApiCollection.userController.getMyAbout, {
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => {
        setIsLoading(false);
        if (res.data.success) {
          setAbout(res.data.data);
          console.log(res.data.data);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setAbout(null);
      });
  };

  const openResume = (link) => {
    Linking.openURL(link);
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
      <Text style={styles.tabHead}>About</Text>
      <View
        style={{ width: "100%", paddingHorizontal: 15, paddingVertical: 5 }}
      >
        {!isLoading ? (
          about != null && (
            <>
              <Text
                style={{
                  paddingVertical: 5,
                  fontSize: 16,
                  color: mode ? getDarkTheme.color : getLightTheme.color,
                }}
              >
                {about.bio}
              </Text>
              <View style={{ width: "100%", marginTop: 10 }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.primary,
                    fontWeight: "500",
                  }}
                >
                  Joined
                </Text>
                <Text
                  style={{
                    paddingVertical: 5,
                    fontSize: 16,
                    color: mode ? getDarkTheme.color : getLightTheme.color,
                  }}
                >
                  {about.dateOfjoining.split("T")[0]}
                </Text>
              </View>

              <View style={{ width: "100%", marginTop: 20 }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.primary,
                    fontWeight: "500",
                  }}
                >
                  Age
                </Text>
                <Text
                  style={{
                    paddingVertical: 5,
                    fontSize: 16,
                    color: mode ? getDarkTheme.color : getLightTheme.color,
                  }}
                >
                  {about.age}
                </Text>
              </View>

              {about.email != null &&
                about.email != "" &&
                about.email != undefined && (
                  <View style={{ width: "100%", marginTop: 20 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.primary,
                        fontWeight: "500",
                      }}
                    >
                      Registered Email
                    </Text>
                    <Text
                      style={{
                        paddingVertical: 5,
                        fontSize: 16,
                        color: mode ? getDarkTheme.color : getLightTheme.color,
                      }}
                    >
                      {about.email}
                    </Text>
                  </View>
                )}

              {about.phone != null &&
                about.phone != "" &&
                about.phone != undefined && (
                  <View style={{ width: "100%", marginTop: 20 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.primary,
                        fontWeight: "500",
                      }}
                    >
                      Registered Phone
                    </Text>
                    <Text
                      style={{
                        paddingVertical: 5,
                        fontSize: 16,
                        color: mode ? getDarkTheme.color : getLightTheme.color,
                      }}
                    >
                      {about.phone}
                    </Text>
                  </View>
                )}

              {about.addess != null && (
                <View style={{ width: "100%", marginTop: 20 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: Colors.primary,
                      fontWeight: "500",
                    }}
                  >
                    Location
                  </Text>
                  <Text
                    style={{
                      paddingVertical: 5,
                      fontSize: 16,
                      color: mode ? getDarkTheme.color : getLightTheme.color,
                    }}
                  >
                    Mumbai
                  </Text>
                </View>
              )}
              {about.workProfile != null && (
                <>
                  <Text
                    style={[
                      styles.tabHead,
                      {
                        marginLeft: 0,
                        marginTop: 20,
                        textDecorationLine: "underline",
                      },
                    ]}
                  >
                    Work Experience
                  </Text>
                  <View
                    style={{
                      width: "100%",
                      marginTop: 10,
                      color: mode ? getDarkTheme.color : getLightTheme.color,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.primary,
                        fontWeight: "500",
                      }}
                    >
                      Job Title
                    </Text>
                    <Text
                      style={{
                        paddingVertical: 5,
                        fontSize: 16,
                        color: mode ? getDarkTheme.color : getLightTheme.color,
                      }}
                    >
                      {about.workProfile.jobTitle}
                    </Text>
                  </View>

                  <View style={{ width: "100%", marginTop: 20 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.primary,
                        fontWeight: "500",
                      }}
                    >
                      Company
                    </Text>
                    <Text
                      style={{
                        paddingVertical: 5,
                        fontSize: 16,
                        color: mode ? getDarkTheme.color : getLightTheme.color,
                      }}
                    >
                      {about.workProfile.companyName}
                    </Text>
                  </View>

                  <View style={{ width: "100%", marginTop: 20 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.primary,
                        fontWeight: "500",
                      }}
                    >
                      Description
                    </Text>
                    <Text
                      style={{
                        paddingVertical: 5,
                        fontSize: 16,
                        color: mode ? getDarkTheme.color : getLightTheme.color,
                      }}
                    >
                      {about.workProfile.desc}
                    </Text>
                  </View>

                  <View style={{ width: "100%", marginTop: 20 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.primary,
                        fontWeight: "500",
                      }}
                    >
                      Start Date
                    </Text>
                    <Text
                      style={{
                        paddingVertical: 5,
                        fontSize: 16,
                        color: mode ? getDarkTheme.color : getLightTheme.color,
                      }}
                    >
                      {about.workProfile.startDate.split("T")[0]}
                    </Text>
                  </View>

                  <View style={{ width: "100%", marginTop: 20 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Colors.primary,
                        fontWeight: "500",
                      }}
                    >
                      End Date
                    </Text>
                    <Text
                      style={{
                        paddingVertical: 5,
                        fontSize: 16,
                        color: mode ? getDarkTheme.color : getLightTheme.color,
                      }}
                    >
                      {about.workProfile.endDate == about.workProfile.startDate
                        ? "Currently working here"
                        : about.workProfile.endDate.split("T")[0]}
                    </Text>
                  </View>

                  {about.workProfile.resume !== undefined && (
                    <View style={{ width: "100%", marginTop: 20 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: Colors.primary,
                          fontWeight: "500",
                        }}
                      >
                        Resume
                      </Text>
                      <TouchableOpacity
                        onPress={() => openResume(about.workProfile.resume)}
                        style={{
                          marginVertical: 10,
                          padding: 10,
                          paddingHorizontal: 15,
                          backgroundColor: Colors.primary,
                          borderRadius: 5,
                        }}
                      >
                        <Text
                          style={{
                            color: mode
                              ? getDarkTheme.color
                              : getLightTheme.color,
                          }}
                        >
                          View
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}

              <View style={{ marginBottom: 50 }}></View>
            </>
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
              Loading About...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
