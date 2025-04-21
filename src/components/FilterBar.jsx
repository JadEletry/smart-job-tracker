export default function FilterBar({ selectedStatus, onFilterChange, searchQuery, onSearchChange }) {
    return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-medium">Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            className="border rounded px-3 py-1 bg-white"
          >
            <option value="All">All</option>
            <option value="Interested">Interested</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
  
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by company, role, location..."
          className="border rounded px-3 py-1 w-full md:w-72 bg-white"
        />
      </div>
    );
  }
  