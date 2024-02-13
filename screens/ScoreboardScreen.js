// ScoreboardScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db } from "../firebase/config";

const ScoreboardScreen = ({ route }) => {
  const { invId, levelId } = route.params;
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    
    const fetchLeaderboardData = async () => {
      try {
        const scoresRef = db.collection("scores");

        // Query scores for the specific investigation and level
        const querySnapshot = await scoresRef
          .where("invId", "==", invId)
          .where("levelId", "==", levelId)
          .orderBy("score", "desc") // Order scores in descending order
          .get();

        const leaderboard = querySnapshot.docs.map(doc => doc.data());

        setLeaderboardData(leaderboard);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error.message);
      }
    };

    fetchLeaderboardData();
  }, [invId, levelId]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Scoreboard</Text>
      <FlatList
        data={leaderboardData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.listItem}>
            <Text>{index + 1}. {item.playerId}</Text>
            <Text>Score: {item.score}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  listItem: {
    marginBottom: 10,
  },
});

export default ScoreboardScreen;
