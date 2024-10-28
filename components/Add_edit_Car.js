import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { getDatabase, ref, set, push, update } from "firebase/database";
import { styles } from "../App"; // Importer globale styles fra App.js

const Add_Edit_Car = ({ navigation, route }) => {
  // Definerer variabler til at holde input data
  const [gadenavn, setGadenavn] = useState("");
  const [gadenummer, setGadenummer] = useState("");
  const [postnummer, setPostnummer] = useState("");
  const [by, setBy] = useState("");
  const [parkingSpaces, setParkingSpaces] = useState([]);

  // useEffect til at sætte data i route params
  useEffect(() => {
    if (route.params?.car) {
      const { gadenavn, gadenummer, postnummer, by, parkingSpaces } =
        route.params.car;
      setGadenavn(gadenavn);
      setGadenummer(gadenummer);
      setPostnummer(postnummer);
      setBy(by);
      setParkingSpaces(parkingSpaces || []);
    }
  }, [route.params?.car]);

  // Funktion til at tilføje en ny parkeringsplads
  const handleAddParkingSpace = () => {
    setParkingSpaces([
      ...parkingSpaces,
      { kvadratmeter: "", price: "", startTime: "", endTime: "" },
    ]);
  };

  // Funktion til at fjerne en parkeringsplads
  const handleRemoveParkingSpace = (index) => {
    const updatedParkingSpaces = parkingSpaces.filter((_, i) => i !== index);
    setParkingSpaces(updatedParkingSpaces);
  };

  // Funktion til at opdatere værdierne for en parkeringsplads
  const handleParkingSpaceChange = (index, field, value) => {
    const updatedParkingSpaces = parkingSpaces.map((space, i) =>
      i === index ? { ...space, [field]: value } : space
    );
    setParkingSpaces(updatedParkingSpaces);
  };

  // Funktion til at gemme adressen til Firebase
  const handleSave = () => {
    const db = getDatabase();
    const carId = route.params?.carId || push(ref(db, "Cars")).key; // Brug push til at generere en ny nøgle
    const carData = {
      gadenavn,
      gadenummer,
      postnummer,
      by,
      parkingSpaces,
    };

    if (route.params?.carId) {
      // Opdater adresse
      update(ref(db, `Cars/${carId}`), carData);
    } else {
      // Tilføj ny adresse
      set(ref(db, `Cars/${carId}`), carData);
    }

    // Nulstil input felterne
    setGadenavn("");
    setGadenummer("");
    setPostnummer("");
    setBy("");
    setParkingSpaces([]);

    navigation.goBack(); // Naviger tilbage til forrige skærm
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Enter Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Street Name"
        value={gadenavn}
        onChangeText={setGadenavn}
      />
      <TextInput
        style={styles.input}
        placeholder="Street Number"
        value={gadenummer}
        onChangeText={setGadenummer}
      />
      <TextInput
        style={styles.input}
        placeholder="Postal Code"
        value={postnummer}
        onChangeText={setPostnummer}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={by}
        onChangeText={setBy}
      />
      {parkingSpaces.map((space, index) => (
        <View key={index} style={styles.parkingSpaceContainer}>
          <TextInput
            style={styles.input}
            placeholder="Square Meters"
            value={space.kvadratmeter}
            onChangeText={(value) =>
              handleParkingSpaceChange(index, "kvadratmeter", value)
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            value={space.price}
            onChangeText={(value) =>
              handleParkingSpaceChange(index, "price", value)
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Tidsinterval Start(fx. 08:00)"
            value={space.startTime}
            onChangeText={(value) =>
              handleParkingSpaceChange(index, "startTime", value)
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Tidsinterval Slut (fx 18:00)"
            value={space.endTime}
            onChangeText={(value) =>
              handleParkingSpaceChange(index, "endTime", value)
            }
          />
          <TouchableOpacity onPress={() => handleRemoveParkingSpace(index)}>
            <Text style={styles.removeButton}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddParkingSpace}
      >
        <Text style={styles.addButtonText}>Add Parking Space</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Add_Edit_Car;
