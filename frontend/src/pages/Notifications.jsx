import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { sampleNotifications } from '../data/sampleNotifications';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await notificationsAPI.getAll();
      const apiNotifications = response.data.notifications || [];
      setNotifications(apiNotifications.length > 0 ? apiNotifications : sampleNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications(sampleNotifications);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      loadNotifications();
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      toast.success('All marked as read');
      loadNotifications();
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationsAPI.delete(id);
      toast.success('Notification deleted');
      loadNotifications();
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const getNotificationMeta = (type) => {
    if (type === 'match') return { icon: '🎯', label: 'Match' };
    if (type === 'reminder') return { icon: '⏰', label: 'Reminder' };
    return { icon: '🔔', label: 'System' };
  };

  if (loading) {
    return (
      <div className="container page-shell notifications-page">
        <div className="page-header">
          <div className="page-title-group">
            <h1>Notifications</h1>
            <p className="page-subtitle">Stay updated on matches, claim status, and account events.</p>
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
    <div className="container page-shell notifications-page">
      <div className="page-header notifications-header">
        <div className="page-title-group">
          <h1>Notifications</h1>
          <p className="page-subtitle">Stay updated on matches, claim status, and account events.</p>
        </div>
        {notifications.some(n => !n.is_read) && (
          <div className="page-actions">
            <button onClick={markAllAsRead} className="btn-secondary page-action-btn">Mark All as Read</button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="notifications-empty">No notifications.</p>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => {
            const meta = getNotificationMeta(notification.type);
            return (
            <div key={notification.id} className={`notification-card ${notification.is_read ? 'read' : 'unread'}`}>
              <div className="notification-content">
                <span className={`notification-type notification-type-${notification.type}`}>
                  <span className="notification-type-icon" aria-hidden="true">{meta.icon}</span>
                  {meta.label}
                </span>
                <h3 className="notification-title">{notification.title}</h3>
                <p className="notification-message">{notification.message}</p>
                <small className="notification-time">{new Date(notification.created_at).toLocaleString()}</small>
              </div>
              <div className="notification-actions">
                {notification.type === 'match' && notification.found_item_id && (
                  <Link
                    to={`/found-items?focusItem=${notification.found_item_id}`}
                    className="btn-link"
                    onClick={() => {
                      if (!notification.is_read) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    View Match
                  </Link>
                )}
                {!notification.is_read && (
                  <button onClick={() => markAsRead(notification.id)} className="btn-link">Mark as Read</button>
                )}
                <button onClick={() => deleteNotification(notification.id)} className="btn-link delete">Delete</button>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
};

export default Notifications;
