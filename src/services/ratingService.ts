import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // Ensure this points to your Firebase configuration

/**
 * Adds a rating to the Firestore database.
 * @param {Object} rating - The rating data to be saved.
 * @param {string} rating.projectId - The ID of the project being rated.
 * @param {string} rating.judgeEmail - The email of the judge submitting the rating.
 * @param {string} rating.criterionId - The ID of the criterion being rated.
 * @param {number} rating.score - The score given by the judge.
 * @param {string} [rating.feedback] - Optional feedback provided by the judge.
 * @returns {Promise<void>} - A promise that resolves when the rating is added successfully.
 */
export async function addRating({
  projectId,
  judgeEmail,
  criterionId,
  score,
  feedback = "",
}: {
  projectId: string;
  judgeEmail: string;
  criterionId: string;
  score: number;
  feedback?: string;
}): Promise<void> {
  try {
    const ratingsCollection = collection(db, "ratings");
    await addDoc(ratingsCollection, {
      projectId,
      judgeEmail,
      criterionId,
      score,
      feedback,
      timestamp: serverTimestamp(),
    });
    console.log("Rating added successfully!");
  } catch (error) {
    console.error("Error adding rating:", error);
    throw error; // Re-throw the error so the caller knows something went wrong
  }
}
