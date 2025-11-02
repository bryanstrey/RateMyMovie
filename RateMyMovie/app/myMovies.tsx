import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useMovies } from "../contexts/MoviesContext";
import { useRouter } from "expo-router";

export default function MyMoviesScreen() {
  const { myMovies, removeMovie } = useMovies();
  const router = useRouter();

  const handleRemove = (id: number, title: string) => {
    Alert.alert(
      "Remover filme",
      `Deseja remover "${title}" dos seus favoritos?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", style: "destructive", onPress: () => removeMovie(id) },
      ]
    );
  };

  const renderMovie = ({ item }: any) => (
    <View style={styles.card}>
      {item.poster ? (
        <Image
          source={{ uri: item.poster }}
          style={styles.poster}
          accessibilityLabel={`Pôster do filme ${item.title}`}
        />
      ) : (
        <View style={[styles.poster, styles.noImage]}>
          <Text>Sem imagem</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Text
              key={i}
              style={[styles.star, i <= item.rating && styles.starSelected]}
            >
              ★
            </Text>
          ))}
        </View>

        {/* Botão de remover */}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemove(item.id, item.title)}
        >
          <Text style={styles.removeText}>🗑️ Remover</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎬 Meus Filmes Favoritos</Text>

      {myMovies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum filme salvo ainda.</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/search")}
          >
            <Text style={styles.buttonText}>Buscar Filmes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={myMovies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovie}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  card: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
  },
  poster: { width: 100, height: 150 },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
  info: { flex: 1, padding: 10, justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  stars: { flexDirection: "row", marginBottom: 6 },
  star: { fontSize: 20, color: "#ccc", marginRight: 2 },
  starSelected: { color: "#ffcc00" },
  removeButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  removeText: { color: "#fff", fontWeight: "bold" },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: { fontSize: 16, color: "#555", marginBottom: 10 },
  button: {
    backgroundColor: "#ff4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
