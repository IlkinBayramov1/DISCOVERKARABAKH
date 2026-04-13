import { Outlet, Navigate } from 'react-router-dom';
import { isAuthenticated } from '../shared/utils/token';
import Sidebar from './Sidebar';
import Header from './Header';
import './VendorLayout.css';

export default function VendorLayout() {
    // AUTH GUARD: Strictly redirect to login if no valid token is found
    if (!isAuthenticated()) {
        console.warn('Unauthorized access attempt - redirecting to login');
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="vendor-layout">
            <Sidebar />
            <div className="vendor-main-content">
                <Header />
                <main className="vendor-page-wrapper">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
