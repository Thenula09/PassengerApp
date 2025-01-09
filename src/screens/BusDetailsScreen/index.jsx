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

  useEffect(() => {
    const fetchAvailableBuses = async () => {
      try {
        const snapshot = await database().ref('/buses').once('value');
        const busesData = [];
        snapshot.forEach((childSnapshot) => {
          const bus = childSnapshot.val();

          // Match startLocation and endLocation
          if (
            bus.startLocation.trim().toLowerCase() ===
              originPlace.data.description.trim().toLowerCase() &&
            bus.endLocation.trim().toLowerCase() ===
              destinationPlace.data.description.trim().toLowerCase()
          ) {
            busesData.push(bus);
          }
        });
        setAvailableBuses(busesData);
      } catch (error) {
        console.error('Error fetching buses:', error);
      }
    };

    fetchAvailableBuses();
  }, [originPlace, destinationPlace]);

  const gotoLayout = (bus) => {
    navigation.navigate('Bus Layout', { bus });
  };

  const goToMap = (bus) => {
    navigation.navigate('BusMapScreen', { currentLocation: bus.currentLocation });
  };

  return (
    <View style={{ display: 'flex', justifyContent: 'space-between', flex: 1 }}>
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
                alignItems: 'center',
                padding: 10,
                marginHorizontal: 10,
                marginVertical: 5,
                backgroundColor: '#f2f2f2',
                borderRadius: 5,
              }}
            >
              <Text style={{ flex: 1 }}>{item.busNumber} - {item.otherDetails}</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#007bff',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 5,
                  marginRight: 5,
                }}
                onPress={() => gotoLayout(item)}
              >
                <Text style={{ color: 'white' }}>Select</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#28a745',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 5,
                }}
                onPress={() => goToMap(item)}
              >
                <Text style={{ color: 'white' }}>Go</Text>
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
