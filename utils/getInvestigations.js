import { db } from "../firebase/config";

const getInvestigations = async (playerId) => {
  try {
    const investigationsCollection = db.collection("investigations");
    const querySnapshot = await investigationsCollection
      .orderBy("case_num")
      .get();

    const investigations = [];

    // Iterate through each investigation
    for (const doc of querySnapshot.docs) {
      const investigationData = { id: doc.id, ...doc.data() };

      // Fetch scores for the current investigation
      const scoresSnapshot = await db
        .collection("scores")
        .where("invId", "==", doc.id)
        .where("playerId", "==", playerId)
        .get();

      let totalLevelsCompleted = 0;
      let totalScore = 0;

      // Calculate total levels completed and total score
      scoresSnapshot.forEach((scoreDoc) => {
        const scoreData = scoreDoc.data();
        if (scoreData.score > 0) {
          totalLevelsCompleted += 1;
        }
        totalScore += scoreData.score || 0;
      });

      // Add total levels completed and total score to the investigation data
      investigationData.totalLevelsCompleted = totalLevelsCompleted;
      investigationData.totalScore = totalScore;

      investigations.push(investigationData);
    }

    return investigations;
  } catch (error) {
    throw error;
  }
};

export default getInvestigations;
