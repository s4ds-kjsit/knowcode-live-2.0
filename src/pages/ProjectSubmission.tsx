import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure this path matches your Firebase configuration file
import { Button } from '../components/ui/button';

export function ProjectSubmission() {
  const [formData, setFormData] = useState({
    teamName: '',
    members: [''],
    title: '',
    description: '',
    repoUrl: '',
    demoUrl: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      await addDoc(collection(db, 'projects'), {
        teamName: formData.teamName,
        members: formData.members.filter(Boolean),
        title: formData.title,
        description: formData.description,
        repoUrl: formData.repoUrl || null,
        demoUrl: formData.demoUrl || null,
        createdAt: serverTimestamp(),
      });

      setMessage('Project submitted successfully!');
      setFormData({
        teamName: '',
        members: [''],
        title: '',
        description: '',
        repoUrl: '',
        demoUrl: '',
      });
    } catch (error) {
      console.error('Error submitting project:', error);
      setMessage('Failed to submit the project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Submit Your Project</h1>

      {message && (
        <p
          className={`mt-4 ${
            message.includes('successfully') ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}

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
            htmlFor="membersCount"
            className="block text-sm font-medium text-gray-700"
          >
            Number of Members
          </label>
          <input
            type="number"
            id="membersCount"
            value={formData.members.length}
            onChange={(e) => {
              let count = Number(e.target.value);
              // Clamp the count between 2 and 4
              count = Math.max(2, Math.min(4, count));
              setFormData({
                ...formData,
                members: Array.from({ length: count }, (_, i) =>
                  formData.members[i] || ''
                ),
              });
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            required
            min={2}
            max={4}
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
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Project'}
          </Button>
        </div>
      </form>
    </div>
  );
}
