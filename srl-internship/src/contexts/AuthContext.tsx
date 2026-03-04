import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: 1,
    fullName: 'Admin Coordinator',
    email: 'admin@srl.com',
    role: UserRole.Admin,
    totalEnrolledHours: 0,
    totalCompletedHours: 0,
  },
  {
    id: 2,
    fullName: 'Supervisor Dave',
    email: 'supervisor@srl.com',
    role: UserRole.Supervisor,
    totalEnrolledHours: 0,
    totalCompletedHours: 0,
  },
  {
    id: 3,
    fullName: 'Student Alice',
    email: 'student@srl.com',
    role: UserRole.Student,
    totalEnrolledHours: 50,
    totalCompletedHours: 25,
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (user: User) => {
    // In a real app, you'd fetch user data based on credentials
    // For now, we'll just set the user from our mock data
    const foundUser = mockUsers.find(u => u.email === user.email && u.role === user.role);
    setUser(foundUser || null);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
