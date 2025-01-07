import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database'; // Firebase Realtime Database
import RouteMap from '../../components/RouteMap';
import styles from './styles'; // Ensure styles file exists and is properly configured

const BusDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { originPlace, destinationPlace } = route.params;

  const [availableBuses, setAvailableBuses] = useState([]);

  // Fetch buses from Firebase based on startLocation and endLocation
  useEffect(() => {
    const fetchAvailableBuses = () => {
      database()
        .ref('/buses') // Firebase path
        .orderByChild('startLocation')
        .equalTo(originPlace.data.description.trim()) // Match start location
        .once('value')
        .then((snapshot) => {
          const busesData = [];
          snapshot.forEach((childSnapshot) => {
            const bus = childSnapshot.val();
            // Check if the endLocation matches
            if (bus.endLocation === destinationPlace.data.description.trim()) {
              busesData.push(bus);
            }
          });
          setAvailableBuses(busesData);
        })
        .catch((error) => console.error('Error fetching buses:', error));
    };

    fetchAvailableBuses();
  }, [originPlace, destinationPlace]);

  const gotoLayout = (bus) => {
    navigation.navigate('Bus Layout', { bus });
  };

  return (
    <View style={{ display: 'flex', justifyContent: 'space-between' }}>
      {/* Map Section */}
      <View style={{ height: Dimensions.get('window').height - 400 }}>
        <RouteMap origin={originPlace} destination={destinationPlace} />
      </View>

      {/* Bus Details Section */}
      <Text style={styles.availableBuses}>Available Buses</Text>
      {availableBuses.length > 0 ? (
        <FlatList
          data={availableBuses}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10,
                marginHorizontal: 10,
                marginVertical: 5,
                backgroundColor: '#f2f2f2',
                borderRadius: 5,
              }}
            >
              <Text>{item.busNumber} - {item.busHolderNic}</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#007bff',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 5,
                }}
                onPress={() => gotoLayout(item)}
              >
                <Text style={{ color: 'white' }}>Select</Text>
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
