import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  useColorScheme,
  PanResponder,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import LoadingIndicator from "../components/LoadingIndicator";
import { getLevels, createWordSearch } from "../utils";
import { getThemeStyles } from "../styles/theme";

const PuzzleScreen = ({ route, navigation }) => {
  const { levelId, dimension, words, minutes } = route.params;

  const [timeRemaining, setTimeRemaining] = useState(minutes * 60);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [wordSearchArray, setWordSearchArray] = useState([]);

  const themeStyles = getThemeStyles(useColorScheme());

  // Generate the word search array
  useEffect(() => {
    const generatedWordSearchArray = createWordSearch(dimension, words);
    setWordSearchArray(generatedWordSearchArray);
  }, [dimension, words]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Ref to keep track of the latest selectedCells
  const selectedCellsRef = useRef(selectedCells);
  selectedCellsRef.current = selectedCells;

  // Ref to keep track of the currently hovered cell
  const hoveredCellRef = useRef(null);

  // PanResponder for touch and drag
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: (_, gestureState) =>
        gestureState.dx !== 0 || gestureState.dy !== 0,
      onPanResponderGrant: () => {
        setSelectedCells([]);
        hoveredCellRef.current = null;
      },
      onPanResponderMove: (_, gestureState) => {
        const { moveX, moveY } = gestureState;

        if (moveX !== undefined && moveY !== undefined) {
          const hitTestWidth = 30;
          const row = Math.floor((moveY - 20) / hitTestWidth);
          const col = Math.floor(moveX / hitTestWidth);

          if (row >= 0 && row < dimension && col >= 0 && col < dimension) {
            const newHoveredCell = { row, col };

            if (
              !hoveredCellRef.current ||
              (newHoveredCell.row !== hoveredCellRef.current.row ||
                newHoveredCell.col !== hoveredCellRef.current.col)
            ) {
              hoveredCellRef.current = newHoveredCell;
              setSelectedCells([newHoveredCell]);
            }
          }
        }
      },
      onPanResponderEnd: () => {},
    })
  ).current;

  return (
    <View style={[themeStyles.container]}>
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
          <Ionicons name="layers-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View>
        <Text style={themeStyles.text}>{`Time Remaining: ${timeRemaining} seconds`}</Text>
      </View>

      <View
        {...panResponder.panHandlers}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <FlatList
          data={wordSearchArray}
          renderItem={({ item, index }) => (
            <View key={index} style={styles.rowContainer}>
              {item.map((cell, colIndex) => (
                <TouchableOpacity
                  key={colIndex}
                  style={[
                    styles.cellContainer,
                    selectedCells.some(
                      ({ row, col }) => row === index && col === colIndex
                    ) && styles.selectedCell,
                  ]}
                  onPress={() => {
                    // Handle cell press logic
                  }}
                >
                  <Text style={themeStyles.text}>{cell}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          onScroll={() => {}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  rowContainer: {
    flexDirection: "row",
  },
  cellContainer: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    margin: 1
  },
  selectedCell: {
    backgroundColor: "yellow",
  },
});

export default PuzzleScreen;
