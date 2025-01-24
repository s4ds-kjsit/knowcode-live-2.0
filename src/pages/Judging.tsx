import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Timer } from "lucide-react";
import { db, auth } from "../firebase"; // Import auth from your Firebase config
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export function Judging() {
  interface Project {
    id: string;
    title: string;
    teamName: string;
    status: string;
    projectUrl: string
  }
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [timer, setTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [judgeEmail, setJudgeEmail] = useState<string | null>(null);
  const [filter, setFilter] = useState("notJudged");

  const criteria = [
    { id: "1", name: "Impact", maxScore: 10, description: "How impactful is the project on its target audience?" },
    { id: "2", name: "Innovation", maxScore: 10, description: "How innovative is the project compared to existing solutions?" },
    { id: "3", name: "Feasibility", maxScore: 10, description: "How feasible is the project to implement in the real world?" },
    { id: "4", name: "Presentation", maxScore: 10, description: "How well was the project presented?" },
  ];

  const totalJudges = 3; // Specify the total number of judges required for a project

  // Fetch authenticated user's email
  useEffect(() => {
    const fetchUserEmail = () => {
      const user = auth.currentUser;
      if (user) {
        setJudgeEmail(user.email);
      }
    };

    fetchUserEmail();
  }, []);

  // Fetch projects and their judging statuses
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectCollection = collection(db, "projects");
        const projectSnapshot = await getDocs(projectCollection);

        const projectList = await Promise.all(
          projectSnapshot.docs.map(async (doc) => {
            const projectData = doc.data();
            
            const ratingsCollection = collection(db, "ratings");
            const ratingsQuery = query(ratingsCollection, where("projectId", "==", doc.id));
            const ratingsSnapshot = await getDocs(ratingsQuery);

            // Count ratings for each criterion by different judges
            const ratingsByJudge: Record<string, Set<string>> = {};
            ratingsSnapshot.forEach((ratingDoc) => {
              const { criterionId, judgeEmail } = ratingDoc.data();
              if (!ratingsByJudge[judgeEmail]) {
                ratingsByJudge[judgeEmail] = new Set();
              }
              ratingsByJudge[judgeEmail].add(criterionId);
            });

            // Calculate project status
            const judgesCompleted = Object.keys(ratingsByJudge).filter(
              (judge) => ratingsByJudge[judge].size === criteria.length
            ).length;

            const isCompleted = judgesCompleted === totalJudges;
            const isPartiallyJudged = judgesCompleted > 0 && judgesCompleted < totalJudges;

            return {
              id: doc.id,
              title: projectData.title,
              teamName: projectData.teamName,
              projectUrl: projectData.projectAbstract,
              status: isCompleted ? "completed" : isPartiallyJudged ? "partiallyJudged" : "notJudged",
            };
          })
        );

        setProjects(projectList);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
    console.log(projects)
  }, []);

  const startTimer = () => {
    setTimer(480); // 8 minutes in seconds
    setIsTimerRunning(true);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmitScores = async () => {
    if (!selectedProject || !judgeEmail) return;

    try {
      for (const [criterionId, score] of Object.entries(scores)) {
        const ratingDocRef = doc(db, "ratings", `${selectedProject}_${criterionId}_${judgeEmail}`);
        const existingDoc = await getDoc(ratingDocRef);

        // Overwrite or create a new document
        await setDoc(ratingDocRef, {
          projectId: selectedProject,
          criterionId,
          score,
          judgeEmail,
          timestamp: serverTimestamp(),
        });

        if (existingDoc.exists()) {
          console.log(`Updated score for ${criterionId}`);
        } else {
          console.log(`Added score for ${criterionId}`);
        }
      }

      console.log("Scores submitted successfully for project:", selectedProject);
      setSelectedProject(null);
      setScores({});
      setTimer(null);
      setIsTimerRunning(false);
    } catch (error) {
      console.error("Error submitting scores:", error);
    }
  };

  const filteredProjects = projects.filter((project) => project.status === filter);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Judge Projects</h1>

      {!selectedProject ? (
        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-900">Select a Project</h2>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Filter Projects</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="notJudged">Not Judged</option>
              <option value="partiallyJudged">Partially Judged</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="overflow-hidden rounded-lg bg-white shadow"
              >
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Team: {project.teamName}
                  </p>

                  <div className="mt-4">
                    <Button
                      onClick={() => setSelectedProject(project.id)}
                      variant="outline"
                    >
                      Start Judging
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="mb-6 flex items-center justify-between space-x-4">
            <h2 className="text-lg font-medium text-gray-900">
              {/* Judging: {projects.find((p) => p.id === selectedProject)?.title} */}
              Judging: {projects.find((p) => p.id === selectedProject)?.teamName} 

            </h2>
            <div className="flex items-center space-x-2">
              {timer !== null && (
                <div className="flex items-center space-x-2">
                  <Timer className="h-5 w-5 text-gray-500" />
                  <span className="text-lg font-medium text-gray-900">
                    {formatTime(timer)}
                  </span>
                </div>
              )}
              
            </div>
           
          </div>
          <div className="bg-green-600 rounded-lg p-3 mt-1 text-sm text-white max-w-[110px] mb-4">
                <a href={`${projects.find(p => p.id === selectedProject)?.projectUrl}`} target="_blank">View Abstract</a>
              </div>
          {!isTimerRunning && timer === null && (
            <Button onClick={startTimer} className="mb-6">
              Start Timer
            </Button>
          )}

          <div className="space-y-6">
            {criteria.map((criterion) => (
              <div key={criterion.id}>
                <label
                  htmlFor={criterion.id}
                  className="block text-sm font-medium text-gray-700"
                >
                  {criterion.name} (0-{criterion.maxScore})
                </label>
                <div className="mt-1 flex space-x-2">
                  {Array.from({ length: criterion.maxScore + 1 }, (_, i) => (
                    <label key={i}>
                      <input
                        type="radio"
                        name={criterion.id}
                        value={i}
                        checked={scores[criterion.id] === i}
                        onChange={() =>
                          setScores({
                            ...scores,
                            [criterion.id]: i,
                          })
                        }
                        className="mr-1"
                      />
                      {i}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex space-x-4">
              <Button onClick={handleSubmitScores}>Submit Scores</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedProject(null);
                  setScores({});
                  setTimer(null);
                  setIsTimerRunning(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
