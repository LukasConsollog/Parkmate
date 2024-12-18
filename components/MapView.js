import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import axios from "axios";
import { getDatabase, ref, onValue } from "firebase/database";

const MapScreen = ({ navigation }) => {
  const [addresses, setAddresses] = useState([]); // state til adresser
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // useEffect hook til at hente fra Firebase
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

  // useEffect hente koordinater for adressen
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
              id: address.id, // id for booking
              address, // addresse data
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
    setModalVisible(false); // luk når book trykkes
    navigation.navigate("BookingScreen", { marker });
  };

  const closeModal = () => {
    setModalVisible(false); // luk når cancel trykkes
    setSelectedMarker(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Parking Locations</Text>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={{
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
            onPress={() => {
              setSelectedMarker(marker); // Set selected marker for the modal
              setModalVisible(true); // Show modal for booking
            }}
          />
        ))}
      </MapView>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedMarker && (
              <>
                <Text style={styles.modalText}>{selectedMarker.title}</Text>
                <TouchableOpacity
                  onPress={() => handleBook(selectedMarker)}
                  style={styles.bookButton}
                >
                  <Text style={styles.bookButtonText}>Book</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MapScreen;

// Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "Green",
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
    borderColor: "black",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  bookButton: {
    backgroundColor: "green",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  bookButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});
