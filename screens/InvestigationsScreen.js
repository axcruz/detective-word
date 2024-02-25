// InvestigationsScreen.js

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { auth } from "../firebase/config";
import LoadingIndicator from "../components/LoadingIndicator";
import SettingsModal from "../components/SettingsModal";
import { getInvestigations } from "../utils";
import { getThemeStyles } from "../styles/theme";

const InvestigationsScreen = ({ route, navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [investigations, setInvestigations] = useState([]);

  const themeStyles = getThemeStyles(useColorScheme());

  // Function to fetch investigation data
  const fetchInvestigationsData = async () => {
    try {
      const allInvestigations = await getInvestigations(auth.currentUser.uid);
      setInvestigations(allInvestigations);
    } catch (error) {
      // Handle error
    }
  };

  // Use focus effect to refresh data whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setRefreshing(true);
      fetchInvestigationsData().finally(() => {
        setRefreshing(false);
      });
    }, [])
  );

  // Handle refresh for Flatlist
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchInvestigationsData().finally(() => {
      setRefreshing(false);
    });
  }, []);

  // Check if the previous investigation is completed
  const isPreviousInvestigationCompleted = (currentInvestigation) => {
    const { case_num } = currentInvestigation;
    if (case_num > 1) {
      const previousInvestigation = investigations.find(
        (investigation) => investigation.case_num === case_num - 1
      );
      return (
        previousInvestigation &&
        previousInvestigation.totalLevelsCompleted ===
          previousInvestigation.level_count
      );
    }
    return true; // First investigation is never disabled
  };

  // Add a placeholder item for "More Coming Soon..."
  const invsWithPlaceholder = [
    ...investigations,
    { id: "placeholder", placeholder: true },
  ];

  // Utility to render stack panels under a stack category
  const renderItem = ({ item }) => {
    if (item.placeholder) {
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            marginTop: 40,
          }}
        >
          <Text style={themeStyles.headerText}>More Coming Soon...</Text>
        </View>
      );
    }

    const isDisabled = !isPreviousInvestigationCompleted(item);

    return (
      <React.Fragment>
        {investigations ? (
          <>
            <TouchableOpacity
              style={[
                themeStyles.card,
                {
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 10,
                  marginBottom: 2,
                  opacity: isDisabled ? 0.3 : 1,
                },
              ]}
              onPress={() => {
                if (!isDisabled) {
                  navigation.navigate("Leads", { invId: item.id });
                }
              }}
              disabled={isDisabled}
            >
              {item.cover_image ? (
                <View
                  style={{ position: "relative", width: "100%", height: 250 }}
                >
                  <Image
                    source={{ uri: item.cover_image }}
                    style={{ width: "100%", height: 250, borderRadius: 5 }}
                  />
                  {item.totalLevelsCompleted === item.level_count && (
                    <Image
                      source={require("../assets/solved-stamp.png")}
                      style={[
                        {
                          position: "absolute",
                          resizeMode: "contain",
                          backgroundColor: "transparent",
                          top: "50%",
                          left: "50%",
                          marginLeft: 25, // Adjust the margin based on half of the width
                          marginTop: -65, // Adjust the margin based on half of the height
                          width: 150,
                        },
                      ]}
                    />
                  )}
                </View>
              ) : (
                <Ionicons name="folder" size={24} style={themeStyles.text} />
              )}

              <View
                style={{
                  flex: 2,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 15,
                }}
              >
                <Text
                  style={[themeStyles.titleText, { flex: 1 }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
                <Text
                  style={[
                    themeStyles.titleText,
                    { flex: 1, textAlign: "right" },
                  ]}
                >
                  {item.totalLevelsCompleted}/{item.level_count}
                </Text>
              </View>
            </TouchableOpacity>
          </>
        ) : (
          <ActivityIndicator
            size="large"
            style={{ justifyContent: "center" }}
          />
        )}
      </React.Fragment>
    );
  };

  // Main render
  return (
    <>
      {themeStyles && investigations ? (
        <View style={themeStyles.container}>
          <View
            style={{
              flexDirection: "row",
              paddingBottom: 10,
              marginBottom: 10,
              borderBottomWidth: 1,
              borderBottomColor: "gray",
            }}
          >
            <TouchableOpacity
              style={[themeStyles.primaryButton, { marginHorizontal: 5 }]}
              onPress={() => navigation.navigate("Investigations")}
            >
              <Ionicons name="briefcase-outline" size={24} color="white" />
            </TouchableOpacity>

            <SettingsModal onRefresh={onRefresh} />
          </View>

          <FlatList
            data={invsWithPlaceholder}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={"gray"}
                title="Refreshing"
                titleColor={"gray"}
              />
            }
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={<View style={{ marginBottom: 10 }} />}
            ListFooterComponent={<View style={{ marginTop: 10 }} />}
            ListHeaderComponentStyle={{ marginTop: 5 }}
          />
        </View>
      ) : (
        <LoadingIndicator />
      )}
    </>
  );
};

export default InvestigationsScreen;
