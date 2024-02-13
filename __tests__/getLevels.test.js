// getLevels.test.js
import { getLevels } from "../utils";
import { db } from "../firebase/config";

// Mocking the Firebase module
jest.mock("../firebase/config", () => ({
  db: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => ({
          exists: true,
          data: () => ({
            case_num: 1,
            name: "test",
          }),
        })),
        collection: jest.fn(() => ({
          orderBy: jest.fn(() => ({
            get: jest.fn(() => ({
              docs: [
                {
                  id: "1",
                  data: () => ({
                    /* Your mock level data */
                  }),
                },
              ],
            })),
          })),
        })),
      })),
    })),
  },
}));

describe("getLevels", () => {
  it("should retrieve investigation and level data", async () => {
    const invId = "validInvestigationId";
    const result = await getLevels(invId);

    // Check if the result has the expected structure
    expect(result).toEqual({
      invData: {
        case_num: 1,
        name: "test",
      },
      levelData: [
        {
          id: "1",
          /* Your mock level data */
        },
      ],
    });

    // Check if the mocked functions were called with the expected parameters
    expect(db.collection).toHaveBeenCalledWith("investigations");
  });
});
