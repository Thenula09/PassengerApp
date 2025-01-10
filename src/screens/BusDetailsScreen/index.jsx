import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import RouteMap from '../../components/RouteMap';
import styles from './styles';

const BusDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { originPlace, destinationPlace } = route.params;

  const [availableBuses, setAvailableBuses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchAvailableBuses = async () => {
      try {
        const snapshot = await database().ref('/buses').once('value');
        const busesData = [];

        snapshot.forEach((childSnapshot) => {
          const bus = childSnapshot.val();
          const busId = childSnapshot.key; // Get the busId (key of the child)

          // Ensure that the bus data includes startLocation and endLocation
          if (
            bus.startLocation &&
            bus.endLocation &&
            originPlace?.data?.description &&
            destinationPlace?.data?.description
          ) {
            if (
              bus.startLocation.trim().toLowerCase() ===
                originPlace.data.description.trim().toLowerCase() &&
              bus.endLocation.trim().toLowerCase() ===
                destinationPlace.data.description.trim().toLowerCase()
            ) {
              busesData.push({ ...bus, busId }); // Add busId to the bus object
            }
          } else {
            console.warn('Invalid bus data or missing location fields:', bus);
          }
        });

        setAvailableBuses(busesData);
      } catch (error) {
        console.error('Error fetching buses:', error);
        setErrorMessage('Could not fetch buses. Please try again later.');
      }
    };

    fetchAvailableBuses();
  }, [originPlace, destinationPlace]);

  const gotoLayout = (bus) => {
    // Pass the busId to the BusLayoutScreen
    navigation.navigate('Bus Layout', { busId: bus.busId });
  };

  const goToMap = (bus) => {
    // Assuming the bus object contains both bus and driver information
    const { currentLocation, driverLocation } = bus;

    // Passing both locations to the BusMapScreen
    navigation.navigate('BusMapScreen', {
      currentLocation: currentLocation,
      driverLocation: driverLocation,
    });
  };

  return (
    <View style={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}>
      {/* Map Section */}
      <View style={{ height: Dimensions.get('window').height - 400 }}>
        <RouteMap origin={originPlace} destination={destinationPlace} />
      </View>

      {/* Bus Details Section */}
      <Text style={styles.availableBuses}>Available Buses</Text>
      {errorMessage ? (
        <Text style={{ textAlign: 'center', margin: 30, color: 'red' }}>{errorMessage}</Text>
      ) : availableBuses.length > 0 ? (
        <FlatList
          data={availableBuses}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 10,
                marginHorizontal: 10,
                marginVertical: 5,
                backgroundColor: '#f2f2f2',
                borderRadius: 5,
              }}
            >
              <Text style={{ flex: 1,  fontSize:20}}>
                {item.busNumber}  {/* Displaying bus number and busId */}
              </Text>
              <TouchableOpacity
                style={{
                 backgroundColor: "black",
                  paddingHorizontal: 10,
                  paddingVertical: 7,
                  borderRadius: 7,
                  marginRight: 5,
                }}
                onPress={() => gotoLayout(item)}  // Trigger the bus layout navigation
              >
                <Text style={{ color: 'white',  }}>Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: 'black',
                  paddingHorizontal: 10,
                  paddingVertical: 7,
                  borderRadius: 7,
                }}
                onPress={() => goToMap(item)} // Pass bus location and driver location to map
              >
                <Text style={{ color: 'white' }}>Map</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={{ textAlign: 'center', margin: 20, fontSize: 16 }}>
          No buses available for the selected route.
        </Text>
      )}
    </View>
  );
};

export default BusDetailsScreen;
