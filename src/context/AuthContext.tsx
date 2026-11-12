'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveUserRegistrationToFirestore, fetchUsersFromFirestore } from '@/lib/firestoreService';

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  address?: string;
  city?: string;
  district?: string;
}

interface AuthContextType {
  user: CustomerUser | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, phone: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (updatedData: Partial<CustomerUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CUSTOMER_STORAGE_KEY = 'sh_customer_user_v1';
const REGISTERED_USERS_DIRECTORY_KEY = 'sh_clothing_registered_users_list_v1';

function getLocalUsersDirectory(): Record<string, CustomerUser> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_DIRECTORY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalUserToDirectory(customer: CustomerUser) {
  if (typeof window === 'undefined') return;
  try {
    const dir = getLocalUsersDirectory();
    dir[customer.email.toLowerCase()] = customer;
    if (customer.phone) {
      const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
      if (cleanPhone) dir[cleanPhone] = customer;
    }
    localStorage.setItem(REGISTERED_USERS_DIRECTORY_KEY, JSON.stringify(dir));
  } catch (e) {
    console.error('Failed to update local user directory', e);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse customer user session', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const login = async (email: string, _password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const dir = getLocalUsersDirectory();

    let existingCustomer: CustomerUser | null = dir[cleanEmail] || null;

    // Check Cloud Firestore if not found locally
    if (!existingCustomer) {
      try {
        const firestoreUsers = await fetchUsersFromFirestore();
        if (firestoreUsers && firestoreUsers.length > 0) {
          const match = firestoreUsers.find(
            u => (u.email || '').trim().toLowerCase() === cleanEmail
          );
          if (match) {
            existingCustomer = {
              id: match.id || `cust-${Date.now()}`,
              name: match.name || 'Valued Shopper',
              email: match.email || cleanEmail,
              phone: match.phone || '',
              address: match.address || '',
              city: match.city || 'Colombo',
              district: match.district || 'Colombo'
            };
          }
        }
      } catch (err) {
        console.warn('Could not query Firestore for user login', err);
      }
    }

    const customer: CustomerUser = existingCustomer || {
      id: 'cust-' + Date.now(),
      name: email.split('@')[0] ? (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)) : 'Valued Shopper',
      email: cleanEmail,
      phone: '',
      address: '',
      city: 'Colombo',
      district: 'Colombo'
    };

    setUser(customer);
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
    saveLocalUserToDirectory(customer);
    saveUserRegistrationToFirestore(customer, { lastLoginAt: new Date().toISOString() }).catch(() => {});
    return { success: true };
  };

  const register = async (name: string, email: string, phone: string, _password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    const customer: CustomerUser = {
      id: 'cust-' + Date.now(),
      name: name.trim() || 'Valued Shopper',
      email: cleanEmail,
      phone: cleanPhone,
      city: 'Colombo',
      district: 'Colombo',
      address: ''
    };

    setUser(customer);
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
    saveLocalUserToDirectory(customer);

    // Persist registration info to Cloud Firestore ('users' collection)
    saveUserRegistrationToFirestore(customer, {
      source: 'web_registration',
      registeredAt: new Date().toISOString()
    }).catch(err => console.warn('Firestore user registration notice:', err));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CUSTOMER_STORAGE_KEY);
  };

  const updateProfile = (updatedData: Partial<CustomerUser>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(updated));
    saveLocalUserToDirectory(updated);
    saveUserRegistrationToFirestore(updated, { updatedAt: new Date().toISOString() }).catch(() => {});
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
