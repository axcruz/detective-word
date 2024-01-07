import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  useColorScheme,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import LoadingIndicator from "../components/LoadingIndicator";
import { getLevels } from "../utils";
import { getThemeStyles } from "../styles/theme";

const LeadsScreen = ({ route, navigation }) => {
  const { invId } = route.params;

  const [refreshing, setRefreshing] = useState(false);
  const [leads, setLeads] = useState();

  const themeStyles = getThemeStyles(useColorScheme());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getLevels(invId);
        setLeads(result.levelData);
      } catch (error) {
        // Handle error
      }
    };

    fetchData();
    setRefreshing(false);
  }, [invId]);

  const renderLeadItem = ({ item }) => (
    <TouchableOpacity
      style={[themeStyles.primaryButton, styles.leadBox]}
      onPress={() => {
        // Handle lead click
      }}
    >
      <Text style={styles.leadText}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Main Render
  return (
    <>
      {leads ? (
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
              <Ionicons name="layers-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <View style={{ margin: 5 }}>
            <FlatList
              data={leads}
              renderItem={renderLeadItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
            />
          </View>
        </View>
      ) : (
        <LoadingIndicator />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  leadBox: {
    flex: 1,
    margin: 5,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3498db", // Replace with your preferred background color
    borderRadius: 5,
  },
  leadText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LeadsScreen;
