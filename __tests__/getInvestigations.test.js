// getInvestigations.test.js
import { getInvestigations } from "../utils";
import { db } from "../firebase/config";

// Mocking the Firebase module
jest.mock("../firebase/config", () => ({
  db: {
    collection: jest.fn(() => ({
      orderBy: jest.fn(() => ({
        get: jest.fn(() => ({
          forEach: jest.fn((callback) => {
            // Simulate iterating over mock documents
            [
              {
                id: "1",
                data: () => ({
                  case_num: 1,
                  name: "Investigation 1",
                  // Add other properties as needed
                }),
              },
              {
                id: "2",
                data: () => ({
                  case_num: 2,
                  name: "Investigation 2",
                  // Add other properties as needed
                }),
              },
              // Add more mock documents as needed
            ].forEach(callback);
          }),
        })),
      })),
    })),
  },
}));

describe("getInvestigations", () => {
  it("should retrieve investigations data", async () => {
    const result = await getInvestigations();

    // Check if the result has the expected structure
    expect(result).toEqual([
      {
        id: "1",
        case_num: 1,
        name: "Investigation 1",
        // Add other properties as needed
      },
      {
        id: "2",
        case_num: 2,
        name: "Investigation 2",
        // Add other properties as needed
      },
      // Add more expected investigation data as needed
    ]);

    // Check if the mocked functions were called with the expected parameters
    expect(db.collection).toHaveBeenCalledWith("investigations");

  });

});
