import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // Ensure the path to your Firebase config is correct

/**
 * Fetches all judging criteria from the Firestore `criteria` collection.
 * @returns {Promise<Array<{ id: string; name: string; maxScore: number; description: string }>>}
 */
export const fetchCriteria = async (): Promise<
  Array<{ id: string; name: string; maxScore: number; description: string }>
> => {
  try {
    const criteriaCollection = collection(db, "criteria");
    const criteriaSnapshot = await getDocs(criteriaCollection);
    return criteriaSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Array<{ id: string; name: string; maxScore: number; description: string }>;
  } catch (error) {
    console.error("Error fetching criteria: ", error);
    throw new Error("Could not fetch criteria.");
  }
};

/**
 * Adds a new criterion to the Firestore `criteria` collection.
 * @param {Object} data - The criterion data to add.
 * @param {string} data.name - The name of the criterion.
 * @param {number} data.maxScore - The maximum score for the criterion.
 * @param {string} data.description - A description of the criterion.
 * @returns {Promise<void>}
 */
export const addCriterion = async (data: {
  name: string;
  maxScore: number;
  description: string;
}): Promise<void> => {
  try {
    const criteriaCollection = collection(db, "criteria");
    await addDoc(criteriaCollection, {
      ...data,
      createdAt: serverTimestamp(),
    });
    console.log("Criterion added successfully!");
  } catch (error) {
    console.error("Error adding criterion: ", error);
    throw new Error("Could not add criterion.");
  }
};

// Example: Add a new criterion
const newCriterion = {
  name: "Impact",
  maxScore: 10,
  description: "How impactful is the project on its target audience?",
};

addCriterion(newCriterion)
  .then(() => console.log("Criterion added"))
  .catch((error) => console.error(error));
