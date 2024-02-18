import React, { useState, useEffect, useRef, useCallback } from "react";
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
import SettingsModal from "../components/SettingsModal";

import { getLevels, createWordSearch } from "../utils";
import { getThemeStyles, colors } from "../styles/theme";

const PuzzleScreen = ({ route, navigation }) => {
  const { invId, levelId, dimension, words, minutes } = route.params;

  const [timeRemaining, setTimeRemaining] = useState(minutes * 60);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [answerCells, setAnswerCells] = useState([]);

  const [grid, setGrid] = useState([]);

  const [selectedWord, setSelectedWord] = useState([]);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [screenWidth, setScreenWidth] = useState(0);

  const [cellSizeCalc, setCellSizeCalc] = useState(0);

  const gridRef = useRef(null); // Create a ref

  const selectedCellsRef = useRef(selectedCells);
  selectedCellsRef.current = selectedCells;

  var diagRemoved = false;

  const themeStyles = getThemeStyles(useColorScheme());

  // Generate the word search array
  useEffect(() => {
    const generatedWordSearchArray = createWordSearch(dimension, words);
    setGrid(generatedWordSearchArray);
  }, [dimension, words]);

  // If all words found go to game result
  useEffect(() => {
    if (foundWords.length > 0 && foundWords.length == words.length) {
      handleGameEnd("success", timeRemaining);
    }
  }, [foundWords]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // If time is up go to game result
  useEffect(() => {
    if (timeRemaining <= 0) {
      handleGameEnd("failure", timeRemaining);
    }
  },);

  // Handle refresh for Flatlist
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // 2 second pause
  }, []);

  const handleGridRender = (layoutEvent) => {
    if (gridRef.current) {
      gridRef.current.measure((x, y, width, height, pageX, pageY) => {
        console.log("Grid Dimensions:", x, y, width, height, pageX, pageY);
        setOffsetX(x);
        setScreenWidth(width);
        setOffsetY(pageY);
        setCellSizeCalc(Math.floor(width / dimension));
        console.log(cellSizeCalc);
      });
    }
  };

  const handleGameEnd = (gameStatus, gameScore) => {
    navigation.navigate("GameResult",
      {
        invId: invId,
        levelId: levelId,
        status: gameStatus,
        score: gameScore
      });
  };

  const handleCellDrag = (x, y) => {
    const cellSize = cellSizeCalc
    const columnIndex = Math.floor((x - offsetX) / cellSize);
    const rowIndex = Math.floor((y - offsetY) / cellSize);
    console.log("Drag", x, y, offsetY, rowIndex, columnIndex);
    if (
      rowIndex >= 0 &&
      rowIndex < grid.length &&
      columnIndex >= 0 &&
      columnIndex < grid[rowIndex].length
    ) {
      const selectedLetter = grid[rowIndex][columnIndex];
      const lastSelectedIndex = selectedWord.length - 1;

      // Check if the cell is already selected
      const isCellSelected = selectedCellsRef.current.some(
        ({ row, col }) => row === rowIndex && col === columnIndex
      );

      if (
        !isCellSelected &&
        (lastSelectedIndex === -1 ||
          // Check for horizontal drag
          (lastSelectedIndex >= 0 &&
            rowIndex === selectedWord[lastSelectedIndex].rowIndex) ||
          // Check for vertical drag
          (lastSelectedIndex >= 0 &&
            columnIndex === selectedWord[lastSelectedIndex].columnIndex) ||
          // Check for diagonal drag
          (lastSelectedIndex >= 0 &&
            Math.abs(rowIndex - selectedWord[lastSelectedIndex].rowIndex) <=
            1 &&
            Math.abs(
              columnIndex - selectedWord[lastSelectedIndex].columnIndex
            ) <= 1))
      ) {
        if (
          !diagRemoved &&
          lastSelectedIndex >= 1 &&
          Math.abs(rowIndex - selectedWord[lastSelectedIndex - 1].rowIndex) <=
          1 &&
          Math.abs(
            columnIndex - selectedWord[lastSelectedIndex - 1].columnIndex
          ) <= 1
        ) {
          // Remove the most recent letter and cell
          setSelectedWord(selectedWord.slice(0, -1));
          setSelectedCells(selectedCellsRef.current.slice(0, -1));
          diagRemoved = true;
        } else {
          setSelectedWord([
            ...selectedWord,
            { letter: selectedLetter, rowIndex, columnIndex },
          ]);
          setSelectedCells([
            ...selectedCellsRef.current,
            { row: rowIndex, col: columnIndex },
          ]);
          diagRemoved = false;
        }
      }
    }
  };

  const handlePanResponderGrant = (event, gestureState) => {
    setSelectedCells([]);
    console.log("Drag start");
    const { x0, y0 } = gestureState;
    handleCellDrag(x0, y0);
  };

  const handlePanResponderMove = (event, gestureState) => {
    const { moveX, moveY } = gestureState;
    handleCellDrag(moveX, moveY);
  };

  const onPanResponderRelease = () => {
    console.log("Drag end");
    // Check if the selectedWord forms a valid word (implement your own logic)
    const word = selectedWord.map(({ letter }) => letter).join("");
    const upperWord = word.toUpperCase();
    console.log("Selected Word:", word);

    // Check if the selected word (ignoring case) is one of the answer words
    if (
      words.some((answerWord) => answerWord.toUpperCase() === upperWord) &&
      !foundWords.includes(upperWord)
    ) {
      console.log("Found word:", upperWord);
      setFoundWords([...foundWords, upperWord]);
      setAnswerCells([...answerCells, ...selectedCells]);
    }

    // Clear current selections
    setSelectedWord([]);
    setSelectedCells([]);

    if (foundWords.length > 0 && foundWords.length == words.length) {
      handlePuzzleSolved("success");
    }
  };

  const panResponder = PanResponder.create({
    onPanResponderGrant: handlePanResponderGrant,
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease,
  });

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

        <SettingsModal onRefresh={onRefresh} />

      </View>

      <View
        style={{
          paddingBottom: 10,
          marginBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: "gray",
        }}
      >
        <View
          ref={gridRef}
          {...panResponder.panHandlers}
          onLayout={handleGridRender}
        >
          <FlatList
            data={grid}
            renderItem={({ item, index }) => (
              <View key={index} style={{ flexDirection: "row" }}>
                {item.map((cell, colIndex) => (
                  <TouchableOpacity
                    key={colIndex}
                    style={[
                      {
                        width: cellSizeCalc - 10,
                        height: cellSizeCalc - 10,
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "black",
                        margin: 4,
                      },
                      answerCells.some(
                        ({ row, col }) => row === index && col === colIndex
                      ) && styles.answerCell,
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
            onScroll={() => { }}
          />
        </View>
      </View>

      <Text
        style={[themeStyles.text, { textAlign: "center" }]}
      >{`Time Remaining: ${timeRemaining} seconds`}</Text>

      <View style={{ margin: 15 }}>
        <Text style={[themeStyles.text, { marginBottom: 5 }]}>
          Found Words:
        </Text>
        <FlatList
          data={foundWords}
          renderItem={({ item }) => (
            <Text style={[themeStyles.text, { margin: 2, fontWeight: 'bold' }]}>{item}</Text>
          )}
          keyExtractor={(item) => item}
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
  selectedCell: {
    backgroundColor: "yellow",
  },
  answerCell: {
    backgroundColor: colors.success,
  },
});

export default PuzzleScreen;
