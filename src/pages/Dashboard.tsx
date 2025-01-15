import React, { useState, useEffect } from 'react';
import { Award, Users, Trophy } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [judges, setJudges] = useState([]);
  const [scores, setScores] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = () => {
      const currentUser = auth.currentUser;
      setUser(currentUser);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectCollection = collection(db, 'projects');
        const projectSnapshot = await getDocs(projectCollection);
        const projectList = projectSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProjects(projectList);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchJudges = async () => {
      try {
        const judgeCollection = collection(db, 'judges');
        const judgeSnapshot = await getDocs(judgeCollection);
        const activeJudges = judgeSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((judge) => judge.active); // Only include active judges
        setJudges(activeJudges);
      } catch (error) {
        console.error('Error fetching judges:', error);
      }
    };

    fetchJudges();
  }, []);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scoreCollection = collection(db, 'ratings');
        const scoreSnapshot = await getDocs(scoreCollection);
        const scoreList = scoreSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setScores(scoreList);
      } catch (error) {
        console.error('Error fetching scores:', error);
      }
    };

    fetchScores();
  }, []);

  const groupScoresByProject = (scores) => {
    const grouped = scores.reduce((acc, score) => {
      if (!acc[score.projectId]) {
        acc[score.projectId] = [];
      }
      acc[score.projectId].push(score);
      return acc;
    }, {});

    return Object.entries(grouped).map(([projectId, scores]) => ({
      projectId,
      totalScore: scores.reduce((sum, score) => sum + score.score, 0),
      criteria: scores.length,
    }));
  };

  const evaluationsComplete = groupScoresByProject(scores).length;

  const stats = [
    {
      name: 'Total Projects',
      value: projects.length,
      icon: Trophy,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Judges',
      value: judges.length,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      name: 'Evaluations Complete',
      value: evaluationsComplete,
      icon: Award,
      color: 'bg-purple-500',
    },
  ];

  const recentScores = groupScoresByProject(scores);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {user && (
        <div className="mt-4 text-sm text-gray-600">
          Logged in as: <span className="font-semibold">{user.email}</span>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="overflow-hidden rounded-lg bg-white shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon
                      className={`h-6 w-6 text-white p-1 rounded-md ${stat.color}`}
                    />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            {recentScores.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {recentScores.map((score) => (
                  <li key={score.projectId} className="py-4">
                    <p className="text-sm text-gray-900">
                      Project Title: <span className="font-medium">{score.projectId}</span>
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Total Score: {score.totalScore} ({score.criteria} Criteria)
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
