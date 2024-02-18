import { db } from "../firebase/config";

const getScoreboard = async (invId) => {
  try {
    // Retrieve all scores for the investigation
    const scoresQuerySnapshot = await db.collection("scores")
      .where("invId", "==", invId)
      .get();

    // Create a map to store the total scores for each player along with usernames
    const playerScoresMap = new Map();

    // Fetch usernames for each playerId from the "prefs" table
    const prefsQuerySnapshot = await db.collection("prefs").get();
    const usernameMap = new Map();
    prefsQuerySnapshot.forEach((prefsDoc) => {
      const prefsData = prefsDoc.data();
      const playerId = prefsData.uid;
      const username = prefsData.username;
      usernameMap.set(playerId, username);
    });

    // Calculate total scores for each player
    scoresQuerySnapshot.forEach((scoreDoc) => {
      const scoreData = scoreDoc.data();
      const playerId = scoreData.playerId;
      const levelScore = scoreData.score;

      // Initialize the total score for the player if not present
      if (!playerScoresMap.has(playerId)) {
        playerScoresMap.set(playerId, {
          playerId: playerId,
          totalScore: 0,
          username: usernameMap.get(playerId) || "Unknown User",
        });
      }

      // Sum up the level scores for the player
      playerScoresMap.get(playerId).totalScore += levelScore;
    });

    // Convert the map to an array of objects for sorting
    const scoreboard = Array.from(playerScoresMap.values());

    // Sort the scoreboard in descending order based on totalScore
    scoreboard.sort((a, b) => b.totalScore - a.totalScore);

    // Add numerical rank to each player's score
    scoreboard.forEach((player, index) => {
      player.rank = index + 1;
    });

    return scoreboard;
  } catch (error) {
    throw error;
  }
};

export default getScoreboard;
