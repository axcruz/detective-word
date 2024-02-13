// createWordSearch.test.js
import { createWordSearch } from "../utils";
import { db } from "../firebase/config";

// Mocking the Firebase module
jest.mock("../firebase/config", () => ({}));

describe("createWordSearch", () => {
  it("should generate a valid word search puzzle", () => {
    const n = 6; // Adjust the puzzle size as needed
    const words = ["apple", "banana", "orange"]; // Adjust the words as needed

    const result = createWordSearch(n, words);

    // Check if the result is a valid n x n array
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(n);
    result.forEach(row => {
      expect(Array.isArray(row)).toBe(true);
      expect(row.length).toBe(n);
    });

    // Check if each word in the input array is present in the puzzle
    words.forEach(word => {
      const uppercasedWord = word.toUpperCase();
      let found = false;

      // Check horizontally, vertically, and diagonally
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (
            result[i].slice(j, j + word.length).join("") === uppercasedWord ||
            result.map(row => row[j]).slice(i, i + word.length).join("") === uppercasedWord ||
            result.map((row, k) => row[j + k]).slice(i, i + word.length).join("") === uppercasedWord
          ) {
            found = true;
          }
        }
      }

      expect(found).toBe(true);
    });
  });

  it("should handle invalid input and return null", () => {
    const n = 6;
    const invalidWords = ["apple", "banana", "grapefruit", "watermelon", "kiwi", "strawberry"]; // More words than allowed

    const result = createWordSearch(n, invalidWords);

    // Check if the result is null
    expect(result).toBeNull();
  });
});
