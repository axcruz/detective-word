import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, useColorScheme } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

import LoadingIndicator from "../components/LoadingIndicator";

import { getScoreboard } from "../utils";

import { getThemeStyles } from "../styles/theme";

const ScoreboardScreen = ({ route }) => {
  const { invId } = route.params;
  const [scoreboard, setScoreboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const themeStyles = getThemeStyles(useColorScheme());

  useEffect(() => {
    const fetchScoreboardData = async () => {
      try {
        const scoreboardData = await getScoreboard(invId);
        setScoreboard(scoreboardData);
        console.log(scoreboardData);
      } catch (error) {
        console.error("Error fetching scoreboard data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScoreboardData();
  }, [invId]);


    // Utility to render score card
    const renderItem = ({ item }) => {

      return (
          <React.Fragment>
              {item ? (
                  <>
                      <View
                          style={[
                              themeStyles.card,
                              {
                                  flexDirection: "row",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  marginTop: 10,
                                  marginBottom: 2,
                              },
                          ]}
                      >
                          <Ionicons name="ribbon" size={24} style={themeStyles.text} />
                          <Text style={[themeStyles.text, {marginHorizontal: 5}]}>
                            Rank #{item.rank}
                            </Text>
                          <Text style={[themeStyles.text, { textAlign:"center", width: "40%" }]}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                          >
                              {item.username}
                          </Text>
                          <Text style={themeStyles.text}>{item.totalScore}</Text>
                      </View>
                  </>

              ) : (
                  <LoadingIndicator />
              )}
          </React.Fragment>
      );
  };




  if (loading) {
    return <LoadingIndicator />
  }

  return (
    <View style={themeStyles.container}>
      <FlatList
        data={scoreboard}
        keyExtractor={(item) => item.playerId}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ScoreboardScreen;
