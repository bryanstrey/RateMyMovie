import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { useMovies } from "../contexts/MoviesContext";

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const { myMovies } = useMovies();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setCheckingUser(false), 150);
    return () => clearTimeout(timeout);
  }, [user]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      await new Promise((res) => setTimeout(res, 100));
      router.replace("/"); // volta para login
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading || checkingUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E50914" />
        <Text style={styles.loadingText}>Carregando usuário...</Text>
      </View>
    );
  }

  if (isLoggingOut) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={styles.loadingText}>Saindo...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Nenhum usuário logado 😕</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#E50914" }]}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.buttonText}>Ir para o Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎬 RateMyMovie</Text>

      <View style={styles.card}>
        {user.imageUri ? (
          <Image source={{ uri: user.imageUri }} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileImage, styles.noImage]}>
            <Text style={{ color: "#888" }}>Sem foto</Text>
          </View>
        )}

        <Text style={styles.welcome}>
          Olá, <Text style={styles.name}>{user.name}</Text> 👋
        </Text>

        <Text style={styles.moviesInfo}>
          Você tem{" "}
          <Text style={{ fontWeight: "bold" }}>{myMovies.length}</Text>{" "}
          filme{myMovies.length === 1 ? "" : "s"} salvo
          {myMovies.length === 1 ? "" : "s"} 🎥
        </Text>

        <View style={styles.buttonsGroup}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#E50914" }]}
            onPress={() => router.push("/search")}
          >
            <Text style={styles.buttonText}>🔍 Buscar Filmes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#34C759" }]}
            onPress={() => router.push("/myMovies")}
          >
            <Text style={styles.buttonText}>🎬 Meus Filmes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#5856D6" }]}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.buttonText}>👤 Meu Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#FF3B30" }]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>🚪 Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 25,
    backgroundColor: "#fafafa",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 25,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 25,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: "#eee",
  },
  noImage: {
    alignItems: "center",
    justifyContent: "center",
  },
  welcome: {
    fontSize: 18,
    color: "#333",
    marginBottom: 8,
  },
  name: {
    fontWeight: "bold",
    color: "#E50914",
  },
  moviesInfo: {
    fontSize: 15,
    color: "#555",
    marginBottom: 20,
  },
  buttonsGroup: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 18,
    color: "#444",
    fontWeight: "500",
  },
});
