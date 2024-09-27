import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import axios from "axios";
import { getDatabase, ref, onValue } from "firebase/database";

const MapScreen = () => {
  const [addresses, setAddresses] = useState([]); // State til at holde adresser
  const [markers, setMarkers] = useState([]); // State til at holde markører

  // useEffect hook til at hente data fra Firebase
  useEffect(() => {
    const db = getDatabase();
    const carsRef = ref(db, "Cars");

    onValue(carsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const carsArray = Object.values(data);
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
        // console.log(`Geocoding address: ${fullAddress}`); // fy føj fejl tester (Har du tastet adressen rigtigt?)
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
          // console.log(`Geocoding response for ${fullAddress}:`, response.data); // tjek
          if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            newMarkers.push({
              latitude: parseFloat(lat),
              longitude: parseFloat(lon),
              title: fullAddress,
            });
          } else {
            console.warn(`No results found for ${fullAddress}`);
          }
        } catch (error) {
          console.error(`Error geocoding ${fullAddress}:`, error);
        }
      }
      // console.log("New markers:", newMarkers); // tjek
      setMarkers(newMarkers);
    };

    if (addresses.length > 0) {
      fetchCoordinates();
    }
  }, [addresses]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Parking Locations</Text>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={{
          // Data for danmark
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
          />
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
});
