import { useState } from 'react';
import Button from './ui/Button';

function SearchFilter({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('order');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(value, filterType, sortBy);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    applyFilters(searchTerm, type, sortBy);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    applyFilters(searchTerm, filterType, sort);
  };

  const applyFilters = (search, filter, sort) => {
    onFilterChange({ search, filter, sort });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setSortBy('order');
    onFilterChange({ search: '', filter: 'all', sort: 'order' });
  };

  return (
    <div className="search-filter-container">
      {/* Search Bar */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <button 
            className="clear-search"
            onClick={() => handleSearchChange({ target: { value: '' } })}
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          <span>📋</span>
          All
        </button>
        <button
          className={`filter-btn ${filterType === 'pending' ? 'active' : ''}`}
          onClick={() => handleFilterChange('pending')}
        >
          <span>⏳</span>
          Pending
        </button>
        <button
          className={`filter-btn ${filterType === 'completed' ? 'active' : ''}`}
          onClick={() => handleFilterChange('completed')}
        >
          <span>✅</span>
          Completed
        </button>
        <button
          className={`filter-btn ${filterType === 'independent' ? 'active' : ''}`}
          onClick={() => handleFilterChange('independent')}
        >
          <span>🚀</span>
          Can Start
        </button>
        <button
          className={`filter-btn ${filterType === 'dependent' ? 'active' : ''}`}
          onClick={() => handleFilterChange('dependent')}
        >
          <span>🔗</span>
          Has Dependencies
        </button>
        <button
          className={`filter-btn ${filterType === 'quick' ? 'active' : ''}`}
          onClick={() => handleFilterChange('quick')}
        >
          <span>⚡</span>
          Quick Tasks
        </button>
      </div>

      {/* Sort Options */}
      <div className="sort-options">
        <label className="sort-label">Sort by:</label>
        <select 
          className="sort-select"
          value={sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="order">Order</option>
          <option value="duration-asc">Duration (Low to High)</option>
          <option value="duration-desc">Duration (High to Low)</option>
          <option value="title">Title (A-Z)</option>
        </select>
      </div>

      {/* Clear Filters */}
      {(searchTerm || filterType !== 'all' || sortBy !== 'order') && (
        <Button 
          variant="ghost" 
          size="small"
          icon="🔄"
          onClick={clearFilters}
          className="clear-filters-btn"
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}

export default SearchFilter;
