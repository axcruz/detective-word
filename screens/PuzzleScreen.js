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
  const [grid, setGrid] = useState([]);

  const [selectedWord, setSelectedWord] = useState([]);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const gridRef = useRef(null); // Create a ref

  const themeStyles = getThemeStyles(useColorScheme());


  // Generate the word search array
  useEffect(() => {
    const generatedWordSearchArray = createWordSearch(dimension, words);
    setGrid(generatedWordSearchArray);
  }, [dimension, words]);

//   useEffect(() => {
//     // Calculate the offset based on the position of the letter grid
//     if (gridRef.current) {
//       gridRef.current.measure((x, y, width, height, pageX, pageY) => {
//         console.log('Grid Dimensions:', x, y, width, height, pageX, pageY);
//         setOffsetX(pageX);
//         setOffsetY(pageY);
//       });
//     }
//   }, [grid]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleGridRender = (layoutEvent) => {
    // console.log(layoutEvent.nativeEvent);
    // const { x, y, width, height } = layoutEvent.nativeEvent.layout;
    // setOffsetX(x);
    // setOffsetY(y);
    if (gridRef.current) {
      gridRef.current.measure((x, y, width, height, pageX, pageY) => {
        console.log('Grid Dimensions:', x, y, width, height, pageX, pageY);
        setOffsetX(x);
        setOffsetY(pageY);
      });
    }
  };

  const selectedCellsRef = useRef(selectedCells);
  selectedCellsRef.current = selectedCells;

  const handleCellDrag = (x, y) => {
    const cellSize = 42; // Adjust this based on your design
    const columnIndex = Math.floor((x - offsetX) / cellSize);
    const rowIndex = Math.floor((y - offsetY) / cellSize);
    console.log('Drag', x, y, offsetY, rowIndex, columnIndex);
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
        ((lastSelectedIndex === -1) ||
          (lastSelectedIndex >= 0 &&
            Math.abs(rowIndex - selectedWord[lastSelectedIndex].rowIndex) <= 1 &&
            Math.abs(columnIndex - selectedWord[lastSelectedIndex].columnIndex) <= 1))
      ) {
        setSelectedWord([...selectedWord, { letter: selectedLetter, rowIndex, columnIndex }]);
        setSelectedCells([...selectedCellsRef.current, { row: rowIndex, col: columnIndex }]);
      }
    }
  } 

  const handlePanResponderGrant = (event, gestureState) => {
    setSelectedCells([]);
    console.log('Drag start');
    const { x0, y0 } = gestureState;
    handleCellDrag(x0, y0);
  };

  const handlePanResponderMove = (event, gestureState) => {
    const { moveX, moveY } = gestureState;
    handleCellDrag(moveX, moveY);
  };

  const onPanResponderRelease = () => {
    console.log('Drag end');
    // Check if the selectedWord forms a valid word (implement your own logic)
    const word = selectedWord.map(({ letter }) => letter).join('');
    console.log('Selected Word:', word);
    setSelectedWord([]);
    setSelectedCells([]);
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
      </View>

      <View ref={gridRef} 
      {...panResponder.panHandlers}
      onLayout={handleGridRender}>
        <FlatList
          data={grid}
          renderItem={({ item, index }) => (
            <View key={index} style={{ flexDirection: "row"}}>
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
    width: 40,
    height: 40,
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
