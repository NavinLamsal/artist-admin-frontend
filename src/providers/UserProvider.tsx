import { UserContext } from "@/context/UserContext";
import { getUsers } from "@/services/authService";
import type { User } from "@/types/User";
import { getToken } from "@/utils/token";
import { useEffect, useState } from "react";



export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.clear();
  }


  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = getToken('access_token');

      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const response = await getUsers();
        if (response.success) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error fetching user details", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <UserContext.Provider value={{ user, isAuthenticated, setIsAuthenticated, setUser, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};