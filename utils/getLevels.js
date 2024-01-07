import { db } from "../firebase/config";

// Helper function to query for levels related to an investigation
const getLevels = async (invId) => {
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
        }));
        // Return separate objects for investigation and levels
        return { invData, levelData };
    } catch (error) {
        throw error;
    }
};

export default getLevels;
