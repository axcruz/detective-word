 // Helper function to query for levels related to an investigation, including the current player's score

 import { db } from "../firebase/config";

const getLevels = async (invId, playerId) => {
    try {
      // Retrieve investigation data
      const invRef = db.collection("investigations").doc(invId);
      const invDoc = await invRef.get();
  
      if (!invDoc.exists) {
        throw new Error("Investigation data not found.");
      }
      const invData = invDoc.data();
  
      // Retrieve level data
      const levelQuerySnapshot = await invRef.collection("levels").orderBy("order").get();
      const levelData = levelQuerySnapshot.docs.map((levelDoc) => ({
        id: levelDoc.id,
        ...levelDoc.data(),
        playerScore: -1, // Initialize playerScore as -1
      }));
  
      // If playerId is provided, fetch scores for the player by investigation
      if (playerId) {
        const scoresQuerySnapshot = await db.collection("scores")
          .where("invId", "==", invId)
          .where("playerId", "==", playerId)
          .get();
  
        scoresQuerySnapshot.forEach((scoreDoc) => {
          const scoreData = scoreDoc.data();
          const levelIndex = levelData.findIndex((level) => level.id === scoreData.levelId);
  
          if (levelIndex !== -1) {
            // Map playerScore to the corresponding level
            levelData[levelIndex].playerScore = scoreData.score;
          }
        });
      }
  
      // Return separate objects for investigation and levels
      return { invData, levelData };
    } catch (error) {
      throw error;
    }
  };
  
  export default getLevels;
  