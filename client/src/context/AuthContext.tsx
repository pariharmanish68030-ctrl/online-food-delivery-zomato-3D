import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loginCustomer: (user: User) => void;
  loginAdmin: (user: User) => void;
  logout: () => void;
  isCustomerAuthOpen: boolean;
  setIsCustomerAuthOpen: (open: boolean) => void;
  isAdminAuthOpen: boolean;
  setIsAdminAuthOpen: (open: boolean) => void;
  isAdminDashboardOpen: boolean;
  setIsAdminDashboardOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('zomato_3d_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isCustomerAuthOpen, setIsCustomerAuthOpen] = useState(false);
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('zomato_3d_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('zomato_3d_user');
    }
  }, [user]);

  const loginCustomer = (u: User) => {
    setUser(u);
    setIsCustomerAuthOpen(false);
  };

  const loginAdmin = (u: User) => {
    setUser(u);
    setIsAdminAuthOpen(false);
    setIsAdminDashboardOpen(true);
  };

  const logout = () => {
    setUser(null);
    setIsAdminDashboardOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginCustomer,
        loginAdmin,
        logout,
        isCustomerAuthOpen,
        setIsCustomerAuthOpen,
        isAdminAuthOpen,
        setIsAdminAuthOpen,
        isAdminDashboardOpen,
        setIsAdminDashboardOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
