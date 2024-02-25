// GameResultScreen.js

import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  Image,
} from "react-native";
import { auth } from "../firebase/config";
import { getThemeStyles } from "../styles/theme";
import { savePlayerScore } from "../utils";

const GameResultScreen = ({ route, navigation }) => {
  const { invId, levelId, status, score, story_end } = route.params;

  const themeStyles = getThemeStyles(useColorScheme());

  useEffect(() => {
    // Save the player's score
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
          <Text
            style={[
              themeStyles.headerText,
              { textAlign: "center", marginBottom: 20 },
            ]}
          >
            Puzzle Solved!
          </Text>
          <Text
            style={[
              themeStyles.headerText,
              { textAlign: "center", marginBottom: 20 },
            ]}
          >
            Score: {score}
          </Text>

          <View style={[themeStyles.card, { height: "70%", marginBottom: 20 }]}>
            <ScrollView>
              <Text style={themeStyles.text}>{story_end}</Text>
            </ScrollView>
          </View>
        </>
      ) : (
        <>
          <Text
            style={[
              themeStyles.headerText,
              { textAlign: "center", marginBottom: 20 },
            ]}
          >
            We're out of time...
          </Text>
          <Image
            source={require("../assets/game-over.png")}
            style={{ width: "100%", height: 250, borderRadius: 5 }}
          />
        </>
      )}

      <TouchableOpacity
        style={[themeStyles.configButton, { marginTop: 15 }]}
        onPress={() => navigation.navigate("Leads", { invId: invId })}
      >
        <Text style={themeStyles.buttonText}>Back to the Investigation</Text>
      </TouchableOpacity>
    </View>
  );
};

export default GameResultScreen;
