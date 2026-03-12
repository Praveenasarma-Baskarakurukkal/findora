import React, { useState, useEffect } from 'react';
import { itemsAPI } from '../services/api';
import ItemCard from '../components/ItemCard';
import { FOUND_ITEM_SORT, sortFoundItems } from '../utils/itemDisplayUtils';

const LostItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });

  useEffect(() => {
    loadItems();
  }, [filters]);

  const loadItems = async () => {
    try {
      // My Lost Items shows only the logged-in user's lost posts.
      const response = await itemsAPI.getMy({ type: 'lost' });
      const myLostItems = (response.data.items || []).filter((item) => item.type === 'lost');
      const searchTerm = filters.search.trim().toLowerCase();

      const filteredItems = myLostItems.filter((item) => {
        const matchesCategory = !filters.category || item.category === filters.category;
        const matchesSearch = !searchTerm
          || (item.item_name || '').toLowerCase().includes(searchTerm)
          || (item.description || '').toLowerCase().includes(searchTerm)
          || (item.location || '').toLowerCase().includes(searchTerm)
          || (item.category || '').toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
      });

      setItems(sortFoundItems(filteredItems, FOUND_ITEM_SORT.LATEST));
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>My Lost Items</h1>

      <div className="filters">
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          <option value="NIC">NIC</option>
          <option value="Student ID">Student ID</option>
          <option value="Bank Card">Bank Card</option>
          <option value="Wallet">Wallet</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          name="search"
          placeholder="Search items..."
          value={filters.search}
          onChange={handleFilterChange}
        />
      </div>

      <div className="items-grid">
        {items.length === 0 ? (
          <p>You have not posted any lost items yet.</p>
        ) : (
          items.map(item => <ItemCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
};

export default LostItems;
