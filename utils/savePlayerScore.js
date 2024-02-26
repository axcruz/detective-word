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
      var prevScore = existingScore.docs[0].score;

      if (prevScore === undefined) {
        prevScore = -1;
      } 

      if (score > prevScore) {
        await scoresRef.doc(docId).update({
          score,
          timestamp: new Date(),
        });
      }
    }
  } catch (error) {
    throw error;
  }
};

export default savePlayerScore;
