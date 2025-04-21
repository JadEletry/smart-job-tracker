const STORAGE_KEY = 'smart-job-tracker';
const DELETED_KEY = 'smart-job-tracker-deleted';

export function saveJobsToStorage(jobs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

export function loadJobsFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function saveDeletedJobs(deleted) {
  localStorage.setItem(DELETED_KEY, JSON.stringify(deleted));
}

export function loadDeletedJobs() {
  const stored = localStorage.getItem(DELETED_KEY);
  return stored ? JSON.parse(stored) : [];
}
