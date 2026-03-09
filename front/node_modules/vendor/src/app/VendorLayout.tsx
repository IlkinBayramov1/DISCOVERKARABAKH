import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './VendorLayout.css';

export default function VendorLayout() {
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
