import React, { useEffect, useState } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { getDatabase, ref, onValue, off } from "firebase/database";
import { styles } from "../App";

const CarList = ({ navigation }) => {
  const [cars, setCars] = useState([]); // State til adresser

  // useEffect hook til at hente data fra Firebase
  useEffect(() => {
    const db = getDatabase();
    const carsRef = ref(db, "Cars");

    onValue(carsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const carsArray = Object.entries(data).map(([id, car]) => ({
          id,
          ...car,
        }));
        setCars(carsArray);
      }
    });

    return () => {
      off(carsRef); // Fjern listeneren
    };
  }, []);

  // Funktion til at rendere hver element i listen
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("CarDetails", { car: item })}
    >
      <Text style={styles.itemText}>{item.gadenavn}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Adresse Liste</Text>
      {cars.length > 0 ? (
        <FlatList
          data={cars}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noDataText}>Ingen data</Text>
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("Add_Edit_Car")}
      >
        <Text style={styles.addButtonText}>Tilføj Adresse</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.mapButton}
        onPress={() => navigation.navigate("MapScreen")}
      >
        <Text style={styles.mapButtonText}>Vis Kort</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CarList;
