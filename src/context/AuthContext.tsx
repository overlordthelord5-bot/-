import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  switchRole: (role: UserRole) => Promise<void>;
  login: (email: string) => Promise<boolean>;
  register: (name: string, email: string, role: UserRole, phone?: string) => Promise<boolean>;
  logout: () => void;
  availableUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(INITIAL_USERS[1]); // Default to Client
  const [availableUsers, setAvailableUsers] = useState<User[]>(INITIAL_USERS);

  // Sync with server if available
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {
        // Use client state fallback
      });
  }, []);

  const switchRole = async (targetRole: UserRole) => {
    if (targetRole === 'visitor') {
      setUser(null);
      return;
    }

    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: targetRole }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        return;
      }
    } catch {
      // Fallback
    }

    const matched = availableUsers.find((u) => u.role === targetRole);
    if (matched) {
      setUser(matched);
    } else {
      const virtualUser: User = {
        id: `usr_${targetRole}`,
        name: `مستخدم ${targetRole}`,
        nameEn: `${targetRole.toUpperCase()} User`,
        email: `${targetRole}@waseet.com`,
        role: targetRole,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: '2026-01-01',
      };
      setUser(virtualUser);
      setAvailableUsers((prev) => [...prev, virtualUser]);
    }
  };

  const login = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        return true;
      }
    } catch {
      // Fallback
    }

    const matched = availableUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setUser(matched);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, role: UserRole, phone?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, phone }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setAvailableUsers((prev) => [...prev, data.user]);
        return true;
      }
    } catch {
      // Fallback
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      nameEn: name,
      email,
      role,
      phone,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString().split('T')[0],
      isVerified: true,
    };
    setUser(newUser);
    setAvailableUsers((prev) => [...prev, newUser]);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : 'visitor',
        isAuthenticated: !!user,
        switchRole,
        login,
        register,
        logout,
        availableUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
