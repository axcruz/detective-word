// savePlyerScore.test.js

import { savePlayerScore } from "../utils";
import { db } from "../firebase/config";

// Mocking the Firebase module
jest.mock("../firebase/config", () => ({
  db: {
    collection: jest.fn(() => ({
      where: jest.fn(() => ({
        where: jest.fn(() => ({
          where: jest.fn(() => ({
            get: jest.fn(() => ({
              docs: [],
              empty: true,
            })),
          })),
        })),
      })),
      add: jest.fn(() => Promise.resolve({ id: "newDocumentId" })),
      doc: jest.fn(() => ({
        update: jest.fn(() => Promise.resolve()),
      })),
    })),
  },
}));

describe("savePlayerScore", () => {
  it("should save the player's score to the Firebase database", async () => {
    const invId = "testInvId";
    const levelId = "testLevelId";
    const playerId = "testPlayerId";
    const score = 100;

    await savePlayerScore(invId, levelId, playerId, score);

    // Check if the Firebase functions were called with the expected parameters
    expect(db.collection).toHaveBeenCalledWith("scores");
  });
});
