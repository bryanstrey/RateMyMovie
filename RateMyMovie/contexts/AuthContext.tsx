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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // 🔄 Carregar usuários e sessão ativa ao iniciar
  useEffect(() => {
    const loadData = async () => {
      const savedUsers = await AsyncStorage.getItem("users");
      const savedUser = await AsyncStorage.getItem("currentUser");

      if (savedUsers) setUsers(JSON.parse(savedUsers));
      if (savedUser) setUser(JSON.parse(savedUser));
    };
    loadData();
  }, []);

  const saveUsers = async (newUsers: User[]) => {
    setUsers(newUsers);
    await AsyncStorage.setItem("users", JSON.stringify(newUsers));
  };

  // 📝 Registrar novo usuário
  const register = async (newUser: User) => {
    const exists = users.find(u => u.email === newUser.email);
    if (exists) throw new Error("E-mail já cadastrado!");

    const updated = [...users, newUser];
    await saveUsers(updated);
    setUser(newUser);
    await AsyncStorage.setItem("currentUser", JSON.stringify(newUser));
  };

  // 🔑 Fazer login
  const login = async (email: string, password: string) => {
    const existing = users.find(u => u.email === email && u.password === password);
    if (!existing) throw new Error("Usuário ou senha inválidos");

    setUser(existing);
    await AsyncStorage.setItem("currentUser", JSON.stringify(existing));
  };

  // 🚪 Logout
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider value={{ user, users, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
