import React, { createContext, useContext, useState, ReactNode } from "react";

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
