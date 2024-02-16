import { db } from "../firebase/config";

const getUserPrefs = async (playerId) => {
    try {
  
      // If playerId is provided, fetch preferences
      if (playerId) {
        const prefsQuerySnapshot = await db.collection("prefs")
          .where("uid", "==", playerId)
          .get();

          const prefs = [];
          prefsQuerySnapshot.forEach((doc) => {
            prefs.push({ id: doc.id, ...doc.data() });
          });
          return prefs;
        }


    } catch (error) {
      throw error;
    }
};
  
export default getUserPrefs;
