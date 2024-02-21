import { getUserPrefs } from "../utils";
import { db } from "../firebase/config";

// Mocking the Firebase module
jest.mock("../firebase/config", () => ({
  db: {
    collection: jest.fn(() => ({
      where: jest.fn(() => ({
        get: jest.fn(() => ({
          forEach: jest.fn(callback =>
            callback({
              id: "testId",
              data: () => ({
                /* Mocked user preferences data */
              }),
            })
          ),
        })),
      })),
    })),
  },
}));

describe("getUserPrefs", () => {
  it("should fetch user preferences", async () => {
    // Mock playerId
    const playerId = "testPlayerId";

    // Call the function
    const result = await getUserPrefs(playerId);

    // Expected user preferences data
    const expectedPrefs = {
      /* Expected user preferences data */
      "id": "testId", 
    };

    // Check if the result matches the expected user preferences
    expect(result).toEqual(expectedPrefs);

    // Check if the mocked Firestore functions were called with the expected parameters
    expect(db.collection).toHaveBeenCalledWith("prefs");
  });

  it("should handle the case when playerId is not provided", async () => {
    // Call the function without providing playerId
    const result = await getUserPrefs();

    // Expect the result to be null when playerId is not provided
    expect(result).toBe(undefined);
  });

});
