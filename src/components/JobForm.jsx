import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { marked } from "marked";


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

    const handleAnalyze = async () => {
        try {
            const res = await fetch("https://smart-job-tracker-kth8.onrender.com/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jobDescription: form.jobDescription }),
            });

            const data = await res.json();

            if (!data.result) {
                alert("Something went wrong with the AI response.");
                return;
            }

            setForm(prev => ({
                ...prev,
                aiSummary: data.result,
            }));
        } catch (error) {
            console.error("Failed to analyze:", error);
            alert("Something went wrong analyzing the description.");
        }
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

            <textarea
                name="jobDescription"
                placeholder="Paste full job description to analyze"
                className="input col-span-2 h-40 mt-4"
                value={form.jobDescription || ''}
                onChange={handleChange}
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
                {form.jobDescription && (
                    <button
                        type="button"
                        onClick={handleAnalyze}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                    >
                        ✨ Analyze Description
                    </button>
                )}
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Add Job
                </button>
            </div>

            {form.aiSummary && (
                <div className="mt-4 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
                    <p className="text-gray-800 font-semibold mb-2 flex items-center gap-2">
                        🧠 AI Summary
                    </p>
                    <div
                        className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: marked.parse(form.aiSummary) }}
                    />
                </div>
            )}

        </form>
    );
}
