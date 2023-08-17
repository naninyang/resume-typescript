import React, { useState, useContext, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

type User = {
  id: string;
};

type AuthContextType = {
  loggedIn: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token);
    Cookies.set('token', token, { expires: 14 });
    setLoggedIn(true);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    Cookies.remove('token');
    setLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    if (localStorage.getItem('token') && Cookies.get('token')) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
