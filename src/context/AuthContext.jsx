import React, { createContext, useContext, useState, useEffect } from 'react';
import { localStore } from '../services/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    return localStore.get('kavach_user', {
      uid: 'u-101',
      name: 'Ananya Sharma',
      email: 'ananya.s@example.com',
      phone: '+91 9631412596',
      role: 'user' // 'user' | 'contact' | 'warden'
    });
  });

  const [activeRole, setActiveRole] = useState('user'); // 'user' | 'contact' | 'warden'

  const login = (userData) => {
    const newUser = { ...user, ...userData };
    setUser(newUser);
    localStore.emit('kavach_user', newUser);
  };

  const setRole = (role) => {
    setActiveRole(role);
  };

  return (
    <AuthContext.Provider value={{ user, login, activeRole, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
