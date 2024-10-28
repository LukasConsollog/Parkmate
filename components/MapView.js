import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from "react-native-maps";
import axios from "axios";
import { getDatabase, ref, onValue } from "firebase/database";

const MapScreen = ({ navigation }) => {
  const [addresses, setAddresses] = useState([]); // State til adresser
  const [markers, setMarkers] = useState([]); // State til markører

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
        setAddresses(carsArray);
      }
    });
  }, []);

  // useEffect hook til at hente koordinater for adresserne
  useEffect(() => {
    const fetchCoordinates = async () => {
      const newMarkers = [];
      for (const address of addresses) {
        const fullAddress = `${address.postnummer.trim()} ${address.by.trim()}, ${address.gadenavn.trim()} ${address.gadenummer.trim()},`;
        try {
          const response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
              params: {
                q: fullAddress,
                format: "json",
                addressdetails: 1,
                limit: 1,
              },
            }
          );
          if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            newMarkers.push({
              latitude: parseFloat(lat),
              longitude: parseFloat(lon),
              title: fullAddress,
              id: address.id, // id til booking
              address, // address data
            });
          } else {
            console.warn(`No results found for ${fullAddress}`);
          }
        } catch (error) {
          console.error(`Error geocoding ${fullAddress}:`, error);
        }
      }
      setMarkers(newMarkers);
    };

    if (addresses.length > 0) {
      fetchCoordinates();
    }
  }, [addresses]);

  const handleBook = (marker) => {
    navigation.navigate("BookingScreen", { marker });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Parking Locations</Text>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={{
          // Data for Danmark
          latitude: 56.26392,
          longitude: 9.501785,
          latitudeDelta: 2.0,
          longitudeDelta: 2.0,
        }}
        mapType="standard"
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
          >
            <Callout>
              <View style={styles.callout}>
                <Text>{marker.title}</Text>
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => handleBook(marker)}
                >
                  <Text style={styles.bookButtonText}>Book</Text>
                </TouchableOpacity>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

export default MapScreen;

// Specifik styling til kort displayet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 40,
    marginBottom: 20,
  },
  map: {
    width: Dimensions.get("window").width * 0.9,
    height: Dimensions.get("window").height * 0.8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  callout: {
    width: 150,
    alignItems: "center",
  },
  bookButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});
