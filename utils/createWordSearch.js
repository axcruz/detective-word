// Helper function to generate random word search puzzles given the inputs (n, w).
// n is the dimension of the puzzle, the output will be a n x n array of letters.
// w is an array of words to be placed in to the puzzle. The size of w should be at most floor(n/2) and each word in w must be at most n characters long.
const createWordSearch = (n, w) => {
    // Check if each word is at most n characters long
    const isWordsValid = w.every(word => word.length <= n);

    if (!isWordsValid) {
        console.error('Error: Each word must be at most ' + n + ' characters long.');
        return null;
    }

    // Check if the number of words is at most floor(n/2)
    const maxWords = Math.floor(n / 2);
    if (w.length > maxWords) {
        console.error('Error: The total number of words must be at most ' + maxWords + '.');
        return null;
    }

    // Create an empty n x n array filled with empty strings
    const wordSearchArray = Array.from({ length: n }, () => Array(n).fill(''));

    const solutionArray = Array.from({ length: n }, () => Array(n).fill(''));

    // Use a Set to keep track of already placed positions
    const placedPositions = new Set();

    // Helper function to check if a position is already placed
    function isPositionPlaced(row, col) {
        return placedPositions.has(`${row},${col}`);
    }

    // Helper function to mark a position as placed
    function markPositionAsPlaced(row, col) {
        placedPositions.add(`${row},${col}`);
    }

    // Helper function to check if a word fits at a given position
    function canPlaceWord(word, row, col, direction) {
        if (direction === 'horizontal') {
            if (col + word.length > n) return false;
            for (let i = 0; i < word.length; i++) {
                if (isPositionPlaced(row, col + i) && wordSearchArray[row][col + i] !== word[i]) {
                    return false;
                }
            }
            return true;
        } else if (direction === 'vertical') {
            if (row + word.length > n) return false;
            for (let i = 0; i < word.length; i++) {
                if (isPositionPlaced(row + i, col) && wordSearchArray[row + i][col] !== word[i]) {
                    return false;
                }
            }
            return true;
        } else if (direction === 'diagonal') {
            if (row + word.length > n || col + word.length > n) return false;
            for (let i = 0; i < word.length; i++) {
                if (isPositionPlaced(row + i, col + i) && wordSearchArray[row + i][col + i] !== word[i]) {
                    return false;
                }
            }
            return true;
        }
    }

    // Helper function to place a word at a given position
    function placeWord(word, row, col, direction) {
        const transformWord = Math.random() < 0.5 ? word : word.split("").reverse().join(""); // Randomly reverse the order of the word

        if (direction === 'horizontal') {
            for (let i = 0; i < transformWord.length; i++) {
                wordSearchArray[row][col + i] = transformWord[i].toUpperCase();
                solutionArray[row][col + i] = transformWord[i].toUpperCase();
                markPositionAsPlaced(row, col + i);
            }
        } else if (direction === 'vertical') {
            for (let i = 0; i < transformWord.length; i++) {
                wordSearchArray[row + i][col] = transformWord[i].toUpperCase();
                solutionArray[row + i][col] = transformWord[i].toUpperCase();
                markPositionAsPlaced(row + i, col);
            }
        } else if (direction === 'diagonal') {
            for (let i = 0; i < transformWord.length; i++) {
                wordSearchArray[row + i][col + i] = transformWord[i].toUpperCase();
                solutionArray[row + i][col + i] = transformWord[i].toUpperCase();
                markPositionAsPlaced(row + i, col + i);
            }
        }
    }

    // Place each word in a random position and direction
    for (const word of w) {
        let placed = false;

        while (!placed) {
            const row = Math.floor(Math.random() * n);
            const col = Math.floor(Math.random() * n);
            const direction = ['horizontal', 'vertical', 'diagonal'][Math.floor(Math.random() * 3)];

            if (canPlaceWord(word, row, col, direction)) {
                placeWord(word, row, col, direction);
                placed = true;
            }
        }
    }

    // Fill empty cells with random letters
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (!isPositionPlaced(i, j)) {
                // Add random letter to empty cell
                const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                wordSearchArray[i][j] = randomLetter;
            }
        }
    }

    return {wordSearchArray, solutionArray};
}

export default createWordSearch;