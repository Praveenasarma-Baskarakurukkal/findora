/**
 * ItemCard Component (Placeholder)
 * 
 * Reusable component for displaying lost/found items
 * This is a placeholder component to be developed
 * 
 * Props:
 * - item: Object containing item details
 * - cardType: 'lost' | 'found'
 * - onClaim: Callback function for claiming an item
 */

import './ItemCard.css';

/**
 * ItemCard Component
 * @param {object} props - Component props
 * @param {object} props.item - Item details object
 * @param {string} props.cardType - Type of card: 'lost' or 'found'
 * @param {Function} props.onClaim - Callback when item is claimed
 * @returns {React.ReactElement} Item card component
 */
function ItemCard({ item, cardType = 'found', onClaim }) {
  const handleClaim = () => {
    if (onClaim) {
      onClaim(item.id);
    }
  };

  return (
    <div className={`item-card ${cardType}-item`}>
      <div className="item-header">
        <span className="item-type-badge">{cardType.toUpperCase()}</span>
        <span className="item-date">{item.date || 'N/A'}</span>
      </div>

      <div className="item-body">
        <h3 className="item-name">{item.name || 'Unknown Item'}</h3>
        <p className="item-description">{item.description || 'No description provided'}</p>

        <div className="item-details">
          <span className="detail-label">Location: </span>
          <span className="detail-value">{item.location || 'Unknown'}</span>
        </div>

        {item.category && (
          <div className="item-details">
            <span className="detail-label">Category: </span>
            <span className="detail-value">{item.category}</span>
          </div>
        )}
      </div>

      <div className="item-footer">
        <button className="item-btn view-btn">View Details</button>
        {cardType === 'found' && (
          <button className="item-btn claim-btn" onClick={handleClaim}>
            Claim Item
          </button>
        )}
      </div>
    </div>
  );
}

export default ItemCard;
