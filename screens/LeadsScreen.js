import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  useColorScheme,
} from "react-native";

import { auth } from "../firebase/config";

import Ionicons from "@expo/vector-icons/Ionicons";

import LoadingIndicator from "../components/LoadingIndicator";
import { getLevels } from "../utils";
import { getThemeStyles } from "../styles/theme";

import SettingsModal from "../components/SettingsModal";

const LeadsScreen = ({ route, navigation }) => {
  const { invId } = route.params;

  const [refreshing, setRefreshing] = useState(true);
  const [leads, setLeads] = useState();

  const themeStyles = getThemeStyles(useColorScheme());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getLevels(invId, auth.currentUser.uid);
        setLeads(result.levelData);
      } catch (error) {
        // Handle error
      }
    };

    fetchData();
    setRefreshing(false);
  }, [invId, refreshing]);

  // Handle refresh for Flatlist
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // 2 second pause
  }, []);

  const renderLeadItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.leadBox]}
      onPress={() => {
        if (item.story) {
          navigation.navigate("Story", {
            invId: invId,
            levelId: item.id,
            dimension: item.dimension,
            words: item.words,
            minutes: item.minutes,
            clue: item.clue,
            stories: item.story,
            image: item.story_image,
            story_end: item.story_result,
          });
        } else {
          navigation.navigate("Puzzle", {
            invId: invId,
            levelId: item.id,
            dimension: item.dimension,
            words: item.words,
            minutes: item.minutes,
            clue: item.clue,
            story_end: item.story_result,
          });
        }
      }}
    >
      <Text style={styles.leadText}>{item.name}</Text>
      <Ionicons name={item.icon} size={70} color="white" />
      {item.playerScore != -1 ? (
        <Text style={styles.leadText}>Best: {item.playerScore} secs</Text>
      ) : (
        <Text style={styles.leadText}></Text>
      )}
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
              <Ionicons
                name="file-tray-stacked-outline"
                size={24}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[themeStyles.secondaryButton, { marginHorizontal: 5 }]}
              onPress={() =>
                navigation.navigate("Scoreboard", {
                  invId: invId,
                  playerId: auth.currentUser.uid,
                })
              }
            >
              <Ionicons name="trophy" size={24} color="white" />
            </TouchableOpacity>

            <SettingsModal onRefresh={onRefresh} />
          </View>

          <View style={{ margin: 5 }}>
            <FlatList
              data={leads}
              refreshing={refreshing}
              onRefresh={onRefresh}
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
    padding: 15,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#3498db",
    borderRadius: 5,
    height: 180,
  },
  leadImage: {
    width: "100%",
    height: 100,
    borderRadius: 5,
    marginBottom: 5,
  },
  leadText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default LeadsScreen;
