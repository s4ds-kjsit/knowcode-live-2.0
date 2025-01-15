import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Timer } from "lucide-react";
import { db, auth } from "../firebase"; // Import auth from your Firebase config
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

export function Judging() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [timer, setTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [judgeEmail, setJudgeEmail] = useState<string | null>(null);

  const criteria = [
    { id: "1", name: "Impact", maxScore: 20, description: "How impactful is the project on its target audience?" },
    { id: "2", name: "Innovation", maxScore: 20, description: "How innovative is the project compared to existing solutions?" },
    { id: "3", name: "Feasibility", maxScore: 20, description: "How feasible is the project to implement in the real world?" },
    { id: "4", name: "Presentation", maxScore: 20, description: "How well was the project presented?" },
  ];

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

  // Fetch projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectCollection = collection(db, "projects");
        const projectSnapshot = await getDocs(projectCollection);
        const projectList = projectSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectList);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
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
      const ratingsCollection = collection(db, "ratings");

      // Save scores for each criterion
      for (const [criterionId, score] of Object.entries(scores)) {
        await addDoc(ratingsCollection, {
          projectId: selectedProject,
          criterionId,
          score,
          judgeEmail, // Use the authenticated user's email
          timestamp: serverTimestamp(),
        });
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Judge Projects</h1>

      {!selectedProject ? (
        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-900">Select a Project</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
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
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Judging:{" "}
              {projects.find((p) => p.id === selectedProject)?.title}
            </h2>
            {timer !== null && (
              <div className="flex items-center space-x-2">
                <Timer className="h-5 w-5 text-gray-500" />
                <span className="text-lg font-medium text-gray-900">
                  {formatTime(timer)}
                </span>
              </div>
            )}
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
                <input
                  type="number"
                  id={criterion.id}
                  min="0"
                  max={criterion.maxScore}
                  value={scores[criterion.id] || ""}
                  onChange={(e) =>
                    setScores({
                      ...scores,
                      [criterion.id]: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
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
