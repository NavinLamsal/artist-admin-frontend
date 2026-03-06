
import type { User } from "@/types/User";
import { createContext, useContext } from "react";


interface UserContextType{
    user: User | null;
    isAuthenticated: boolean;
    setIsAuthenticated:(isAuthenticated: boolean) => void;
    setUser:(user: User | null) => void;
    logout: () => void;
    loading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = ()=>{
    const context = useContext(UserContext);
    if (context === undefined){
        throw new Error('useUserContext must be used within UserProvider');
    }
    return context;


}