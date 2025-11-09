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
          <Text style={{ color: "#888" }}>Sem imagem</Text>
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
            style={styles.addButton}
            onPress={() => router.push("/search")}
          >
            <Text style={styles.addButtonText}>+ Buscar Filmes</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={myMovies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovie}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#111",
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 30,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  poster: {
    width: 100,
    height: 150,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
  },
  stars: {
    flexDirection: "row",
    marginBottom: 8,
  },
  star: {
    fontSize: 20,
    color: "#ccc",
    marginRight: 2,
  },
  starSelected: {
    color: "#FFD700",
  },
  removeButton: {
    backgroundColor: "#E50914",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  removeText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: "#E50914",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
