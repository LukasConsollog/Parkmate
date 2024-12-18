import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { getApps, initializeApp } from "firebase/app";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Import screens for the main app
import Add_Edit_Car from "./components/Add_edit_Car";
import CarList from "./components/CarList";
import CarDetails from "./components/CarDetails";
import MapScreen from "./components/MapView";
import BookingScreen from "./components/BookingScreen";
import MyBookings from "./components/MyBookings";

// Import screens for authentication flow
import LoginScreen from "./components/LoginScreen";
import CreateUserScreen from "./components/CreateUserScreen";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBosJ1Ghx2J40IrNzsA2EMImjK6VG3lM",
  authDomain: "database-80e9c.firebaseapp.com",
  databaseURL:
    "https://database-80e9c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "database-80e9c",
  storageBucket: "database-80e9c.appspot.com",
  messagingSenderId: "381754416130",
  appId: "1:754416130:web:70d37f673ef6194cb59b1b",
};

// Initialize Firebase
if (getApps().length < 1) {
  initializeApp(firebaseConfig);
  console.log("Firebase On!");
}

// Create Stack Navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main App Stack
function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CarList" // default
        component={CarList}
        options={{ title: "Car List" }}
      />
      <Stack.Screen name="CarDetails" component={CarDetails} />
      <Stack.Screen
        name="Add_Edit_Car"
        component={Add_Edit_Car}
        options={{ title: "Enter Address" }}
      />
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ title: "Map" }}
      />
      <Stack.Screen
        name="BookingScreen"
        component={BookingScreen}
        options={{ title: "Book Parking Spot" }}
      />
      <Stack.Screen
        name="MyBookings"
        component={MyBookings}
        options={{ title: "My Bookings" }}
      />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CreateUser" component={CreateUserScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
  };

  const AuthStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="Login">
        {(props) => (
          <LoginScreen {...props} onLoginSuccess={handleAuthentication} />
        )}
      </Stack.Screen>
      <Stack.Screen name="CreateUser" component={CreateUserScreen} />
    </Stack.Navigator>
  );

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={AppStack}
            options={{
              tabBarIcon: () => <Ionicons name="home" size={20} />,
              headerShown: null,
            }}
          />
          <Tab.Screen
            name="Add_Edit_Car"
            component={Add_Edit_Car}
            options={{
              tabBarIcon: () => <Ionicons name="add" size={20} />,
              headerShown: null,
              title: "Enter Address",
            }}
          />
          <Tab.Screen
            name="Map"
            component={MapScreen}
            options={{
              tabBarIcon: () => <Ionicons name="map" size={20} />,
              headerShown: null,
              title: "Map",
            }}
          />
          <Tab.Screen
            name="MyBookings"
            component={MyBookings}
            options={{
              tabBarIcon: () => <Ionicons name="bookmark" size={20} />,
              headerShown: null,
              title: "My Bookings",
            }}
          />
        </Tab.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}

// Global Styling for alle mine komponenter
export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 40,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    width: "100%",
  },
  list: {
    width: "100%",
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  itemText: {
    fontSize: 18,
    color: "#333",
  },
  noDataText: {
    fontSize: 18,
    color: "#999",
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  removeButton: {
    color: "red",
    marginTop: 8,
    textAlign: "center",
  },
  editButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  parkingSpaceContainer: {
    width: "100%",
    marginVertical: 8,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  detailText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  detailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginRight: 10,
  },
  mapButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  parkingSpaceContainer: {
    width: "100%",
    marginVertical: 8,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  selectedParkingSpace: {
    backgroundColor: "#d4edda",
    borderColor: "#28a745",
  },
  bookButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 10,
    width: "100%",
    alignItems: "center",
  },
  bookButtonActive: {
    backgroundColor: "#28a745", // grøn vedaktiv
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
