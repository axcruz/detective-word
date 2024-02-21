import { getScoreboard } from "../utils"; // Replace with the correct path
import { db } from "../firebase/config";

jest.mock("../firebase/config", () => ({
    db: {
        collection: jest.fn(() => ({
            where: jest.fn(() => ({
                get: jest.fn(() => ({
                    forEach: (callback) => {
                        // Simulate forEach on docs array
                        [
                            {
                                data: () => ({
                                    uid: "mockUserId1",
                                    username: "User1",
                                    playerId: "mockUserId1",
                                    invId: "mockInvId",
                                    score: 50,
                                }),
                            },
                            {
                                data: () => ({
                                    uid: "mockUserId2",
                                    username: "User2",
                                    playerId: "mockUserId2",
                                    invId: "mockInvId",
                                    score: 75,
                                }),
                            },
                            // Add more mock data as needed
                        ].forEach(callback);
                    },
                })),
            })),
        })),
    },
}));

describe("getScoreboard", () => {
    it("should fetch and calculate scoreboard correctly", async () => {
        // Call the function
        const result = await getScoreboard("mockInvId");

        // Assert the expected result based on your mock data
        expect(result).toEqual([
            {
                playerId: "mockUserId2",
                totalScore: 75,
                username: "User2",
                rank: 1,
            },
            {
                playerId: "mockUserId1",
                totalScore: 50,
                username: "User1",
                rank: 2,
            },
            // Add more assertions for additional players
        ]);
    });
});
