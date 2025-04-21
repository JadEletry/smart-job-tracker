import React, { useState, useEffect } from 'react';
import JobCard from './components/JobCard';
import JobForm from './components/JobForm';
import FilterBar from './components/FilterBar';
import { dummyJobs } from './data/dummyJobs';
import { saveJobsToStorage, loadJobsFromStorage, saveDeletedJobs, loadDeletedJobs } from './utils/storage';

function App() {

  const addJob = (newJob) =>
    setJobs(prev => {
      const alreadyExists = prev.some(job => job.id === newJob.id);
      return alreadyExists ? prev : [...prev, newJob];
    });

  const deleteJob = (id) => {
    setJobs(prev => {
      const jobToDelete = prev.find(j => j.id === id);
      if (!jobToDelete) return prev;

      setDeletedJobs((trash) => {
        const alreadyInTrash = trash.some(j => j.id === id);
        return alreadyInTrash ? trash : [...trash, jobToDelete];
      });

      return prev.filter(j => j.id !== id);
    });
  };


  const [jobs, setJobs] = useState(() => loadJobsFromStorage() || dummyJobs);
  const [deletedJobs, setDeletedJobs] = useState(() => loadDeletedJobs() || []);

  useEffect(() => {
    saveJobsToStorage(jobs);
  }, [jobs]);

  useEffect(() => {
    saveDeletedJobs(deletedJobs);
  }, [deletedJobs]);

  const updateJob = (updated) =>
    setJobs(prev => prev.map(job => (job.id === updated.id ? updated : job)));

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus = filter === "All" || job.status === filter;
    const matchesSearch = [job.company, job.role, job.location]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const restoreJob = (id) => {
    setDeletedJobs(prev => {
      const jobToRestore = prev.find(j => j.id === id);
      if (!jobToRestore) return prev;

      setJobs((curr) => {
        const alreadyExists = curr.some(j => j.id === id);
        return alreadyExists ? curr : [...curr, jobToRestore];
      });

      return prev.filter(j => j.id !== id);
    });
  };

// can take this out once we're done
  const resetApp = () => {
    localStorage.clear();
    window.location.reload(); // force refresh and reload dummyJobs
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              <span>📌</span> Smart Job Tracker
            </h1>
          </header>

          <div className="mb-8">
            <JobForm onAddJob={addJob} />
          </div>

          <FilterBar
            selectedStatus={filter}
            onFilterChange={setFilter}
            searchQuery={search}
            onSearchChange={setSearch}
          />

          {deletedJobs.length > 0 && (
            <div className="mt-10 border-t pt-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Recently Deleted</h2>
              <div className="space-y-2">
                {deletedJobs.map((job) => (
                  <div key={job.id} className="flex justify-between items-center bg-red-50 p-3 rounded border">
                    <div>
                      <p className="font-medium">{job.company} — {job.role}</p>
                      <p className="text-sm text-gray-600">Deleted: {job.dateApplied}</p>
                    </div>
                    <button
                      onClick={() => restoreJob(job.id)}
                      className="text-green-700 text-sm underline hover:font-semibold"
                    >
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 w-full">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDelete={deleteJob}
                onUpdate={updateJob}
              />
            ))}
          </div>
          
          {/* can take this out once we're done
           */}
          <button
            onClick={resetApp}
            className="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Reset All Jobs
          </button>

        </div>
      </div>
    </div>
  );
}

export default App;
