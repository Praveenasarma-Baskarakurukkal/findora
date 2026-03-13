import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { itemsAPI } from '../services/api';
import FoundItemCard from '../components/FoundItemCard';
import Pagination from '../components/Pagination';
import { normalizeCategory } from '../utils/categoryUtils';
import { FOUND_ITEM_SORT } from '../utils/itemDisplayUtils';
import { sampleFoundItems } from '../data/sampleFoundItems';

const PAGE_SIZE = 4;
const API_HOST = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace('/api', '');

const FoundItems = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalElements: 0,
    pageNumber: 0,
    pageSize: PAGE_SIZE
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    sortBy: FOUND_ITEM_SORT.LATEST
  });
  const [searchInput, setSearchInput] = useState('');

  const normalizeItem = (item) => ({
    id: item.id,
    name: item.name || item.item_name || 'Unnamed Item',
    description: item.description || '',
    location: item.location || 'Unknown location',
    date_found: item.date_found || item.date || item.created_at,
    image: item.image || (item.image_url ? `${API_HOST}${item.image_url}` : 'https://via.placeholder.com/300x200?text=Item+Image'),
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

  const sortParam = useMemo(() => {
    if (filters.sortBy === FOUND_ITEM_SORT.NAME_ASC) {
      return 'name,asc';
    }
    if (filters.sortBy === FOUND_ITEM_SORT.NAME_DESC) {
      return 'name,desc';
    }
    return 'createdAt,desc';
  }, [filters.sortBy]);

  useEffect(() => {
    loadItems();
  }, [location.state?.refreshAt, currentPage, filters.category, filters.search, sortParam]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(0);
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  const loadItems = async () => {
    try {
      if (!loading) {
        setIsFetching(true);
      }

      const response = await itemsAPI.getAll({
        type: 'found',
        page: currentPage,
        size: PAGE_SIZE,
        sort: sortParam,
        category: filters.category || undefined,
        keyword: filters.search || undefined
      });

      const apiItems = response.data?.content || [];
      console.log('FoundItems fetched from API:', apiItems);
      const normalizedItems = apiItems.map(normalizeItem);
      const fallbackItems = sampleFoundItems.map(normalizeItem);
      setAllItems(normalizedItems);
      if (normalizedItems.length === 0) {
        setAllItems(fallbackItems);
      }

      setPagination({
        totalPages: response.data?.totalPages ?? (normalizedItems.length > 0 ? 0 : 1),
        totalElements: response.data?.totalElements ?? (normalizedItems.length > 0 ? 0 : fallbackItems.length),
        pageNumber: response.data?.pageNumber ?? currentPage,
        pageSize: response.data?.pageSize ?? PAGE_SIZE
      });
    } catch (error) {
      console.error('Error loading found items:', error.response?.data || error.message);
      setAllItems(sampleFoundItems.map(normalizeItem));
      setPagination({
        totalPages: 1,
        totalElements: sampleFoundItems.length,
        pageNumber: 0,
        pageSize: PAGE_SIZE
      });
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  const displayedItems = allItems;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(0);
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
    return (
      <div className="container page-shell">
        <div className="page-header">
          <div className="page-title-group">
            <h1>Found Items</h1>
            <p className="page-subtitle">Browse recently found items and quickly claim matches.</p>
          </div>
        </div>
        <div className="skeleton-grid">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      </div>
    );
  }

  return (
    <div className="container page-shell">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Found Items</h1>
          <p className="page-subtitle">Browse recently found items and quickly claim matches.</p>
        </div>
        <div className="page-actions">
          <Link to="/report-found" className="btn-primary page-action-btn">+ Report Found Item</Link>
        </div>
      </div>

      <div className="filters filter-bar">
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
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange}>
          <option value={FOUND_ITEM_SORT.LATEST}>Latest</option>
          <option value={FOUND_ITEM_SORT.NAME_ASC}>Alphabetical A {'->'} Z</option>
          <option value={FOUND_ITEM_SORT.NAME_DESC}>Alphabetical Z {'->'} A</option>
        </select>
      </div>

      {isFetching && <p className="list-refreshing">Refreshing results...</p>}

      <div className="items-grid">
        {displayedItems.length === 0 ? (
          <div className="empty-panel">
            <div className="empty-panel-icon">📦</div>
            <h3>No Found Items Yet</h3>
            <p>No found items are available right now.</p>
            <Link to="/report-found" className="empty-panel-action">Report a Found Item</Link>
          </div>
        ) : (
          displayedItems.map((item) => (
            <FoundItemCard
              key={item.id}
              item={item}
            />
          ))
        )}
      </div>

      <Pagination
        currentPage={pagination.pageNumber}
        totalPages={pagination.totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default FoundItems;
