import { db } from "../firebase/config";

const getScoreboard = async (invId) => {
  try {
    // Retrieve all scores for the investigation
    const scoresQuerySnapshot = await db.collection("scores")
      .where("invId", "==", invId)
      .get();

    // Create a map to store the total scores for each player
    const playerScoresMap = new Map();

    // Calculate total scores for each player
    scoresQuerySnapshot.forEach((scoreDoc) => {
      const scoreData = scoreDoc.data();
      const playerId = scoreData.playerId;
      const levelScore = scoreData.score;

      // Initialize the total score for the player if not present
      if (!playerScoresMap.has(playerId)) {
        playerScoresMap.set(playerId, 0);
      }

      // Sum up the level scores for the player
      playerScoresMap.set(playerId, playerScoresMap.get(playerId) + levelScore);
    });

    // Convert the map to an array of objects for sorting
    const scoreboard = Array.from(playerScoresMap, ([playerId, totalScore]) => ({ playerId, totalScore }));

    // Sort the scoreboard in descending order based on totalScore
    scoreboard.sort((a, b) => b.totalScore - a.totalScore);

    return scoreboard;
  } catch (error) {
    throw error;
  }
};

export default getScoreboard;
