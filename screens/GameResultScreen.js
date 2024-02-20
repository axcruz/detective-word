// GameResultScreen.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, ScrollView,  Image } from "react-native";
import { auth } from "../firebase/config"

import { getThemeStyles } from "../styles/theme";

import { savePlayerScore } from "../utils";

const GameResultScreen = ({ route, navigation }) => {
  const { invId, levelId, status, score, story_end } = route.params;

  const themeStyles = getThemeStyles(useColorScheme());

  useEffect(() => {
    // Save the player's score when the component mounts
    if (status === "success") {
      savePlayerScore(invId, levelId, auth.currentUser.uid, score);
    } else {
      savePlayerScore(invId, levelId, auth.currentUser.uid, 0);
    }
  }, []);

  return (
    <View style={themeStyles.container}>

      {status == "success" ? (
        <>
          <Text style={[themeStyles.headerText, {textAlign: "center", marginBottom: 20 }]}>Puzzle Solved!</Text>
          <Text style={[themeStyles.headerText, {textAlign: "center", marginBottom: 20 }]}>Score: {score}</Text>

          <View style={[themeStyles.card, { height: '50%', marginBottom: 20 }]}>
        <ScrollView>
        <Text style={themeStyles.text}>{story_end}</Text>
        </ScrollView>
      </View>
        </>

      ) : (
        <>
        <Text style={[themeStyles.headerText, {textAlign: "center", marginBottom: 20 }]}>We're out of time...</Text>
        <Image
        source={require('../assets/game-over.png')}
        style={{ width: "100%", height: 250, borderRadius: 5}} />
   </>
      )}

      <TouchableOpacity
        style={[themeStyles.configButton, {marginTop: 15}]}
        onPress={() => navigation.navigate("Leads", { invId: invId })}
      >
        <Text style={themeStyles.buttonText}>Back to the Investigation</Text>
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
