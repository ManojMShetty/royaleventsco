import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, VendorType, AuthState, RegisterData } from '@/types';
import { dataStore } from '@/data/store';

const AuthContext = createContext<AuthState | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('royalUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('royalUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const foundUser = dataStore.getUserByEmail(email);
    
    if (foundUser && foundUser.password === password) {
      const { password: _, ...safeUser } = foundUser;
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('royalUser', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if email already exists
    if (dataStore.getUserByEmail(data.email)) {
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
      vendorType: data.vendorType,
      phone: data.phone,
      createdAt: new Date(),
    };

    dataStore.addUser(newUser);
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('royalUser', JSON.stringify(newUser));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('royalUser');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
