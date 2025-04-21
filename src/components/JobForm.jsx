import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function JobForm({ onAddJob }) {

    const [form, setForm] = useState({
        company: '',
        role: '',
        location: '',
        dateApplied: '',
        status: 'Applied',
        jobLink: '',
        notes: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddJob({ ...form, id: uuidv4() });
        setForm({ company: '', role: '', location: '', dateApplied: '', status: 'Applied', jobLink: '', notes: '' });
    };

    return (

        <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="company" placeholder="Company" className="input" value={form.company} onChange={handleChange} required />
                <input name="role" placeholder="Role" className="input" value={form.role} onChange={handleChange} required />
                <input name="location" placeholder="Location" className="input" value={form.location} onChange={handleChange} />
                <input name="dateApplied" type="date" className="input" value={form.dateApplied} onChange={handleChange} />
                <select name="status" className="input" value={form.status} onChange={handleChange}>
                    <option>Interested</option>
                    <option>Applied</option>
                    <option>Interviewing</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                </select>

                <input name="jobLink" placeholder="Job Link" className="input" value={form.jobLink} onChange={handleChange} />
                <textarea name="notes" placeholder="Notes" className="input col-span-2" value={form.notes} onChange={handleChange} />
            </div>
            <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Job</button>
        </form>
    );
}
