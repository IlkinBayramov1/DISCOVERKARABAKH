import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { 
    User, LogOut, Briefcase, Heart, Wallet, Menu, 
    Bell, CheckCheck, Trash2, X, AlertCircle 
} from 'lucide-react';
import { WebHeaderWeather } from './WebHeaderWeather';
import { notificationApi } from '../../../shared/api/notification.api';
import type { INotification } from '../../../shared/types/notification.types';
import { io, Socket } from 'socket.io-client';
import { getToken } from '../../../shared/utils/token';
import logoImg from '../../../assets/dk-logo3.png';
import './WebHeader.css';

interface WebHeaderProps {
    onMenuClick: () => void;
}

function formatTimeAgo(dateStr: string) {
    try {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'İndi';
        if (diffMins < 60) return `${diffMins} dəqiqə öncə`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} saat öncə`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) return 'Dünən';
        return `${diffDays} gün öncə`;
    } catch {
        return '';
    }
}

// React.memo to optimize rendering of each notification item
const NotificationItem = memo(({ item, onClick, onDelete }: { 
    item: INotification; 
    onClick: (item: INotification) => void; 
    onDelete: (id: string, e: React.MouseEvent) => void;
}) => {
    return (
        <div 
            className={`notification-item ${!item.isRead ? 'unread' : ''}`}
            onClick={() => onClick(item)}
        >
            <div className="notification-icon-box">
                <AlertCircle size={16} />
            </div>
            <div className="notification-details">
                <p className="notification-title">{item.title}</p>
                <p className="notification-message">{item.message}</p>
                <span className="notification-time">{formatTimeAgo(item.createdAt)}</span>
            </div>
            <div className="notification-actions">
                {!item.isRead && <span className="unread-dot" />}
                <button 
                    className="delete-notification-btn" 
                    type="button" 
                    title="Sil"
                    onClick={(e) => onDelete(item.id, e)}
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
});

NotificationItem.displayName = 'NotificationItem';

export default function WebHeader({ onMenuClick }: WebHeaderProps) {
    const { isAuthenticated, user, logout } = useAuth();
    const userBalance = (user as any)?.balance ?? 0.00;
    const navigate = useNavigate();

    // Notifications states
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isBellAnimating, setIsBellAnimating] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loadingNotifications, setLoadingNotifications] = useState(false);

    // Toast queue (to display incoming real-time notifications briefly)
    const [toasts, setToasts] = useState<any[]>([]);

    const notificationsRef = useRef<HTMLDivElement>(null);

    // Reset notification states when user logged out/changed
    useEffect(() => {
        if (!isAuthenticated) {
            setNotifications([]);
            setIsNotificationsOpen(false);
            setIsBellAnimating(false);
            setPage(1);
            setHasMore(false);
            setToasts([]);
        }
    }, [isAuthenticated, user?.id]);

    // useMemo to calculate unread notifications count, capped at 50 max loaded items
    const unreadCount = useMemo(() => {
        return notifications.filter(n => !n.isRead).length;
    }, [notifications]);

    // Fetch paginated notifications with deduplication, max array limit of 50
    const fetchNotificationsList = useCallback((pageNum = 1, append = false) => {
        if (!isAuthenticated) return;
        setLoadingNotifications(true);
        notificationApi.getNotifications(pageNum, 15)
            .then(res => {
                if (res.success && res.data) {
                    const newItems = res.data.notifications || [];
                    
                    setNotifications(prev => {
                        let combined = append ? [...prev] : [];
                        
                        // Deduplicate newly fetched items
                        newItems.forEach(item => {
                            if (!combined.some(c => c.id === item.id)) {
                                combined.push(item);
                            }
                        });

                        // Keep only the most recent 50 notifications in memory
                        if (combined.length > 50) {
                            combined = combined.slice(0, 50);
                        }

                        return combined;
                    });

                    setHasMore(newItems.length >= 15);
                    setPage(pageNum);

                    // Trigger bell animation on initial load if unread count > 0 and dropdown is closed
                    if (res.data.unreadCount > 0 && !isNotificationsOpen) {
                        setIsBellAnimating(true);
                    }
                }
            })
            .catch(err => {
                console.error('Failed to fetch notifications:', err);
                // Graceful fallback to avoid app crashing
                if (!append) {
                    setNotifications([]);
                }
            })
            .finally(() => setLoadingNotifications(false));
    }, [isAuthenticated, isNotificationsOpen]);

    // Fetch initial list on mount/auth change
    useEffect(() => {
        if (isAuthenticated) {
            fetchNotificationsList(1, false);
        }
    }, [isAuthenticated, fetchNotificationsList]);

    // Setup Socket connection when user is loaded
    useEffect(() => {
        if (!isAuthenticated || !user?.id) return;

        const token = getToken();
        if (!token) return;

        const SOCKET_URL = import.meta.env.VITE_API_URL ? new URL(import.meta.env.VITE_API_URL).origin : '';
        const socket: Socket = io(SOCKET_URL, {
            auth: { token }
        });

        socket.on('connect', () => {
            console.log('🔗 Web Notifications Connected');
            // Refresh on connect/reconnect to sync state
            fetchNotificationsList(1, false);
        });

        socket.on('NOTIFICATION_CREATED', (data: INotification) => {
            console.log('🔔 New notification received:', data);

            // Deduplicate socket notification
            setNotifications(prev => {
                if (prev.some(n => n.id === data.id)) return prev;
                let updated = [data, ...prev];
                if (updated.length > 50) {
                    updated = updated.slice(0, 50);
                }
                return updated;
            });

            // Trigger bell animation if dropdown is not open
            if (!isNotificationsOpen) {
                setIsBellAnimating(true);
            }

            // Only show toast notifications for live socket events
            showToastBanner(data);
        });

        return () => {
            socket.off('NOTIFICATION_CREATED');
            socket.disconnect();
            console.log('🛑 Web Notifications Disconnected');
        };
    }, [isAuthenticated, user?.id, isNotificationsOpen, fetchNotificationsList]);

    // Toast showing helper
    const showToastBanner = useCallback((notification: INotification) => {
        const toastId = Math.random();
        setToasts(prev => {
            if (prev.some(t => t.id === notification.id)) return prev;
            const updated = [...prev, { ...notification, toastId }];
            if (updated.length > 3) {
                updated.shift();
            }
            return updated;
        });

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.toastId !== toastId));
        }, 4000);
    }, []);

    // Close dropdowns on outside clicks
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Notification click with link validation
    const handleNotificationClick = useCallback((item: INotification) => {
        if (!item.isRead) {
            notificationApi.markAsRead(item.id)
                .then(() => {
                    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, isRead: true } : n));
                })
                .catch(err => console.error('Failed to mark read:', err));
        }

        setIsNotificationsOpen(false);

        // Link validation: only relative paths starting with '/' to prevent Open Redirect/XSS
        if (item.link && item.link.startsWith('/')) {
            navigate(item.link);
        }
    }, [navigate]);

    // Handle single delete
    const handleDeleteNotification = useCallback((id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        notificationApi.deleteNotification(id)
            .then(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            })
            .catch(err => console.error('Failed to delete notification:', err));
    }, []);

    // Handle mark all read
    const handleMarkAllAsRead = useCallback(() => {
        notificationApi.markAllAsRead()
            .then(() => {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            })
            .catch(err => console.error('Failed to mark all read:', err));
    }, []);

    return (
        <header className="web-header">
            <div className="web-header__left">
                <div className="header-logo-container">
                    <button className="mobile-menu-btn" onClick={onMenuClick}>
                        <Menu size={24} /> 
                    </button>
                    <div className="header-logo-link">
                        <img src={logoImg} alt="Discover Karabakh Logo" className="header-logo" />
                    </div>
                </div>
                <div className="header-weather-wrapper">
                    <WebHeaderWeather />
                </div>
            </div>

            <div className="web-header__actions">
                {isAuthenticated ? (
                    <div className="user-profile-menu">
                        <div className="header-balance-card" title="Your Balance" onClick={() => navigate('/account/wallet')}>
                            <Wallet size={16} className="balance-icon" />
                            <span className="balance-amount">{userBalance.toFixed(2)} ₼</span>
                            <button className="deposit-btn" onClick={(e) => { e.stopPropagation(); navigate('/account/wallet'); }}>+</button>
                        </div>

                        {/* Notifications Dropdown */}
                        <div className="dk-notifications-dropdown-wrap" ref={notificationsRef}>
                            <button 
                                className={`dk-icon-btn notification ${isBellAnimating ? 'ringing' : ''}`} 
                                type="button" 
                                title="Notifications"
                                onClick={() => {
                                    const nextOpen = !isNotificationsOpen;
                                    setIsNotificationsOpen(nextOpen);
                                    if (nextOpen) {
                                        setIsBellAnimating(false);
                                    }
                                }}
                            >
                                <Bell size={18} />
                                {unreadCount > 0 && (
                                    <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                                )}
                            </button>

                            {isNotificationsOpen && (
                                <div className="dk-notifications-dropdown animation-slide-down">
                                    <div className="notifications-header">
                                        <h3>Bildirişlər</h3>
                                        {unreadCount > 0 && (
                                            <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
                                                <CheckCheck size={14} /> Hamısını oxundu et
                                            </button>
                                        )}
                                    </div>

                                    <div className="notifications-body">
                                        {notifications.length > 0 ? (
                                            <>
                                                {notifications.map(item => (
                                                    <NotificationItem 
                                                        key={item.id}
                                                        item={item}
                                                        onClick={handleNotificationClick}
                                                        onDelete={handleDeleteNotification}
                                                    />
                                                ))}
                                                {hasMore && (
                                                    <button 
                                                        className="load-more-notifications-btn"
                                                        onClick={() => fetchNotificationsList(page + 1, true)}
                                                        disabled={loadingNotifications}
                                                    >
                                                        {loadingNotifications ? 'Yüklənir...' : 'Daha çox yüklə'}
                                                    </button>
                                                )}
                                            </>
                                        ) : (
                                            <div className="notifications-empty-state">
                                                <Bell size={32} />
                                                <p>Hər hansı bildirişiniz yoxdur</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link to="/account/favorites" className="header-link fav-link" title="Favorites">
                            <Heart size={18} />
                            <span>Favorites</span>
                        </Link>

                        <Link to="/account/profile" className="header-link">
                            <User size={18} />
                            <span>{user?.name || 'Profile'}</span>
                        </Link>

                        <Link to="/account/trips" className="header-link">
                            <Briefcase size={18} />
                            <span>My Trips</span>
                        </Link>

                        <button className="header-logout-btn" onClick={logout}>
                            <LogOut size={16} />
                            <span>Logout</span>
                        </button>
                    </div>
                ) : (
                    <div className="header-auth-container">
                        <Link to="/auth/login" className="header-btn-outline hide-mobile">Login</Link>
                        <Link to="/auth/register" className="header-btn-primary hide-mobile">Register</Link>
                        <Link to="/auth/login" className="header-btn-primary show-mobile">
                            <User size={16} />
                            <span>Sign In</span>
                        </Link>
                    </div>
                )}
            </div>

            {/* Toasts Queue Portal */}
            <div className="dk-toast-portal">
                {toasts.map(toast => (
                    <div key={toast.toastId} className="dk-toast-notification animation-slide-in" onClick={() => handleNotificationClick(toast)}>
                        <div className="dk-toast-icon-box">
                            <Bell size={16} />
                        </div>
                        <div className="dk-toast-content">
                            <span className="dk-toast-title">{toast.title}</span>
                            <span className="dk-toast-message">{toast.message}</span>
                        </div>
                        <button className="dk-toast-close" onClick={(e) => { e.stopPropagation(); setToasts(prev => prev.filter(t => t.toastId !== toast.toastId)); }}>
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </header>
    );
}