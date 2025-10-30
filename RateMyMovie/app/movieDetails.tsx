import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMovies } from "../contexts/MoviesContext";

export default function MovieDetailsScreen() {
  const { movie } = useLocalSearchParams();
  const router = useRouter();
  const { addMovie } = useMovies();

  const parsedMovie = JSON.parse(movie as string);

  const [rating, setRating] = useState<number>(0);

  const handleSave = async () => {
    try {
      await addMovie({
        id: parsedMovie.id,
        title: parsedMovie.title,
        poster: parsedMovie.poster_path
          ? `https://image.tmdb.org/t/p/w500${parsedMovie.poster_path}`
          : null,
        rating,
      });
      Alert.alert("Sucesso", "Filme salvo na sua lista!");
      router.push("../myMovies");
    } catch (err) {
      Alert.alert("Erro", "Não foi possível salvar o filme.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {parsedMovie.poster_path ? (
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${parsedMovie.poster_path}`,
          }}
          style={styles.poster}
          accessibilityLabel={`Pôster do filme ${parsedMovie.title}`}
        />
      ) : (
        <View style={[styles.poster, styles.noImage]}>
          <Text>Sem imagem</Text>
        </View>
      )}

      <Text style={styles.title}>{parsedMovie.title}</Text>
      <Text style={styles.date}>📅 {parsedMovie.release_date}</Text>
      <Text style={styles.overview}>{parsedMovie.overview || "Sem descrição."}</Text>

      <Text style={styles.ratingLabel}>Sua Avaliação:</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity key={i} onPress={() => setRating(i)}>
            <Text style={[styles.star, i <= rating && styles.starSelected]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar Filme</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  poster: {
    width: 250,
    height: 370,
    borderRadius: 10,
    marginBottom: 20,
  },
  noImage: {
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  date: { color: "#555", marginVertical: 6 },
  overview: {
    textAlign: "justify",
    marginVertical: 16,
    color: "#333",
  },
  ratingLabel: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  stars: { flexDirection: "row", marginBottom: 20 },
  star: { fontSize: 32, color: "#ccc", marginHorizontal: 4 },
  starSelected: { color: "#ffcc00" },
  button: {
    backgroundColor: "#ff4444",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
