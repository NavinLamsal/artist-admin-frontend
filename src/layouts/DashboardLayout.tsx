import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface DashboardLayoutProps {
    children?: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);


    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar isSidebarOpen={isSidebarOpen} />
            <div className={`flex-1 flex flex-col ml-0 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : ''}`}>
                <Navbar setIsSidebarOpen={setIsSidebarOpen} />
                <main className="flex-1 p-6">
                    {children ? children : <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
