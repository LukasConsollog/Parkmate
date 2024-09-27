import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { getDatabase, ref, remove } from "firebase/database";
import { styles } from "../App"; // Fælles styles

const CarDetails = ({ navigation, route }) => {
  const [car, setCar] = useState({}); // Initialiser en tom state for bilen

  // useEffect hook til at sætte bilens detaljer fra route params
  useEffect(() => {
    setCar(route.params.car); // Sæt bilens detaljer fra route params

    return () => {
      setCar({}); // Ryd state når skærmen forlades
    };
  }, [route.params.car]);

  // Funktion til at navigere til EditCar skærmen og sende data
  const handleEdit = () => {
    navigation.navigate("Add_Edit_Car", { carId: car.id, car });
  };

  // Funktion til at slette adresse fra Firebase
  const handleDelete = async () => {
    const id = car.id;
    const db = getDatabase();
    // Definer stien til slet
    const carRef = ref(db, `Cars/${id}`);

    try {
      await remove(carRef);
      navigation.goBack(); // Naviger tilbage efter sletning
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  // Funktion til at bekræfte sletning
  const confirmDelete = () => {
    // Spørg brugeren om bekræftelse
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Alert.alert("Er du sikker?", "Vil du slette informationen?", [
        { text: "Annuller", style: "cancel" },
        // Brug handleDelete som eventHandler for onPress
        { text: "Slet", style: "destructive", onPress: () => handleDelete() },
      ]);
    }
  };

  // Ingen data tjek
  if (!car) {
    return <Text style={styles.noDataText}>Ingen data</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Adresse Detaljer</Text>
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Gadenavn:</Text>
        <Text style={styles.detailText}>{car.gadenavn}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Gadenummer:</Text>
        <Text style={styles.detailText}>{car.gadenummer}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>Postnummer:</Text>
        <Text style={styles.detailText}>{car.postnummer}</Text>
      </View>
      <View style={styles.detailContainer}>
        <Text style={styles.detailLabel}>By:</Text>
        <Text style={styles.detailText}>{car.by}</Text>
      </View>
      {car.parkingSpaces && car.parkingSpaces.length > 0 ? (
        car.parkingSpaces.map((space, index) => (
          <View key={index} style={styles.parkingSpaceContainer}>
            <Text style={styles.detailText}>
              Kvadratmeter: {space.kvadratmeter}
            </Text>
            <Text style={styles.detailText}>Pris: {space.price}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>
          Ingen parkeringspladser tilgængelige
        </Text>
      )}
      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Text style={styles.editButtonText}>Rediger Information</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
        <Text style={styles.deleteButtonText}>Slet Information</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CarDetails;
