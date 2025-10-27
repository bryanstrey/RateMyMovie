import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  name: string;
  email: string;
  password: string;
  imageUri?: string;
};

type AuthContextType = {
  user: User | null;
  users: User[];
  register: (newUser: User) => Promise<void>;
  login: (email: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const saved = await AsyncStorage.getItem("users");
    if (saved) setUsers(JSON.parse(saved));
  };

  const saveUsers = async (newUsers: User[]) => {
    setUsers(newUsers);
    await AsyncStorage.setItem("users", JSON.stringify(newUsers));
  };

  const register = async (newUser: User) => {
    const updated = [...users, newUser];
    await saveUsers(updated);
    setUser(newUser);
  };

  const login = (email: string, password: string) => {
    const existing = users.find(u => u.email === email && u.password === password);
    if (existing) setUser(existing);
    else throw new Error("Usuário ou senha inválidos");
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, users, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
