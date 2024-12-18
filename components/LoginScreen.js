import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, Alert, View } from "react-native";
import { getDatabase, ref, get } from "firebase/database";

const LoginScreen = ({ navigation, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const db = getDatabase();
    const usersRef = ref(db, "users");

    get(usersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          let userFound = false;

          snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            if (user.email === email) {
              userFound = true;

              if (user.password === password) {
                Alert.alert("Success", `Welcome, ${user.username}`);
                onLoginSuccess(); // lille authenticator
              } else {
                Alert.alert("Error", "Incorrect password.");
              }
            }
          });

          if (!userFound) {
            Alert.alert("Error", "User not found with this email.");
          }
        } else {
          Alert.alert("Error", "No users available.");
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert("Error", `Failed to fetch user data: ${errorMessage}`);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: "#ccc",
          borderWidth: 1,
          marginBottom: 12,
          paddingLeft: 8,
          width: "100%",
        }}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "#ccc",
          borderWidth: 1,
          marginBottom: 12,
          paddingLeft: 8,
          width: "100%",
        }}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        onPress={handleLogin}
        style={{ backgroundColor: "#4CAF50", padding: 10, width: "100%" }}
      >
        <Text
          style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
        >
          Login
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("CreateUser")}
        style={{
          marginTop: 12,
          padding: 10,
          backgroundColor: "#2196F3",
          width: "100%",
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          Create an Account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
