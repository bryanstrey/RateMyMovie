import { Stack } from "expo-router";
import { AuthProvider } from "../../contexts/AuthContext";
import { MoviesProvider } from "../../contexts/MoviesContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <MoviesProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </MoviesProvider>
    </AuthProvider>
  );
}
