import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { getScoreboard } from "../utils";

const ScoreboardScreen = ({ route }) => {
  const { invId } = route.params;
  const [scoreboard, setScoreboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScoreboardData = async () => {
      try {
        const scoreboardData = await getScoreboard(invId);
        setScoreboard(scoreboardData);
      } catch (error) {
        console.error("Error fetching scoreboard data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScoreboardData();
  }, [invId]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      <FlatList
        data={scoreboard}
        keyExtractor={(item) => item.playerId}
        renderItem={({ item }) => (
          <View>
            <Text>{item.playerId}</Text>
            <Text>Total Score: {item.totalScore}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ScoreboardScreen;
