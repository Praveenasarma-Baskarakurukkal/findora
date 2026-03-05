function SearchBar({ keyword, category, onKeywordChange, onCategoryChange }) {
  return (
    <div className="search-controls">
      <input
        type="text"
        placeholder="Search by item name or description"
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
      />

      <select
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
      >
        <option value="">All</option>
        <option value="NIC">NIC</option>
        <option value="Student ID">Student ID</option>
        <option value="Bank Card">Bank Card</option>
        <option value="Purse/Wallet">Purse/Wallet</option>
        <option value="Others">Others</option>
      </select>
    </div>
  )
}

export default SearchBar
