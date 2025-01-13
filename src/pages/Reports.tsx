import React from 'react';
import { useStore } from '../store';

export function Reports() {
  const { projects, scores, criteria } = useStore();

  const getProjectScores = (projectId: string) => {
    const projectScores = scores.filter((s) => s.projectId === projectId);
    const totalScore = projectScores.reduce((acc, curr) => acc + curr.score, 0);
    const averageScore = totalScore / (projectScores.length || 1);
    return {
      total: totalScore,
      average: averageScore.toFixed(1),
      breakdown: criteria.map((criterion) => {
        const criterionScores = projectScores.filter(
          (s) => s.criterionId === criterion.id
        );
        const avg =
          criterionScores.reduce((acc, curr) => acc + curr.score, 0) /
          (criterionScores.length || 1);
        return {
          name: criterion.name,
          score: avg.toFixed(1),
        };
      }),
    };
  };

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