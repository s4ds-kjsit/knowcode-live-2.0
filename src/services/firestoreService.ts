import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // Ensure this points to your Firebase configuration

/**
 * Adds a new project to the Firestore database.
 * @param data - The project data to add.
 */
export async function addProject(data: {
  teamName: string;
  projectTitle: string;
  membersCount: number;
  projectDescription?: string;
  repositoryUrl?: string;
  demoUrl?: string;
}) {
  try {
    const docRef = await addDoc(collection(db, "projects"), {
      ...data,
      createdAt: serverTimestamp(), // Automatically adds a timestamp
    });
    console.log("Project added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding project: ", error);
  }
}

/**
 * Adds a rating to the Firestore database.
 * @param params - An object containing rating details.
 * @param params.projectId - The ID of the project being rated.
 * @param params.judgeEmail - The email of the judge submitting the rating.
 * @param params.criterionId - The ID of the criterion being rated.
 * @param params.score - The score given by the judge.
 * @param params.feedback - Optional feedback provided by the judge.
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
}) {
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
  }
}
