import React, { useState, useEffect } from 'react';
import JobCard from './components/JobCard';
import JobForm from './components/JobForm';
import FilterBar from './components/FilterBar';
import { dummyJobs } from './data/dummyJobs';
import { saveJobsToStorage, loadJobsFromStorage, saveDeletedJobs, loadDeletedJobs } from './utils/storage';

function App() {

  const addJob = (newJob) => {
    setJobs((prev) => {
      const alreadyExists = prev.some((job) => job.id === newJob.id);
      if (alreadyExists) return prev;

      setSuccessMessage("✅ Job added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);

      return [...prev, newJob];
    });
  };

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

  const activeJobs = jobs;
  const filteredActiveJobs = activeJobs.filter((job) => {
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

  const [successMessage, setSuccessMessage] = useState("");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
              Smart Job Tracker
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Organize, analyze, and streamline your job hunt
            </p>
          </header>


          {successMessage && (
            <div className="mb-4 px-4 py-2 bg-green-100 text-green-800 rounded border border-green-300">
              {successMessage}
            </div>
          )}

          <div className="mb-8">
            <JobForm onAddJob={addJob} />
          </div>

          <FilterBar
            selectedStatus={filter}
            onFilterChange={setFilter}
            searchQuery={search}
            onSearchChange={setSearch}
          />

          <div className="space-y-4 w-full">
            {filteredActiveJobs.length > 0 ? (
              filteredActiveJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onDelete={deleteJob}
                  onUpdate={updateJob}
                />
              ))
            ) : (
              <p className="text-gray-500">No jobs match your filters.</p>
            )}
          </div>

          {deletedJobs.length > 0 && (
            <div className="mt-10 border-t pt-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Recently Deleted</h2>
              <div className="space-y-2">
                {deletedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onDelete={() => {
                      // Permanent deletion
                      setDeletedJobs((prev) => prev.filter((j) => j.id !== job.id));
                    }}
                    onUpdate={() => restoreJob(job.id)}
                    isDeletedView={true}
                  />
                ))}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
