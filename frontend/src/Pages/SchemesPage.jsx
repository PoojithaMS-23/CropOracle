import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SchemeNotifier from '../components/SchemeNotifier';
import './SchemesPage.css';

const SchemesPage = ({ farmerProfile }) => {
    const [notifications, setNotifications] = useState([]);
    const [filters, setFilters] = useState({
        benefitRange: 'all',
        deadline: 'all',
        status: 'all'
    });

    useEffect(() => {
        // Request push notification permission
        if ('Notification' in window) {
            Notification.requestPermission();
        }

        // Set up push notification listener
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registered: ', registration);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed: ', error);
                });
        }
    }, []);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    return (
        <div className="schemes-page">
            <div className="schemes-header">
                <h1>Agricultural Schemes & Subsidies</h1>
                <div className="filters-container">
                    <div className="filter-group">
                        <label>Benefit Amount:</label>
                        <select 
                            value={filters.benefitRange}
                            onChange={(e) => handleFilterChange('benefitRange', e.target.value)}
                        >
                            <option value="all">All Amounts</option>
                            <option value="0-5000">Up to ₹5,000</option>
                            <option value="5000-20000">₹5,000 - ₹20,000</option>
                            <option value="20000-50000">₹20,000 - ₹50,000</option>
                            <option value="50000+">Above ₹50,000</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Deadline:</label>
                        <select 
                            value={filters.deadline}
                            onChange={(e) => handleFilterChange('deadline', e.target.value)}
                        >
                            <option value="all">All Deadlines</option>
                            <option value="week">Within a Week</option>
                            <option value="month">Within a Month</option>
                            <option value="ongoing">Ongoing</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Status:</label>
                        <select 
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="new">New Schemes</option>
                            <option value="updated">Recently Updated</option>
                            <option value="ending">Ending Soon</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="notifications-panel">
                <h2>Your Scheme Notifications</h2>
                <div className="notifications-list">
                    {notifications.map((notification, index) => (
                        <div key={index} className="notification-card">
                            <div className="notification-icon">🔔</div>
                            <div className="notification-content">
                                <h3>{notification.title}</h3>
                                <p>{notification.message}</p>
                                <span className="notification-time">
                                    {new Date(notification.timestamp).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))}
                    {notifications.length === 0 && (
                        <p className="no-notifications">No new notifications</p>
                    )}
                </div>
            </div>

            {/* Enhanced SchemeNotifier with filters */}
            <SchemeNotifier 
                farmerProfile={farmerProfile}
                filters={filters}
            />
        </div>
    );
};

export default SchemesPage;