import { db } from "../firebase/config";

// Helper function to get investigations data.
const getInvestigations= async () => {
  try {
    const investigationsCollection = db.collection("investigations");
    const querySnapshot = await investigationsCollection
      .orderBy("case_num")
      .get();

    const investigations = [];
    querySnapshot.forEach((doc) => {
      investigations.push({ id: doc.id, ...doc.data() });
    });

    return investigations;
  } catch (error) {
    throw error;
  }
};

export default getInvestigations;
