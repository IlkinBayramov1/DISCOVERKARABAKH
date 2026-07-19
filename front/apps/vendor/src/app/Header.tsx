import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, User, Building2, LogOut, ChevronDown, Trash2, Check, X, CheckCheck } from 'lucide-react';
import { useHotels } from '../modules/hotel/hooks/useHotels';
import { getVendorCategory, removeToken, getToken } from '../shared/utils/token';
import { httpClient } from '../shared/api/httpClient';
import { notificationApi } from '../shared/api/notification.api';
import type { INotification } from '../shared/types/notification.types';
import { io, Socket } from 'socket.io-client';
import './Header.css';

// Helper to format time ago in Azerbaijani
function formatTimeAgo(dateString: string) {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'Dəqiqə öncə';
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

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    
    // Notifications states
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isBellAnimating, setIsBellAnimating] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    
    // Toasts queue
    const [toasts, setToasts] = useState<any[]>([]);

    // Profile state
    const [profile, setProfile] = useState<any>(null);

    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);
    
    const category = getVendorCategory();
    const isHotelVendor = category === 'hotel';
    
    const { data: hotels } = useHotels(isHotelVendor);

    // Fetch user profile on mount
    useEffect(() => {
        httpClient<any>('/users/profile')
            .then(res => {
                if (res.success && res.data) {
                    setProfile(res.data);
                }
            })
            .catch(err => {
                console.error('Failed to load user profile:', err);
            });
    }, []);

    // Load initial notifications
    const fetchNotificationsList = (pageNum = 1, append = false) => {
        setLoadingNotifications(true);
        notificationApi.getNotifications(pageNum, 15)
            .then(res => {
                if (res.success && res.data) {
                    const newItems = res.data.notifications;
                    setNotifications(prev => append ? [...prev, ...newItems] : newItems);
                    setUnreadCount(res.data.unreadCount);
                    setHasMore(newItems.length >= 15);
                    setPage(pageNum);
                    
                    if (res.data.unreadCount > 0 && !isNotificationsOpen) {
                        setIsBellAnimating(true);
                    }
                }
            })
            .catch(err => console.error('Failed to fetch notifications:', err))
            .finally(() => setLoadingNotifications(false));
    };

    useEffect(() => {
        fetchNotificationsList(1, false);
    }, []);

    // Setup Socket connection when user ID is loaded
    useEffect(() => {
        if (!profile?.id) return;

        const token = getToken();
        if (!token) return;

        const SOCKET_URL = import.meta.env.VITE_API_URL ? new URL(import.meta.env.VITE_API_URL).origin : '';

        const socket: Socket = io(SOCKET_URL, {
            auth: { token }
        });

        socket.on('connect', () => {
            console.log('🔗 WebSocket Notifications Connected');
            // Refresh first page on initial connect / reconnect to ensure syncing
            fetchNotificationsList(1, false);
        });

        // Listen for new notifications
        socket.on('NOTIFICATION_CREATED', (data: INotification) => {
            console.log('🔔 New notification via socket:', data);
            
            // Add to list and increment unread count
            setNotifications(prev => [data, ...prev]);
            setUnreadCount(prev => prev + 1);

            // Trigger bell animation if dropdown is not open
            if (!isNotificationsOpen) {
                setIsBellAnimating(true);
            }

            // Add to toast queue
            showToastBanner(data);
        });

        return () => {
            socket.disconnect();
            console.log('🛑 WebSocket Notifications Disconnected');
        };
    }, [profile?.id, isNotificationsOpen]);

    // Handle toast banner showing
    const showToastBanner = (notification: INotification) => {
        const toastId = Math.random();
        
        setToasts(prev => {
            // Prevent duplicate toasts
            if (prev.some(t => t.id === notification.id)) return prev;
            const updated = [...prev, { ...notification, toastId }];
            // Limit to max 3 active toasts at once
            if (updated.length > 3) {
                updated.shift();
            }
            return updated;
        });

        // Auto remove after 4 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.toastId !== toastId));
        }, 4000);
    };

    // Close dropdowns on outside clicks
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredHotels = hotels ? hotels.filter(h =>
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.address.toLowerCase().includes(searchQuery.toLowerCase())
    ) : [];

    const handleSelectProperty = (id: string) => {
        setSearchQuery('');
        setIsSearchFocused(false);
        navigate(`/hotel/edit/${id}`);
    };

    const getRoleName = () => {
        switch (category) {
            case 'hotel': return 'Hotel Partner';
            case 'transport': return 'Transport Partner';
            case 'tour': return 'Tour Partner';
            case 'attraction': return 'Attraction Partner';
            case 'restaurant': return 'Food Partner';
            default: return 'Partner Portal';
        }
    };

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Action: Logout triggered');
        removeToken();
        window.location.replace('/vendor/login');
    };

    const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        notificationApi.markAsRead(id)
            .then(() => {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            })
            .catch(err => console.error('Failed to mark read:', err));
    };

    const handleDeleteNotification = (id: string, isNotificationUnread: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        notificationApi.deleteNotification(id)
            .then(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
                if (isNotificationUnread) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            })
            .catch(err => console.error('Failed to delete notification:', err));
    };

    const handleMarkAllAsRead = () => {
        notificationApi.markAllAsRead()
            .then(() => {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                setUnreadCount(0);
            })
            .catch(err => console.error('Failed to mark all read:', err));
    };

    const handleNotificationClick = (item: INotification) => {
        if (!item.isRead) {
            notificationApi.markAsRead(item.id)
                .then(() => {
                    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, isRead: true } : n));
                    setUnreadCount(prev => Math.max(0, prev - 1));
                })
                .catch(err => console.error('Failed to mark read on click:', err));
        }
        setIsNotificationsOpen(false);
        if (item.link) {
            navigate(item.link);
        }
    };

    const loadMoreNotifications = () => {
        if (loadingNotifications || !hasMore) return;
        fetchNotificationsList(page + 1, true);
    };

    // Build initials and name for profile avatar
    const getAvatarInitials = () => {
        if (profile?.vendorprofile?.companyName) {
            return profile.vendorprofile.companyName.slice(0, 2).toUpperCase();
        }
        if (profile?.firstName || profile?.lastName) {
            return ((profile.firstName?.[0] || '') + (profile.lastName?.[0] || '')).toUpperCase();
        }
        return 'KV';
    };

    const getDisplayName = () => {
        return profile?.vendorprofile?.companyName || 
            (profile ? `${profile.firstName} ${profile.lastName}` : 'Karabakh Vendor');
    };

    return (
        <header className="dk-vendor-header">
            
            {/* SEARCH AREA */}
            <div className="dk-header-search" ref={searchRef}>
                <div className={`search-input-wrap ${isSearchFocused ? 'focused' : ''}`}>
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search properties, reservations, or guests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                    />
                </div>

                {isHotelVendor && isSearchFocused && searchQuery.trim().length > 0 && (
                    <div className="dk-search-dropdown animation-slide-down">
                        <div className="dropdown-label">Search Results</div>
                        {filteredHotels.length > 0 ? (
                            filteredHotels.map(hotel => (
                                <div
                                    key={hotel.id}
                                    className="search-result-item"
                                    onClick={() => handleSelectProperty(hotel.id)}
                                >
                                    <div className="result-icon-box">
                                        <Building2 size={16} />
                                    </div>
                                    <div className="result-details">
                                        <span className="result-name">{hotel.name}</span>
                                        <span className="result-address">{hotel.address}</span>
                                    </div>
                                    <span className={`result-status ${hotel.status}`}>
                                        {hotel.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="search-empty-state">
                                No records found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ACTIONS AREA */}
            <div className="dk-header-actions">
                
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
                        <Bell size={20} />
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
                                            <div 
                                                key={item.id} 
                                                className={`notification-item ${!item.isRead ? 'unread' : ''}`}
                                                onClick={() => handleNotificationClick(item)}
                                            >
                                                <div className="notification-icon-box">
                                                    <Bell size={16} />
                                                </div>
                                                <div className="notification-item-content">
                                                    <span className="notification-item-title">{item.title}</span>
                                                    <span className="notification-item-message">{item.message}</span>
                                                    <span className="notification-item-time">{formatTimeAgo(item.createdAt)}</span>
                                                </div>
                                                <div className="notification-item-actions">
                                                    {!item.isRead && (
                                                        <button 
                                                            className="notification-action-btn"
                                                            title="Oxunmuş kimi qeyd et"
                                                            onClick={(e) => handleMarkAsRead(item.id, e)}
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                    )}
                                                    <button 
                                                        className="notification-action-btn delete"
                                                        title="Sil"
                                                        onClick={(e) => handleDeleteNotification(item.id, !item.isRead, e)}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        {hasMore && (
                                            <div className="load-more-container">
                                                <button 
                                                    className="load-more-btn"
                                                    onClick={loadMoreNotifications}
                                                    disabled={loadingNotifications}
                                                >
                                                    {loadingNotifications ? 'Yüklənir...' : 'Daha çox yüklə'}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="notifications-empty">
                                        <Bell size={24} style={{ opacity: 0.4 }} />
                                        <span>Yeni bildirişiniz yoxdur</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="dk-header-divider"></div>

                {/* Profile Area */}
                <div className="dk-profile-dropdown-wrap" ref={profileRef}>
                    <button 
                        className="dk-profile-trigger" 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                    >
                        <div className="profile-avatar">
                            <span className="avatar-initial">{getAvatarInitials()}</span>
                        </div>
                        <div className="profile-info">
                            <span className="profile-name">{getDisplayName()}</span>
                            <span className="profile-role">{getRoleName()}</span>
                        </div>
                        <ChevronDown size={16} className={`dropdown-arrow ${isProfileOpen ? 'open' : ''}`} />
                    </button>

                    {isProfileOpen && (
                        <div className="dk-profile-dropdown animation-slide-down">
                            <div className="dropdown-header">
                                <span className="user-email">{profile?.email || 'vendor@discoverkarabakh.az'}</span>
                            </div>
                            <div className="dropdown-body">
                                <button className="dropdown-item" onClick={() => { setIsProfileOpen(false); navigate('/vendor/settings'); }}>
                                    <User size={16} /> Account Settings
                                </button>
                                <button className="dropdown-item logout" onClick={handleLogout}>
                                    <LogOut size={16} /> Secure Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Toast System Portal */}
            <div className="dk-toast-container">
                {toasts.map(t => (
                    <div key={t.toastId} className="dk-toast-item" onClick={() => {
                        setToasts(prev => prev.filter(item => item.toastId !== t.toastId));
                        handleNotificationClick(t);
                    }}>
                        <div className="dk-toast-icon-box">
                            <Bell size={14} />
                        </div>
                        <div className="dk-toast-content">
                            <span className="dk-toast-title">{t.title}</span>
                            <span className="dk-toast-message">{t.message}</span>
                        </div>
                        <button 
                            className="dk-toast-close"
                            onClick={(e) => {
                                e.stopPropagation();
                                setToasts(prev => prev.filter(item => item.toastId !== t.toastId));
                            }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>

        </header>
    );
}