/**
 * Notification Component (Placeholder)
 * 
 * Reusable notification/toast component for displaying alerts
 * This is a placeholder component to be developed
 * 
 * Props:
 * - message: Notification message
 * - type: 'success' | 'error' | 'warning' | 'info'
 * - duration: How long to display (ms), 0 for persistent
 * - onClose: Callback when notification closes
 */

import { useEffect, useState } from 'react';
import './Notification.css';

/**
 * Notification Component
 * @param {object} props - Component props
 * @param {string} props.message - Notification message
 * @param {string} props.type - Notification type: success, error, warning, info
 * @param {number} props.duration - Duration to show notification in ms
 * @param {Function} props.onClose - Callback when notification closes
 * @returns {React.ReactElement} Notification component
 */
function Notification({ message, type = 'info', duration = 5000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide notification after duration
  useEffect(() => {
    if (duration === 0) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
    onClose && onClose();
  };

  return (
    <div className={`notification notification-${type}`}>
      <span className="notification-message">{message}</span>
      <button className="notification-close" onClick={handleClose}>
        ×
      </button>
    </div>
  );
}

export default Notification;
