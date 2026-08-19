import React, { createContext, useContext, useState, useEffect } from 'react';
import { localStore } from '../services/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Current logged-in account (null if guest mode)
  const [user, setUser] = useState(() => {
    return localStore.get('kavach_account_user', null);
  });

  const [activeRole, setActiveRole] = useState('user'); // 'user' | 'contact' | 'warden'

  // Guest profile stored in browser session
  const [guestProfile, setGuestProfile] = useState(() => {
    return localStore.get('kavach_guest_profile', {
      name: 'Guest Traveler',
      phone: '+91 9631412596',
      email: 'vk4845646@gmail.com'
    });
  });

  const isGuest = !user;

  const loginAccount = (userData) => {
    const newUser = {
      uid: 'u-' + Date.now(),
      name: userData.name || guestProfile.name,
      email: userData.email || guestProfile.email,
      phone: userData.phone || guestProfile.phone,
      role: 'user'
    };
    setUser(newUser);
    localStore.emit('kavach_account_user', newUser);
  };

  const logoutAccount = () => {
    setUser(null);
    localStore.emit('kavach_account_user', null);
  };

  const updateGuestProfile = (updated) => {
    const newGuest = { ...guestProfile, ...updated };
    setGuestProfile(newGuest);
    localStore.emit('kavach_guest_profile', newGuest);
  };

  const setRole = (role) => {
    setActiveRole(role);
  };

  // Get current active profile name & phone (works for guest or account)
  const activeProfile = user || guestProfile;

  return (
    <AuthContext.Provider value={{
      user,
      isGuest,
      activeProfile,
      loginAccount,
      logoutAccount,
      updateGuestProfile,
      activeRole,
      setRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
