// GameResultScreen.js
import React, { useState, useEffect, useRef, useCallback }  from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { auth } from "../firebase/config"

import { savePlayerScore } from "../utils";

const GameResultScreen = ({ route, navigation }) => {
  const { invId, levelId, status, score } = route.params;

  useEffect(() => {
    // Save the player's score when the component mounts
    savePlayerScore(invId, levelId, auth.currentUser.userId, score);
  }, [invId, levelId, score]);

  return (
    <View style={styles.container}>

      {status == "success" ? (
        <>
          <Text style={styles.resultText}>Puzzle Solved!</Text>
          <Text style={styles.resultText}> Score: {score}</Text>
        </>

      ) : (
        <Text style={styles.resultText}>We're out of time...</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Leads", { invId: invId })}
      >
        <Text style={styles.buttonText}>Back to the Investigation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GameResultScreen;
