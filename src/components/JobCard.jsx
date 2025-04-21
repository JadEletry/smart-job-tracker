import React, { useState } from 'react';

export default function JobCard({ job, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...job });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(form);
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow rounded p-4 border mb-4">
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
          <div className="col-span-2 flex gap-2 justify-end">
            <button onClick={handleSave} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Save</button>
            <button onClick={() => setIsEditing(false)} className="text-gray-600 hover:underline">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">{job.company}</h2>
            <p className="text-gray-600">{job.role} — {job.location}</p>
            <p className="text-sm text-gray-500">Applied: {job.dateApplied}</p>
            <p className="text-sm">Status: <span className="font-medium">{job.status}</span></p>
            {job.notes && <p className="mt-2 text-sm italic text-gray-700">Notes: {job.notes}</p>}
          </div>

          <div className="flex flex-col items-end gap-2">
            <a href={job.jobLink} target="_blank" rel="noreferrer" className="text-blue-600 underline">Job Link</a>
            <button onClick={() => setIsEditing(true)} className="text-yellow-600 text-sm hover:underline">Edit</button>
            <button onClick={() => onDelete(job.id)} className="text-red-600 text-sm hover:underline">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
