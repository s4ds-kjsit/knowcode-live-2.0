import React, { useState } from 'react';
import { useStore } from '../store';
import { Button } from '../components/ui/button';
import { Timer } from 'lucide-react';

export function Judging() {
  const { projects, criteria } = useStore();
  const addScore = useStore((state) => state.addScore);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState('');
  const [timer, setTimer] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const startTimer = () => {
    setTimer(300); // 5 minutes in seconds
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
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmitScores = () => {
    if (!selectedProject) return;

    Object.entries(scores).forEach(([criterionId, score]) => {
      addScore({
        projectId: selectedProject,
        judgeId: 'current-judge-id', // In a real app, this would come from auth
        criterionId,
        score,
        feedback,
        timestamp: new Date(),
      });
    });

    setSelectedProject(null);
    setScores({});
    setFeedback('');
    setTimer(null);
    setIsTimerRunning(false);
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
                    {project.teamName}
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
              Judging: {projects.find((p) => p.id === selectedProject)?.title}
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
                <p className="mt-1 text-sm text-gray-500">
                  {criterion.description}
                </p>
                <input
                  type="number"
                  id={criterion.id}
                  min="0"
                  max={criterion.maxScore}
                  value={scores[criterion.id] || ''}
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

            <div>
              <label
                htmlFor="feedback"
                className="block text-sm font-medium text-gray-700"
              >
                Feedback
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="flex space-x-4">
              <Button onClick={handleSubmitScores}>Submit Scores</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedProject(null);
                  setScores({});
                  setFeedback('');
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