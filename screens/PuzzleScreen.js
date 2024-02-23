import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  useColorScheme,
  PanResponder,
  Modal,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import LoadingIndicator from "../components/LoadingIndicator";
import SettingsModal from "../components/SettingsModal";

import { getLevels, createWordSearch } from "../utils";
import { getThemeStyles, colors } from "../styles/theme";

const PuzzleScreen = ({ route, navigation }) => {
  const { invId, levelId, dimension, words, minutes, clue, story_end } =
    route.params;

  const [gameStatus, setGameStatus] = useState("play");
  const [timeRemaining, setTimeRemaining] = useState(minutes * 60);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [answerCells, setAnswerCells] = useState([]);
  const [grid, setGrid] = useState([]);
  const [solution, setSolution] = useState([]);
  const [selectedWord, setSelectedWord] = useState([]);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [screenWidth, setScreenWidth] = useState(0);
  const [cellSizeCalc, setCellSizeCalc] = useState(0);
  const [hints, setHints] = useState(4);
  const [showClueModal, setShowClueModal] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const [isTimeFrozen, setIsTimeFrozen] = useState(false);
  const [freezeTimeCountdown, setFreezeTimeCountdown] = useState(0);

  const gridRef = useRef(null); // Create a ref
  const selectedCellsRef = useRef(selectedCells);
  selectedCellsRef.current = selectedCells;

  var diagRemoved = false;

  const themeStyles = getThemeStyles(useColorScheme());

  // Generate the word search array
  useEffect(() => {
    const result = createWordSearch(dimension, words);
    setGrid(result.wordSearchArray);
    setSolution(result.solutionArray);
  }, [dimension, words]);

  // If all words found go to game result
  useEffect(() => {
    if (foundWords.length > 0 && foundWords.length == words.length) {
      handleGameEnd("success", timeRemaining);
    }
  }, [foundWords]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (gameStatus === "play" && !isTimeFrozen) {
        setTimeRemaining((prevTime) => prevTime - 1);
      }
      if (isTimeFrozen) {
        if (freezeTimeCountdown > 0) {
          setFreezeTimeCountdown((prevCountdown) => prevCountdown - 1);
        } else {
          setIsTimeFrozen(false);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus, isTimeFrozen, freezeTimeCountdown]);

  // If time is up go to game result
  useEffect(() => {
    if (timeRemaining <= 0 && gameStatus === "play") {
      handleGameEnd("failure", timeRemaining);
    }
  });

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
      });
    }
  };

  const handleGameEnd = (gameStatus, gameScore) => {
    setGameStatus("end");
    navigation.navigate("GameResult", {
      invId: invId,
      levelId: levelId,
      status: gameStatus,
      score: gameScore,
      story_end: story_end,
    });
  };

  const handleCellDrag = (x, y) => {
    const cellSize = cellSizeCalc;
    const columnIndex = Math.floor((x - offsetX) / cellSize);
    const rowIndex = Math.floor((y - offsetY) / cellSize);
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
    const { x0, y0 } = gestureState;
    handleCellDrag(x0, y0);
  };

  const handlePanResponderMove = (event, gestureState) => {
    const { moveX, moveY } = gestureState;
    handleCellDrag(moveX, moveY);
  };

  const onPanResponderRelease = () => {
    // Check if the selectedWord forms a valid word (implement your own logic)
    const word = selectedWord.map(({ letter }) => letter).join("");
    const upperWord = word.toUpperCase();

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

  // Show the clue modal
  const handleCluePress = () => {
    setShowClueModal(true);

    // Decrease the hints count
    setHints(hints - 1);
  };

  // Close the clue modal
  const closeClueModal = () => {
    setShowClueModal(false);
  };

  const handleHintPress = () => {
    // Find indices with non-empty and non-undefined values in the solutionArray
    const nonEmptyIndices = [];
    for (let i = 0; i < solution.length; i++) {
      for (let j = 0; j < solution[i].length; j++) {
        if (
          solution[i][j] !== "" &&
          solution[i][j] !== undefined &&
          !answerCells.some((cell) => cell.row === i && cell.col === j)
        ) {
          nonEmptyIndices.push({ row: i, col: j });
        }
      }
    }

    // If there are non-empty indices, choose a random index from them
    if (nonEmptyIndices.length > 0) {
      const randomIndex = Math.floor(Math.random() * nonEmptyIndices.length);
      const { row, col } = nonEmptyIndices[randomIndex];

      // Highlight the letter at the chosen index
      setHighlightedIndex(row * dimension + col);

      // Decrease the hints count
      setHints(hints - 1);
    }
  };

  const handleFreezeTimePress = () => {
    if (hints > 0 && !isTimeFrozen) {
      // Freeze the time for 15 seconds
      setIsTimeFrozen(true);
      setFreezeTimeCountdown(15);

      // Decrease the hints count
      setHints(hints - 1);
    }
  };

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
        {gridRef ? (
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
                        highlightedIndex === index * dimension + colIndex &&
                          styles.highlightedCell,
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
        ) : (
          <LoadingIndicator />
        )}
      </View>

      <Text
        style={[themeStyles.text, { textAlign: "center" }]}
      >{`Time Remaining: ${timeRemaining} seconds`}</Text>

      <View
        style={{
          paddingVertical: 10,
          marginVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: "gray",
          borderTopWidth: 1,
          borderTopColor: "gray",
        }}
      >
        <Text style={{ textAlign: "right", marginRight: 10 }}>
          Insight: {hints}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: -20,
          }}
        >
          <TouchableOpacity
            style={[
              themeStyles.tertiaryButton,
              { margin: 5 },
              hints <= 0 && styles.disabledButton,
            ]}
            onPress={handleCluePress}
            disabled={hints <= 0}
          >
            <Ionicons name="bulb-outline" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              themeStyles.secondaryButton,
              { margin: 5 },
              hints <= 0 && styles.disabledButton,
            ]}
            onPress={handleHintPress}
            disabled={hints <= 0}
          >
            <Ionicons name="finger-print" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              themeStyles.secondaryButton,
              { backgroundColor: "#86d6d8", margin: 5 },
              (hints <= 0 || isTimeFrozen) && styles.disabledButton,
            ]}
            onPress={handleFreezeTimePress}
            disabled={hints <= 0 || isTimeFrozen}
          >
            <Ionicons name="snow" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ margin: 10 }}>
        <Text style={[themeStyles.text, { marginBottom: 5 }]}>
          Found Words: {foundWords.length} out of {words.length}
        </Text>
        <FlatList
          data={foundWords}
          renderItem={({ item }) => (
            <Text style={[themeStyles.text, { margin: 5, fontWeight: "bold" }]}>
              {item}
            </Text>
          )}
          keyExtractor={(item) => item}
          numColumns={2} // Set the number of columns to 2
        />
      </View>

      <Modal
        visible={showClueModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeClueModal}
      >
        <TouchableOpacity
          style={[
            themeStyles.modalView,
            { backgroundColor: "rgba(52, 52, 52, 0.9)" },
          ]}
          onPress={closeClueModal}
        >
          <Text style={[themeStyles.text, { color: "white" }]}>{clue}</Text>
        </TouchableOpacity>
      </Modal>
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
    backgroundColor: colors.tertiary,
  },
  answerCell: {
    backgroundColor: colors.success,
  },
  highlightedCell: {
    backgroundColor: colors.success,
  },
  disabledButton: {
    opacity: 0.3,
  },
});

export default PuzzleScreen;
