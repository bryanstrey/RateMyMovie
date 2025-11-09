// app/index.tsx  (ou onde estiver seu login)
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha e-mail e senha.");
      return;
    }
    try {
      setLoading(true);
      // login agora retorna o usuário somente quando tudo for confirmado
      await login(email, password);
  
      // opcional: verificar novamente no AsyncStorage
      const current = await AsyncStorage.getItem("currentUser");
      console.log("[LoginScreen] after login, currentUser exists:", !!current);
  
      if (!current) {
        Alert.alert("Erro", "Falha ao gravar sessão. Tente novamente.");
        return;
      }
  
      // navegar somente após confirmação
      router.replace("/home");
    } catch (err: any) {
      Alert.alert("Erro", err?.message || "Erro ao entrar");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate My Movie 🎬</Text>

      <TextInput
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 30 },
  input: { width: "100%", backgroundColor: "#f2f2f2", padding: 12, borderRadius: 8, marginBottom: 12 },
  button: { backgroundColor: "#ff4444", padding: 14, borderRadius: 8, width: "100%", alignItems: "center", marginTop: 5 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { color: "#007bff", marginTop: 15 },
});
