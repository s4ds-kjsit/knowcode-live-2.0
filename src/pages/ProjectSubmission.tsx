import React, { useState } from 'react';
import { useStore } from '../store';
import { Button } from '../components/ui/button';

export function ProjectSubmission() {
  const addProject = useStore((state) => state.addProject);
  const [formData, setFormData] = useState({
    teamName: '',
    members: [''],
    title: '',
    description: '',
    repoUrl: '',
    demoUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProject({
      id: crypto.randomUUID(),
      ...formData,
      members: formData.members.filter(Boolean),
    });
    setFormData({
      teamName: '',
      members: [''],
      title: '',
      description: '',
      repoUrl: '',
      demoUrl: '',
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Submit Your Project</h1>
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label
            htmlFor="teamName"
            className="block text-sm font-medium text-gray-700"
          >
            Team Name
          </label>
          <input
            type="text"
            id="teamName"
            value={formData.teamName}
            onChange={(e) =>
              setFormData({ ...formData, teamName: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Project Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Project Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label
            htmlFor="repoUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Repository URL
          </label>
          <input
            type="url"
            id="repoUrl"
            value={formData.repoUrl}
            onChange={(e) =>
              setFormData({ ...formData, repoUrl: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="demoUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Demo URL
          </label>
          <input
            type="url"
            id="demoUrl"
            value={formData.demoUrl}
            onChange={(e) =>
              setFormData({ ...formData, demoUrl: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <Button type="submit">Submit Project</Button>
        </div>
      </form>
    </div>
  );
}