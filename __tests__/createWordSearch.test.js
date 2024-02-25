// createWordSearch.test.js

import { createWordSearch } from "../utils";
import { db } from "../firebase/config";

// Mocking the Firebase module
jest.mock('../firebase/config', () => ({
  db: {
    collection: jest.fn(),
  },
}));


describe("createWordSearch", () => {
  it("should generate a word search puzzle", () => {

    // Define the input parameters
    const dimension = 6;
    const words = ["apple", "banana", "cherry"];

    // Call the function
    const result = createWordSearch(dimension, words);

    // Define the expected structure of the result
    const expectedStructure = {
      wordSearchArray: expect.any(Array),
      solutionArray: expect.any(Array),
    };

    // Check if the result has the expected structure
    expect(result).toEqual(expectedStructure);

    // Check if the wordSearchArray and solutionArray have the correct dimensions
    expect(result.wordSearchArray.length).toBe(dimension);
    expect(result.wordSearchArray.every(row => row.length === dimension)).toBe(true);

    expect(result.solutionArray.length).toBe(dimension);
    expect(result.solutionArray.every(row => row.length === dimension)).toBe(true);

  });

  it("should handle invalid inputs and return null", () => {
    // Invalid words (length > dimension)
    const invalidWords1 = ["apple", "banana", "cherry", "grapefruit"];
    expect(createWordSearch(6, invalidWords1)).toBe(null);

    // Too many words (more than floor(dimension/2))
    const invalidWords2 = ["apple", "banana", "cherry"];
    expect(createWordSearch(4, invalidWords2)).toBe(null);

  });
});