import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SchemeNotifier.css';

// Helper function to extract benefit amount from text
const extractBenefitAmount = (benefitsText) => {
    const matches = benefitsText.match(/₹\s*([0-9,]+)/);
    if (matches) {
        return parseInt(matches[1].replace(/,/g, ''));
    }
    return 0;
};

// Helper function to calculate days between two dates
const daysBetween = (date1, date2) => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1 - date2) / oneDay));
};

const SchemeNotifier = ({ farmerProfile, filters }) => {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');

    // Subscribe to push notifications
    const subscribeToPush = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
            });
            
            // Send subscription to backend
            await axios.post('http://localhost:5000/api/schemes/subscribe', {
                subscription,
                farmerId: farmerProfile.id
            });
        } catch (error) {
            console.error('Error subscribing to push notifications:', error);
        }
    };

    useEffect(() => {
        fetchEligibleSchemes();
        // Check for updates every 6 hours
        const interval = setInterval(fetchEligibleSchemes, 6 * 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, [farmerProfile]);

    const fetchEligibleSchemes = async () => {
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5000/api/schemes/eligible', farmerProfile);
            setSchemes(response.data.schemes);
            setError(null);
        } catch (err) {
            setError('Failed to fetch schemes. Please try again later.');
            console.error('Error fetching schemes:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredSchemes = schemes
        .filter(scheme => {
            // Category filter
            if (activeCategory !== 'all' && scheme.category !== activeCategory) {
                return false;
            }

            // Benefit amount filter
            if (filters?.benefitRange !== 'all') {
                const amount = extractBenefitAmount(scheme.benefits);
                switch (filters.benefitRange) {
                    case '0-5000':
                        if (amount > 5000) return false;
                        break;
                    case '5000-20000':
                        if (amount < 5000 || amount > 20000) return false;
                        break;
                    case '20000-50000':
                        if (amount < 20000 || amount > 50000) return false;
                        break;
                    case '50000+':
                        if (amount < 50000) return false;
                        break;
                }
            }

            // Deadline filter
            if (filters?.deadline !== 'all') {
                const deadlineDate = new Date(scheme.deadline);
                const today = new Date();
                switch (filters.deadline) {
                    case 'week':
                        if (daysBetween(today, deadlineDate) > 7) return false;
                        break;
                    case 'month':
                        if (daysBetween(today, deadlineDate) > 30) return false;
                        break;
                    case 'ongoing':
                        if (scheme.deadline !== 'Ongoing') return false;
                        break;
                }
            }

            // Status filter
            if (filters?.status !== 'all') {
                const today = new Date();
                switch (filters.status) {
                    case 'new':
                        if (daysBetween(new Date(scheme.last_updated), today) > 7) return false;
                        break;
                    case 'updated':
                        if (!scheme.updated_at || daysBetween(new Date(scheme.updated_at), today) > 3) return false;
                        break;
                    case 'ending':
                        if (scheme.deadline === 'Ongoing' || daysBetween(today, new Date(scheme.deadline)) > 7) return false;
                        break;
                }
            }

            return true;
        });

    if (loading) return <div className="schemes-loading">Loading available schemes...</div>;
    if (error) return <div className="schemes-error">{error}</div>;

    return (
        <div className="schemes-container">
            <h2>Available Schemes & Subsidies</h2>
            
            <div className="schemes-categories">
                <button 
                    className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('all')}
                >
                    All Schemes
                </button>
                {['Direct Benefit Transfer', 'Insurance', 'Credit'].map(category => (
                    <button
                        key={category}
                        className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="schemes-grid">
                {filteredSchemes.map(scheme => (
                    <div key={scheme.scheme_id} className="scheme-card">
                        <h3>{scheme.title}</h3>
                        <p className="scheme-description">{scheme.description}</p>
                        
                        <div className="scheme-details">
                            <div className="scheme-detail">
                                <strong>Benefits:</strong>
                                <p>{scheme.benefits}</p>
                            </div>
                            
                            <div className="scheme-detail">
                                <strong>Eligibility:</strong>
                                <p>{scheme.eligibility}</p>
                            </div>

                            {scheme.deadline !== 'Ongoing' && (
                                <div className="scheme-deadline">
                                    <strong>Deadline:</strong>
                                    <p>{scheme.deadline}</p>
                                </div>
                            )}
                        </div>

                        <div className="scheme-actions">
                            <a 
                                href={scheme.application_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="apply-btn"
                            >
                                Apply Now
                            </a>
                            <button 
                                className="notify-btn"
                                onClick={() => {
                                    // Add to notifications/reminders
                                    console.log('Added to notifications:', scheme.title);
                                }}
                            >
                                Get Reminders
                            </button>
                        </div>

                        <div className="scheme-footer">
                            <span className="scheme-category">{scheme.category}</span>
                            <span className="scheme-state">{scheme.state}</span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredSchemes.length === 0 && (
                <div className="no-schemes">
                    <p>No schemes available in this category at the moment.</p>
                    <button onClick={fetchEligibleSchemes} className="refresh-btn">
                        Refresh Schemes
                    </button>
                </div>
            )}
        </div>
    );
};

export default SchemeNotifier;