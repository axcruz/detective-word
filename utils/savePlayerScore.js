// utils/firebaseUtils.js
import { db } from "../firebase/config";

// Utility function to save the player's score for a level
const savePlayerScore = async (invId, levelId, playerId, score) => {
  try {
    const scoresRef = db.collection("scores");

    // Check if the document already exists for the player and level
    const existingScore = await scoresRef
      .where("invId", "==", invId)
      .where("levelId", "==", levelId)
      .where("playerId", "==", playerId)
      .get();

    if (existingScore.empty) {
      // If the document doesn't exist, create a new one
      await scoresRef.add({
        invId,
        levelId,
        playerId,
        score,
        timestamp: new Date(),
      });
    } else {
      // If the document exists, update the existing score if the score is higher
      const docId = existingScore.docs[0].id;
      const prevScore = existingScore.docs[0].score;

      if (score > prevScore) {
        await scoresRef.doc(docId).update({
          score,
          timestamp: new Date(),
        });
      }
      
    }

    console.log("Score saved successfully!");
  } catch (error) {
    console.error("Error saving score:", error.message);
    throw error;
  }
};

export default savePlayerScore;