import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Movie = {
  id: number;
  title: string;
  poster?: string | null;
  rating: number;
};

type User = {
  name: string;
  email: string;
  image?: string;
};

type MoviesContextType = {
  myMovies: Movie[];
  currentUser: User | null;
  addMovie: (movie: Movie) => void;
  removeMovie: (id: number) => void;
  login: (user: User) => void;
  logout: () => void;
};

const MoviesContext = createContext<MoviesContextType | undefined>(undefined);

export const MoviesProvider = ({ children }: { children: ReactNode }) => {
  const [myMovies, setMyMovies] = useState<Movie[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // 🔄 Carregar filmes do usuário logado
  useEffect(() => {
    const loadMovies = async () => {
      if (currentUser) {
        const key = `movies_${currentUser.email}`;
        const savedMovies = await AsyncStorage.getItem(key);
        if (savedMovies) {
          setMyMovies(JSON.parse(savedMovies));
        } else {
          setMyMovies([]);
        }
      }
    };
    loadMovies();
  }, [currentUser]);

  // 💾 Salvar filmes quando a lista mudar
  useEffect(() => {
    const saveMovies = async () => {
      if (currentUser) {
        const key = `movies_${currentUser.email}`;
        await AsyncStorage.setItem(key, JSON.stringify(myMovies));
      }
    };
    saveMovies();
  }, [myMovies, currentUser]);

  const addMovie = (movie: Movie) => {
    setMyMovies((prev) => {
      const alreadyExists = prev.some((m) => m.id === movie.id);
      return alreadyExists ? prev : [...prev, movie];
    });
  };

  const removeMovie = (id: number) => {
    setMyMovies((prev) => prev.filter((m) => m.id !== id));
  };

  const login = (user: User) => {
    setCurrentUser(user);
  };

  const logout = () => {
    setCurrentUser(null);
    setMyMovies([]);
  };

  return (
    <MoviesContext.Provider
      value={{ myMovies, currentUser, addMovie, removeMovie, login, logout }}
    >
      {children}
    </MoviesContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MoviesContext);
  if (!context) {
    throw new Error("useMovies deve ser usado dentro de um MoviesProvider");
  }
  return context;
};
