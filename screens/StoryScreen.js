// StoryScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Image,
} from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";
import { getThemeStyles, colors } from "../styles/theme";

const StoryScreen = ({ route, navigation }) => {
  const {
    invId,
    levelId,
    dimension,
    words,
    minutes,
    clue,
    stories,
    image,
    story_end,
  } = route.params;

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const themeStyles = getThemeStyles(useColorScheme());

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      // Optionally, you can navigate to another screen or perform an action when the story ends.
      navigation.navigate("Puzzle", {
        invId: invId,
        levelId: levelId,
        dimension: dimension,
        words: words,
        minutes: minutes,
        clue: clue,
        story_end: story_end,
      });
    }
  };

  const handlePrevStory = () => {
    setCurrentStoryIndex(currentStoryIndex - 1);
  };

  const handleSkipStory = () => {
    // Optionally, you can navigate to another screen or perform an action when the story is skipped.
    navigation.navigate("Puzzle", {
      invId: invId,
      levelId: levelId,
      dimension: dimension,
      words: words,
      minutes: minutes,
      clue: clue,
      story_end: story_end,
    });
  };

  return (
    <View style={[themeStyles.container, { justifyContent: "flex-end" }]}>
      {image && (
        <Image
          source={{ uri: image }}
          style={{
            borderColor: "#E8E9EB",
            borderWidth: 1,
            borderRadius: 5,
            width: "100%",
            height: "40%",
            marginBottom: 20,
          }}
          resizeMode="cover"
        />
      )}
      <View style={[themeStyles.card, { height: "40%", marginBottom: 20 }]}>
        <ScrollView>
          <Text style={themeStyles.text}>{stories[currentStoryIndex]}</Text>
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        {currentStoryIndex > 0 && (
          <TouchableOpacity
            onPress={handlePrevStory}
            style={[themeStyles.primaryButton]}
          >
            <Ionicons name="chevron-back-sharp" size={24} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleSkipStory}
          style={[themeStyles.configButton]}
        >
          <Text style={styles.buttonText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNextStory}
          style={[themeStyles.primaryButton]}
        >
          <Ionicons name="chevron-forward-sharp" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  storyText: {
    fontSize: 18,
    textAlign: "left",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    flex: 1,
    margin: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default StoryScreen;
