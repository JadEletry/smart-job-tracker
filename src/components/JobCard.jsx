import React, { useState } from 'react';

export default function JobCard({ job, onDelete, onUpdate, isDeletedView = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...job });
  const [showSummary, setShowSummary] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(form);
    setIsEditing(false);
  };

  return (
    <div className={`shadow rounded p-4 mb-4 border ${isDeletedView ? 'bg-red-50 border-red-300' : 'bg-white'}`}>
      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="company" value={form.company} onChange={handleChange} className="input" />
          <input name="role" value={form.role} onChange={handleChange} className="input" />
          <input name="location" value={form.location} onChange={handleChange} className="input" />
          <input name="dateApplied" type="date" value={form.dateApplied} onChange={handleChange} className="input" />
          <select name="status" value={form.status} onChange={handleChange} className="input">
            <option>Interested</option>
            <option>Applied</option>
            <option>Interviewing</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
          <input name="jobLink" value={form.jobLink} onChange={handleChange} className="input" />
          <textarea name="notes" value={form.notes} onChange={handleChange} className="input col-span-2" />
          {job.aiSummary && (
            <div className="mt-4 p-3 bg-gray-50 border rounded text-sm whitespace-pre-wrap">
              <p className="font-medium mb-1 text-gray-700">🧠 AI Summary:</p>
              <p>{job.aiSummary}</p>
            </div>
          )}
          <div className="col-span-2 flex gap-2 justify-end">
            <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Save</button>
            <button onClick={() => setIsEditing(false)} className="text-gray-600 hover:underline">Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">{job.company}</h2>
              <p className="text-gray-600">{job.role} — {job.location}</p>
              <p className="text-sm text-gray-500">Applied: {job.dateApplied}</p>
              <p className="text-sm">Status: <span className="font-medium">{job.status}</span></p>
              {job.notes && <p className="mt-2 text-sm italic text-gray-700">Notes: {job.notes}</p>}
            </div>

            {isDeletedView ? (
              <div className="flex gap-2 mt-4 justify-end">
                <button
                  onClick={onUpdate}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition text-sm"
                >
                  Restore
                </button>
                <button
                  onClick={onDelete}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm"
                >
                  Delete Permanently
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap justify-end gap-2 mt-2">
                <a
                  href={job.jobLink}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm"
                >
                  Job Link
                </a>

                {job.aiSummary && (
                  <button
                    onClick={() => setShowSummary(!showSummary)}
                    className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition text-sm"
                  >
                    {showSummary ? "Hide Summary" : "View AI Summary"}
                  </button>
                )}

                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(job.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {showSummary && job.aiSummary && !isDeletedView && (
            <div className="mt-4 p-3 bg-gray-50 border rounded text-sm whitespace-pre-wrap">
              <p className="font-medium mb-1 text-gray-700">🧠 AI Summary:</p>
              <p>{job.aiSummary}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
