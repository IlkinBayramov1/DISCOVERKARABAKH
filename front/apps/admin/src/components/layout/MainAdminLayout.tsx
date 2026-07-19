import React from 'react';
import { Outlet } from 'react-router-dom';
import DesktopSidebar from './DesktopSidebar';
import TopHeader from './TopHeader';

const MainAdminLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-[#F0F2F5] overflow-hidden">
            {/* Sidebar */}
            <DesktopSidebar />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden ml-[280px]">
                {/* Header */}
                <TopHeader />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainAdminLayout;
