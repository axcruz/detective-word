// screens/InvestigationsScreen.js

import React, { useState, useEffect, useCallback } from "react";
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

import { auth } from "../firebase/config";

import LoadingIndicator from "../components/LoadingIndicator";

import { getInvestigations } from "../utils";

import { getThemeStyles } from "../styles/theme";

import SettingsModal from "../components/SettingsModal";

const InvestigationsScreen = ({ route, navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [investigations, setInvestigations] = useState([]);

  const themeStyles = getThemeStyles(useColorScheme());

  useEffect(() => {
    // Fetch stack data
    if (auth.currentUser) {
      const fetchInvestigations = async () => {
        try {
          const allInvestigations = await getInvestigations(
            auth.currentUser.uid
          );
          setInvestigations(allInvestigations);
        } catch (error) {
          // Handle error
        }
      };
      fetchInvestigations();
    }
  }, [refreshing]);

  // Handle refresh for Flatlist
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // 2 second pause
  }, []);

  // Utility to render stack panels under a stack category
  const renderItem = ({ item }) => {
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
                },
              ]}
              onPress={() => {
                navigation.navigate("Leads", { invId: item.id });
              }}
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
      {themeStyles ? (
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
            data={investigations}
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
