import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import WebHeader from '../WebHeader/WebHeader';
import './WebLayout.css';

export default function WebLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Səhifə keçidlərini izləmək və main qutusunu tapmaq üçün
    const location = useLocation();
    const mainContentRef = useRef<HTMLElement>(null);

    // Hər dəfə pathname (link) dəyişəndə scroll-u ən yuxarı çək
    useEffect(() => {
        if (mainContentRef.current) {
            // Səhifə dəyişəndə anında (və ya smooth) yuxarı qalxması üçün
            mainContentRef.current.scrollTo({ top: 0, behavior: 'auto' });
        }
    }, [location.pathname]);

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
                
                {/* ref={mainContentRef} əlavə edildi ki, JavaScript bu qutunu idarə edə bilsin */}
                <main ref={mainContentRef} className="web-main-content main-scrollable">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}