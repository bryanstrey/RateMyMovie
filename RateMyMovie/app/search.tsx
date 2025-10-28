import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { TMDB_API_KEY, TMDB_BASE_URL } from "../config/tmdb";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  overview: string;
};

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchMovies = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();
      setMovies(data.results || []);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderMovie = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: "/movieDetails", params: { movie: JSON.stringify(item) } })}
    >
      {item.poster_path ? (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
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
        <Text style={styles.date}>📅 {item.release_date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Buscar Filmes 🎥</Text>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do filme..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={searchMovies}
          accessibilityLabel="Campo de busca de filmes"
        />
        <TouchableOpacity style={styles.button} onPress={searchMovies}>
          <Text style={styles.buttonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ff4444" />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovie}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  searchBox: { flexDirection: "row", marginBottom: 16 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginRight: 8,
  },
  button: {
    backgroundColor: "#ff4444",
    borderRadius: 8,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  card: {
    flexDirection: "row",
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  poster: { width: 100, height: 150 },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
  info: { flex: 1, padding: 10 },
  title: { fontWeight: "bold", fontSize: 16 },
  date: { color: "#666", marginTop: 4 },
});
