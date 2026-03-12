import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import FoundItemCard from '../components/FoundItemCard';
import { normalizeCategory } from '../utils/categoryUtils';
import { FOUND_ITEM_SORT, sortFoundItems } from '../utils/itemDisplayUtils';

const FoundItems = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sortBy: FOUND_ITEM_SORT.LATEST
  });

  const normalizeItem = (item) => ({
    id: item.id,
    name: item.name || item.item_name || 'Unnamed Item',
    description: item.description || '',
    location: item.location || 'Unknown location',
    date_found: item.date_found || item.date || item.created_at,
    image: item.image || (item.image_url ? `http://localhost:5000${item.image_url}` : 'https://via.placeholder.com/300x200?text=Item+Image'),
    category: normalizeCategory(item.category, item.name || item.item_name),
    type: item.type || 'found',
    status: item.status || 'active',
    created_at: item.created_at || null,
    posted_time: item.posted_time || item.created_at || item.date_found || item.date || null,
    posted_by: item.posted_by || {
      id: item.user_id,
      full_name: item.full_name || item.username || 'Unknown User'
    }
  });

  useEffect(() => {
    loadItems();
  }, [location.state?.refreshAt]);

  const loadItems = async () => {
    try {
      // Fetch all found posts from all users; no user_id/status restriction here.
      const response = await itemsAPI.getAll({ type: 'found' });
      const apiItems = response.data?.items || [];
      console.log('FoundItems fetched from API:', apiItems);
      const normalizedItems = apiItems.map(normalizeItem);
      setAllItems(normalizedItems);
    } catch (error) {
      console.error('Error loading found items:', error.response?.data || error.message);
      setAllItems([]);
    } finally {
      setLoading(false);
    }
  };

  const displayedItems = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase();

    const filteredItems = allItems.filter((item) => {
      const matchesCategory = !filters.category || item.category === filters.category;
      const matchesSearch = !searchTerm ||
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.location.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm);

      return matchesCategory && matchesSearch;
    });

    // Keep sorting behavior consistent with Dashboard and apply it after filtering.
    return sortFoundItems(filteredItems, filters.sortBy);
  }, [allItems, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const focusItemId = searchParams.get('focusItem');
    if (!focusItemId) return;

    const targetId = `found-item-${focusItemId}`;
    // Delay to ensure the card exists in DOM after list rendering.
    const timer = setTimeout(() => {
      const targetCard = document.getElementById(targetId);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [searchParams, displayedItems]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Found Items</h1>

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

        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
          <option value={FOUND_ITEM_SORT.LATEST}>Latest</option>
          <option value={FOUND_ITEM_SORT.NAME_ASC}>Alphabetical A {'->'} Z</option>
          <option value={FOUND_ITEM_SORT.NAME_DESC}>Alphabetical Z {'->'} A</option>
        </select>
      </div>

      <div className="items-grid">
        {displayedItems.length === 0 ? (
          <p>No found items available.</p>
        ) : (
          displayedItems.map((item) => (
            <FoundItemCard
              key={item.id}
              item={item}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FoundItems;
