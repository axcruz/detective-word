// StoryScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const StoryScreen = ({route, navigation}) => {
    
    const { invId, levelId, dimension, words, minutes, stories } = route.params;

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // const stories = [
  //   'Detective Word was assigned a crucial case involving a mysterious crime...',
  //   'He carefully examined the crime scene, looking for any clues that could lead him to the truth...',
  //   'As Detective Word prepared to interview the key witness, he felt a mix of anticipation and determination...',
  //   'Mr. Talbot, a person of interest in the investigation, had valuable information that could crack the case wide open...',
  //   'With a notepad in hand, Detective Smith approached the witness, ready to uncover the hidden details of the crime...',
  // ];

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      // Optionally, you can navigate to another screen or perform an action when the story ends.
      navigation.navigate("Puzzle", { invId: invId, levelId: levelId, dimension: dimension, words: words, minutes: minutes })
    }
  };

  const handleSkipStory = () => {
    // Optionally, you can navigate to another screen or perform an action when the story is skipped.
    navigation.navigate("Puzzle", { invId: invId, levelId: levelId, dimension: dimension, words: words, minutes: minutes })
  };

  return (
    <View style={styles.container}>
      <Text style={styles.storyText}>{stories[currentStoryIndex]}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSkipStory} style={[styles.button, { backgroundColor: 'green' }]}>
          <Text style={styles.buttonText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextStory} style={[styles.button, { backgroundColor: 'blue' }]}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    storyText: {
      fontSize: 18,
      textAlign: 'left',
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    button: {
      padding: 10,
      borderRadius: 5,
      flex: 1,
      margin: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
    },
  });
  

export default StoryScreen;
