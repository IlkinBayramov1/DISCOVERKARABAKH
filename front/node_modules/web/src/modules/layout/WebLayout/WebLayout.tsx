import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import WebHeader from '../WebHeader/WebHeader';
import './WebLayout.css';

export default function WebLayout() {
    return (
        <div className="web-layout">
            <Sidebar isOpen={true} onClose={() => {}} />
            <main className="web-main-content">
                <WebHeader />
                <div className="main-scrollable">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}