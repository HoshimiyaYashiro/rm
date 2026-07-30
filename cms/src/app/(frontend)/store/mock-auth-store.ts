import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  currentUser: User | null;
  users: User[];
  login: (userId: string) => void;
  logout: () => void;
}

const mockUsers: User[] = [
  { id: 'u1', name: 'John Employee', role: 'employee', teamId: 't1' },
  { id: 'u2', name: 'Jane Employee', role: 'employee', teamId: 't1' },
  { id: 'm1', name: 'Alice Manager', role: 'manager', teamId: 't1' },
  { id: 'a1', name: 'Bob Admin', role: 'admin' },
];

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: mockUsers[0],
  users: mockUsers,
  login: (userId) => set((state) => ({ currentUser: state.users.find((u) => u.id === userId) || null })),
  logout: () => set({ currentUser: null }),
}));
