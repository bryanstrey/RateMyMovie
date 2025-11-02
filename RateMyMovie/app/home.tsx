import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useMovies } from "../contexts/MoviesContext";

export default function HomeScreen() {
  const router = useRouter();
  const { currentUser, logout } = useMovies();

  const handleLogout = () => {
    logout();
    router.replace("../login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🍿 RateMyMovie</Text>

      {currentUser && (
        <View style={styles.profileContainer}>
          {currentUser.image ? (
            <Image
              source={{ uri: currentUser.image }}
              style={styles.profileImage}
            />
          ) : (
            <View style={[styles.profileImage, styles.noImage]}>
              <Text style={{ color: "#888" }}>Sem foto</Text>
            </View>
          )}
          <Text style={styles.welcome}>
            Olá, <Text style={styles.name}>{currentUser.name}</Text> 👋
          </Text>

          {/* 👤 Novo botão para acessar o perfil */}
          <TouchableOpacity
            style={[styles.button, styles.profileButton]}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.buttonText}>👤 Meu Perfil</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#007AFF" }]}
        onPress={() => router.push("/search")}
      >
        <Text style={styles.buttonText}>🔍 Buscar Filmes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#34C759" }]}
        onPress={() => router.push("../myMovies")}
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
});
