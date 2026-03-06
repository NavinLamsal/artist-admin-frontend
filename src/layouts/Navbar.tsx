import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/UserContext';
import { LogOutIcon, Menu, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface NavbarProps {
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}


const Navbar = ({ setIsSidebarOpen }: NavbarProps) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
    const { user,logout } = useUserContext();
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully!");
        navigate('/login');
    };

   useEffect(() => {

    if (!isProfileMenuOpen) return;

    const id = requestAnimationFrame(() => {
      setIsProfileMenuOpen(false);
    });

    return () => cancelAnimationFrame(id);
  }, [location.pathname]);
      
    return (
        <nav className="bg-navbar border-b border-navbar-border flex justify-between lg:justify-end p-2 items-center">
            <Button size={'icon-sm'} variant={"ghost"} onClick={() => setIsSidebarOpen((prev: boolean) => !prev)} className="  lg:hidden p-2 text-gray-600 rounded hover:bg-gray-100">
                <Menu className="w-10 h-10" />
            </Button>

            <div className="flex items-center space-x-4 sm:hidden">
                <img src="logo.png" alt="Logo" className="h-16" />
            </div>

            <div className="relative">
                <button
                    onClick={() => setIsProfileMenuOpen(prev => !prev)}
                    type="button"
                    className="flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200 ease-in-out"
                >
                
                    <User className="w-10 h-10 rounded-full border-2 border-gray-300" />
                    <div className="ml-2">
                        <span className="block font-semibold text-gray-800">{user?.first_name + ' ' + user?.last_name}</span>
                        <span className="block text-sm text-gray-500">{user?.role === 'super_admin' ? 'Super Admin' : user?.role === 'artist_manager' ? 'Artist Manager' : "Artist"}</span>
                    </div>
                </button>

                <div className={`absolute right-0 mt-2 w-48 bg-navbar-accent-foreground text-navbar-accent border border-navbar-border rounded shadow-lg ${isProfileMenuOpen ? 'block' : 'hidden'}`}>
                    <ul className='p-0.5'>
                        <li>
                            <Link to="/manage-account" className="block px-4 py-2 text-navbar-accent hover:bg-navbar-primary hover:text-navbar-primary-foreground">
                                <User className="inline mr-2" />
                                Manage Account
                            </Link>
                        </li>
                        <li>
                            <Button
                                onClick={handleLogout}
                                className="block px-4 py-2  w-full text-left"
                            >
                                <LogOutIcon className="inline mr-2" />
                                Logout
                            </Button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
