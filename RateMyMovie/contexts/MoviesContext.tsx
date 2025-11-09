// contexts/MoviesContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";

type Movie = {
  id: number;
  title: string;
  poster?: string | null;
  rating: number;
};

type MoviesContextType = {
  myMovies: Movie[];
  addMovie: (movie: Movie) => Promise<void>;
  removeMovie: (id: number) => Promise<void>;
  clearMovies: () => Promise<void>;
  debugListStorage: () => Promise<void>;
};

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

const storageKeyFor = (email: string) => `movies_${email.trim().toLowerCase()}`;

export const MoviesProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoading: authLoading } = useAuth();
  const [myMovies, setMyMovies] = useState<Movie[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Quando o Auth terminar de carregar OU o user mudar, carregamos os filmes
  useEffect(() => {
    const load = async () => {
      try {
        // espera o auth carregar
        if (authLoading) {
          setIsReady(false);
          return;
        }

        if (!user) {
          setMyMovies([]);
          setIsReady(true);
          console.log("[Movies] no user -> cleared in-memory movies");
          return;
        }

        const key = storageKeyFor(user.email);
        const saved = await AsyncStorage.getItem(key);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setMyMovies(Array.isArray(parsed) ? parsed : []);
            console.log(`[Movies] Loaded ${Array.isArray(parsed) ? parsed.length : 0} movies for ${user.email}`);
          } catch (e) {
            console.error("[Movies] JSON parse error loading movies:", e);
            setMyMovies([]);
          }
        } else {
          setMyMovies([]);
          console.log(`[Movies] No saved movies for ${user.email}`);
        }
      } catch (err) {
        console.error("[Movies] Error loading movies:", err);
        setMyMovies([]);
      } finally {
        setIsReady(true);
      }
    };

    load();
  }, [user, authLoading]);

  // Persist helper (usar imediatamente quando necessário)
  const persist = async (movies: Movie[], email: string | undefined) => {
    if (!email) return;
    const key = storageKeyFor(email);
    try {
      await AsyncStorage.setItem(key, JSON.stringify(movies));
      console.log(`[Movies] Persisted ${movies.length} movies for ${email}`);
    } catch (err) {
      console.error("[Movies] Error persisting movies:", err);
    }
  };

  // adicionar e persistir imediatamente
  const addMovie = async (movie: Movie) => {
    if (!user) {
      console.warn("[Movies] addMovie called with no user");
      throw new Error("Usuário não autenticado");
    }
    // atualiza estado e persiste
    setMyMovies((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      if (exists) {
        console.log("[Movies] movie already exists, skipping add:", movie.id);
        return prev;
      }
      const updated = [...prev, movie];
      // persiste usando email atual (não depende de loadedUser)
      persist(updated, user.email);
      return updated;
    });
  };

  // remover e persistir imediatamente
  const removeMovie = async (id: number) => {
    if (!user) {
      console.warn("[Movies] removeMovie called with no user");
      throw new Error("Usuário não autenticado");
    }
    setMyMovies((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      persist(updated, user.email);
      return updated;
    });
  };

  const clearMovies = async () => {
    if (!user) {
      setMyMovies([]);
      return;
    }
    const key = storageKeyFor(user.email);
    try {
      await AsyncStorage.removeItem(key);
      setMyMovies([]);
      console.log(`[Movies] Cleared storage for ${user.email}`);
    } catch (err) {
      console.error("[Movies] Error clearing movies:", err);
      setMyMovies([]);
    }
  };

  const debugListStorage = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const movieKeys = allKeys.filter((k) => k.startsWith("movies_"));
      console.log("[Movies Debug] movieKeys:", movieKeys);
      for (const k of movieKeys) {
        const v = await AsyncStorage.getItem(k);
        console.log(`[Movies Debug] ${k} =>`, v ? `${JSON.parse(v).length} items` : "empty");
      }
    } catch (err) {
      console.error("[Movies Debug] error listing storage:", err);
    }
  };

  return (
    <MoviesContext.Provider value={{ myMovies, addMovie, removeMovie, clearMovies, debugListStorage }}>
      {children}
    </MoviesContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MoviesContext);
  if (!context) throw new Error("useMovies deve ser usado dentro de um MoviesProvider");
  return context;
};
