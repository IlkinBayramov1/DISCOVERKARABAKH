import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import WebHeader from '../WebHeader/WebHeader';
import './WebLayout.css';

export default function WebLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="web-layout">
            {/* Top-Level Full Width Header */}
            <WebHeader onMenuClick={toggleSidebar} />
            
            {/* Body containing Sidebar and Main Content */}
            <div className="web-body">
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)} 
                />
                
                <main className="web-main-content main-scrollable">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}