import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../contexts/AuthContext";
import { useMovies } from "../contexts/MoviesContext";

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const { myMovies } = useMovies();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ✅ Novo estado para evitar piscar “Nenhum usuário logado”
  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    // espera 150ms pra dar tempo do contexto propagar o user
    const timeout = setTimeout(() => setCheckingUser(false), 150);
    return () => clearTimeout(timeout);
  }, [user]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      // Aguarda um pequeno delay pra garantir que o contexto foi atualizado
      await new Promise((res) => setTimeout(res, 100));
      router.replace("/"); // ✅ redireciona para a tela de login (index.tsx)
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };
  

  // 🧠 Enquanto o AuthContext ainda carrega
  if (isLoading || checkingUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Carregando usuário...</Text>
      </View>
    );
  }

  // 🧠 Se o logout está em andamento
  if (isLoggingOut) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={styles.loadingText}>Saindo...</Text>
      </View>
    );
  }

  // 🧠 Caso ainda não haja usuário (erro real)
  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Nenhum usuário logado 😕</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#007AFF" }]}
          onPress={() => router.replace("../index")}
        >
          <Text style={styles.buttonText}>Ir para o Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ✅ Usuário carregado normalmente
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍿 RateMyMovie</Text>

      <View style={styles.profileContainer}>
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

        <TouchableOpacity
          style={[styles.button, styles.profileButton]}
          onPress={() => router.push("/profile")}
        >
          <Text style={styles.buttonText}>👤 Meu Perfil</Text>
        </TouchableOpacity>

        <Text style={styles.moviesInfo}>
          Você tem {myMovies.length} filme
          {myMovies.length === 1 ? "" : "s"} salvo
          {myMovies.length === 1 ? "" : "s"} 🎥
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#007AFF" }]}
        onPress={() => router.push("/search")}
      >
        <Text style={styles.buttonText}>🔍 Buscar Filmes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#34C759" }]}
        onPress={() => router.push("/myMovies")}
      >
        <Text style={styles.buttonText}>🎬 Meus Filmes Assistidos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#FF3B30" }]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>🚪 Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#111",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
    backgroundColor: "#ddd",
  },
  noImage: {
    alignItems: "center",
    justifyContent: "center",
  },
  welcome: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  name: {
    fontWeight: "bold",
    color: "#000",
  },
  moviesInfo: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
  },
  button: {
    width: "80%",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  profileButton: {
    backgroundColor: "#5856D6",
    marginTop: 10,
    width: 200,
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
