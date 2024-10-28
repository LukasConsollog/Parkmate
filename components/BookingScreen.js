import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { getDatabase, ref, push } from "firebase/database";
import { styles } from "../App"; // Importer globale styles fra App.js

const BookingScreen = ({ route, navigation }) => {
  const { marker } = route.params;
  const [parkingSpaces, setParkingSpaces] = useState([]); // State til at holde parkeringspladser
  const [selectedParkingSpace, setSelectedParkingSpace] = useState(null); // State til at holde den valgte parkeringsplads

  useEffect(() => {
    if (marker.address && marker.address.parkingSpaces) {
      setParkingSpaces(marker.address.parkingSpaces);
    }
  }, [marker]);

  const handleBooking = () => {
    if (selectedParkingSpace !== null) {
      const db = getDatabase();
      const bookingsRef = ref(db, "Bookings");
      const bookingData = {
        address: marker.title,
        parkingSpace: parkingSpaces[selectedParkingSpace],
      };

      push(bookingsRef, bookingData)
        .then(() => {
          console.log("Booking saved successfully");
          navigation.navigate("MyBookings"); // navigation til Nyt View
        })
        .catch((error) => {
          console.error("Error saving booking:", error);
        });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Book Parking Spot</Text>
      <Text style={styles.detailText}>{marker.title}</Text>
      <Text style={styles.detailText}>Select Parking Spot:</Text>
      {parkingSpaces.length > 0 ? (
        parkingSpaces.map((space, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.parkingSpaceContainer,
              selectedParkingSpace === index && styles.selectedParkingSpace,
            ]}
            onPress={() => setSelectedParkingSpace(index)}
          >
            <Text style={styles.detailText}>
              Kvadratmeter: {space.kvadratmeter}, Pris: {space.price}
            </Text>
            <Text style={styles.detailText}>
              Available from {space.startTime} to {space.endTime}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noDataText}>No parking spaces available</Text>
      )}
      <TouchableOpacity
        style={[
          styles.bookButton,
          selectedParkingSpace !== null && styles.bookButtonActive,
        ]}
        onPress={handleBooking}
        disabled={selectedParkingSpace === null}
      >
        <Text style={styles.bookButtonText}>Book</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BookingScreen;
