// TourBookings.tsx - Yenilənmiş versiya
import { CalendarCheck, Search, Filter } from 'lucide-react';
import './TourBookings.css';

export default function TourBookings() {
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h1>Tour Bookings</h1>
                    <p>Manage reservations for your experiences</p>
                </div>
            </div>

            <div className="glassmorphism-card">
                <CalendarCheck size={48} />
                <h3>No Bookings Yet</h3>
                <p>When customers book your tours, they will appear here.</p>
                
                <div className="controls-row">
                    <div className="search-box">
                        <Search size={18} />
                        <input type="text" placeholder="Search bookings..." disabled />
                    </div>
                    <button className="btn-secondary" disabled>
                        <Filter size={18} /> Filter
                    </button>
                </div>
            </div>
        </div>
    );
}