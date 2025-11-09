// contexts/AuthContext.tsx
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
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const USERS_KEY = "users";
  const CURRENT_KEY = "currentUser";

  // load users + current on mount
  useEffect(() => {
    (async () => {
      try {
        console.log("[AuthContext] 🔄 Carregando dados do AsyncStorage...");
        const uStr = await AsyncStorage.getItem(USERS_KEY);
        console.log("[AuthContext] Conteúdo bruto de 'users':", uStr);

        const currentStr = await AsyncStorage.getItem(CURRENT_KEY);
        console.log("[AuthContext] Conteúdo bruto de 'currentUser':", currentStr);

        const parsedUsers: User[] = uStr ? JSON.parse(uStr) : [];
        setUsers(parsedUsers);
        console.log("[AuthContext] ✅ Users carregados no estado:", parsedUsers);

        if (currentStr) {
          const parsedCurrent = JSON.parse(currentStr);
          setUser(parsedCurrent);
          console.log("[AuthContext] ✅ Usuário logado encontrado:", parsedCurrent);
        } else {
          setUser(null);
          console.log("[AuthContext] ⚠️ Nenhum usuário logado encontrado.");
        }
      } catch (err) {
        console.error("[AuthContext] ❌ Erro ao carregar storage:", err);
      } finally {
        setIsLoading(false);
        console.log("[AuthContext] ✅ Contexto pronto para login. isLoading = false");
      }
    })();
  }, []);

  const normalizeEmail = (e: string) => e.trim().toLowerCase();

  const register = async (newUser: User) => {
    const normalizedEmail = normalizeEmail(newUser.email);
    console.log("[AuthContext] 📝 Registrando novo usuário:", newUser);
    try {
      const uStr = await AsyncStorage.getItem(USERS_KEY);
      const parsedUsers: User[] = uStr ? JSON.parse(uStr) : [];
      console.log("[AuthContext] 📦 Usuários atuais antes do registro:", parsedUsers);

      if (parsedUsers.some((u) => normalizeEmail(u.email) === normalizedEmail)) {
        console.warn("[AuthContext] ⚠️ E-mail já cadastrado:", normalizedEmail);
        throw new Error("Já existe um usuário com esse e-mail");
      }

      const toSave = { ...newUser, email: normalizedEmail };
      const nextUsers = [...parsedUsers, toSave];

      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
      console.log("[AuthContext] 💾 Users salvos no AsyncStorage:", nextUsers);

      await AsyncStorage.setItem(CURRENT_KEY, JSON.stringify(toSave));
      console.log("[AuthContext] 💾 currentUser salvo no AsyncStorage:", toSave);

      setUsers(nextUsers);
      setUser(toSave);
      console.log("[AuthContext] ✅ Registro concluído com sucesso!");
    } catch (err) {
      console.error("[AuthContext] ❌ Erro no registro:", err);
      throw err;
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    // aguarda o contexto estar pronto antes de permitir o login
    if (isLoading) {
      console.log("[AuthContext] ⏳ Tentativa de login antes do contexto estar pronto. Aguardando...");
      await new Promise((resolve) => setTimeout(resolve, 200));
      return login(email, password);
    }

    const normalizedEmail = normalizeEmail(email);
    console.log("[AuthContext] 🔐 Tentando login com:", normalizedEmail);

    try {
      const uStr = await AsyncStorage.getItem(USERS_KEY);
      console.log("[AuthContext] 📦 Users lidos do AsyncStorage:", uStr);

      const parsedUsers: User[] = uStr ? JSON.parse(uStr) : [];
      console.log("[AuthContext] 🧠 Users no estado atual:", users);
      console.log("[AuthContext] 🧠 Users lidos do disco:", parsedUsers);

      const existing = parsedUsers.find(
        (u) => normalizeEmail(u.email) === normalizedEmail && u.password === password
      );

      if (!existing) {
        console.warn("[AuthContext] ❌ Usuário não encontrado na lista!");
        throw new Error("Usuário ou senha inválidos");
      }

      await AsyncStorage.setItem(CURRENT_KEY, JSON.stringify(existing));
      console.log("[AuthContext] 💾 currentUser atualizado:", existing);

      setUsers(parsedUsers);
      setUser(existing);
      console.log("[AuthContext] ✅ Login bem-sucedido! Usuário definido no estado:", existing);

      return existing;
    } catch (err) {
      console.error("[AuthContext] ❌ Erro no login:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      console.log("[AuthContext] 🚪 Fazendo logout...");
      await AsyncStorage.removeItem(CURRENT_KEY);
      setUser(null);
      console.log("[AuthContext] ✅ Logout concluído, usuário removido.");
    } catch (err) {
      console.error("[AuthContext] ❌ Erro no logout:", err);
      throw err;
    }
  };

  const refreshUser = async () => {
    console.log("[AuthContext] 🔁 Atualizando usuário logado...");
    try {
      const currentStr = await AsyncStorage.getItem(CURRENT_KEY);
      if (currentStr) {
        const parsed = JSON.parse(currentStr);
        setUser(parsed);
        console.log("[AuthContext] ✅ Usuário recarregado:", parsed);
      } else {
        setUser(null);
        console.log("[AuthContext] ⚠️ Nenhum usuário encontrado ao atualizar.");
      }
    } catch (err) {
      console.error("[AuthContext] ❌ Erro no refreshUser:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, users, register, login, logout, isLoading, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return ctx;
};
