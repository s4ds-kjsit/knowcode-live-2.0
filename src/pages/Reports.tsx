import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Ensure the path to your Firebase config is correct

export function Reports() {
  const [projects, setProjects] = useState([]);
  const [criteria, setCriteria] = useState([]);
  const [ratings, setRatings] = useState([]);

  // Fetch projects from Firestore
  const fetchProjects = async () => {
    const projectCollection = collection(db, "projects");
    const projectSnapshot = await getDocs(projectCollection);
    const projectList = projectSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProjects(projectList);
  };

  // Fetch criteria from Firestore
  const fetchCriteria = async () => {
    const criteriaCollection = collection(db, "criteria");
    const criteriaSnapshot = await getDocs(criteriaCollection);
    const criteriaList = criteriaSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCriteria(criteriaList);
  };

  // Fetch ratings from Firestore
  const fetchRatings = async () => {
    const ratingsCollection = collection(db, "ratings");
    const ratingsSnapshot = await getDocs(ratingsCollection);
    const ratingsList = ratingsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRatings(ratingsList);
  };

  useEffect(() => {
    fetchProjects();
    fetchCriteria();
    fetchRatings();
  }, []);

  // Function to calculate scores for a project
  const getProjectScores = (projectId: string) => {
    const projectRatings = ratings.filter((r) => r.projectId === projectId);

    const totalScore = projectRatings.reduce((acc, curr) => acc + curr.score, 0);
    const averageScore = totalScore / (projectRatings.length || 1);

    const breakdown = criteria.map((criterion) => {
      const criterionRatings = projectRatings.filter(
        (r) => r.criterionId === criterion.id
      );
      const totalCriterionScore = criterionRatings.reduce(
        (acc, curr) => acc + curr.score,
        0
      );
      const averageCriterionScore =
        totalCriterionScore / (criterionRatings.length || 1);

      return {
        name: criterion.name,
        score: averageCriterionScore.toFixed(1),
        total: totalCriterionScore,
        individualScores: criterionRatings.map((r) => r.score),
      };
    });

    return {
      total: totalScore,
      average: averageScore.toFixed(1),
      breakdown,
    };
  };

  // Sort projects by average score
  const sortedProjects = [...projects].sort((a, b) => {
    const aScore = getProjectScores(a.id).average;
    const bScore = getProjectScores(b.id).average;
    return Number(bScore) - Number(aScore);
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

      <div className="mt-6">
        <h2 className="text-lg font-medium text-gray-900">Project Rankings</h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rank
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Project
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Team
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Average Score
                </th>
                {criteria.map((criterion) => (
                  <th
                    key={criterion.id}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {criterion.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProjects.map((project, index) => {
                const projectScores = getProjectScores(project.id);
                return (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.teamName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {projectScores.average}
                    </td>
                    {projectScores.breakdown.map((breakdown, i) => (
                      <td
                        key={i}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {breakdown.score}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
