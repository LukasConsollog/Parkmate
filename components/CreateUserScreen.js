import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { getDatabase, ref, set } from "firebase/database";

const CreateUserScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleCreateUser = () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    const db = getDatabase();
    const userId = new Date().getTime().toString(); // generer unik brugerid

    const userData = {
      username: username,
      email: email,
      password: password, // password i firebase
      createdAt: new Date().toISOString(),
    };

    const userRef = ref(db, "users/" + userId);

    set(userRef, userData)
      .then(() => {
        Alert.alert("Success", "User created successfully!");
        navigation.navigate("Login");
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert("Error", `Failed to save user data: ${errorMessage}`);
      });
  };

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1, justifyContent: "center", padding: 16 }}
    >
      <Text style={{ fontSize: 24, textAlign: "center", marginBottom: 20 }}>
        Create New User
      </Text>
      <TextInput
        style={{
          height: 40,
          borderColor: "#ccc",
          borderWidth: 1,
          marginBottom: 12,
          paddingLeft: 8,
        }}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "#ccc",
          borderWidth: 1,
          marginBottom: 12,
          paddingLeft: 8,
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
        }}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "#ccc",
          borderWidth: 1,
          marginBottom: 12,
          paddingLeft: 8,
        }}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity
        onPress={handleCreateUser}
        style={{ backgroundColor: "#4CAF50", padding: 10 }}
      >
        <Text
          style={{ color: "white", textAlign: "center", fontWeight: "bold" }}
        >
          Create Account
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CreateUserScreen;
