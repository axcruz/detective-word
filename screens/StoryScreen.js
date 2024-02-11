// StoryScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const StoryScreen = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const stories = [
    'Once upon a time...',
    'In a land far, far away...',
    'There lived a brave hero...',
    // Add more story segments as needed
  ];

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      // Optionally, you can navigate to another screen or perform an action when the story ends.
      console.log('Story ended!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.storyText}>{stories[currentStoryIndex]}</Text>
      <TouchableOpacity onPress={handleNextStory} style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
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
    textAlign: 'center',
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default StoryScreen;
