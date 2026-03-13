import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserContext } from '@/context/UserContext';
import { routes } from '@/utils/routes';
import { ComputerIcon } from 'lucide-react';

interface SidebarProps {
  isSidebarOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen }) => {
  const { user } = useUserContext();
  const pathname = useLocation().pathname;

  const filteredRoutes = routes.filter(route =>
    user ? route.roles.includes(user.role) && route?.name : false
  );

  return (
    <aside className={`w-48 bg-sidebar text-sidebar-foreground border-r border-sidebar-border fixed top-0 left-0 h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}>
      <div className="flex flex-col h-full">
        <div className="items-center justify-center h-16 bg-sidebar-primary hidden sm:flex">
          <ComputerIcon className="w-6 h-6 mr-3" />Logo
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-2 lg:mt-5">
            {filteredRoutes.map((route, index) => (
              <li key={index}>
                <Link to={route.path} className={`flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${(pathname === route.path || pathname.startsWith(`${route.path}/`)) ? 'bg-sidebar-primary text-sidebar-primary-foreground' : ''}`}>
                  {route.icon && <route.icon className="w-6 h-6 mr-3" />}
                  {route.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;