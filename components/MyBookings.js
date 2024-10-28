import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { styles } from "../App"; // Importer globale styles fra App.js

const MyBookings = ({ navigation }) => {
  const [bookings, setBookings] = useState([]); // State til at holde bookinger

  useEffect(() => {
    const db = getDatabase();
    const bookingsRef = ref(db, "Bookings");

    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookingsArray = Object.values(data);
        setBookings(bookingsArray);
      }
    });
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>Address: {item.address}</Text>
      <Text style={styles.itemText}>
        Kvadratmeter: {item.parkingSpace.kvadratmeter}
      </Text>
      <Text style={styles.itemText}>Pris: {item.parkingSpace.price}</Text>
      <Text style={styles.itemText}>
        Available from {item.parkingSpace.startTime} to{" "}
        {item.parkingSpace.endTime}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Bookings</Text>
      {bookings.length > 0 ? (
        <FlatList
          data={bookings}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noDataText}>No bookings available</Text>
      )}
    </View>
  );
};
export default MyBookings;
