import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  ScrollView,
  ActivityIndicator 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import RouteMap from '../../components/RouteMap';
import styles from './styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';
import BottomNavBar from '../../components/BottomNavBar';
import Header from '../../components/Header';

const BusDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { originPlace, destinationPlace } = route.params || {};

  const [availableBuses, setAvailableBuses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    const fetchAvailableBuses = async () => {
      try {
        setLoading(true);
        console.log('Fetching buses from Firebase...');
        
        const snapshot = await database().ref('/buses').once('value');
        console.log('Firebase snapshot:', snapshot.exists());
        
        if (!snapshot.exists()) {
          console.log('No buses found in database');
          setAvailableBuses([]);
          setLoading(false);
          return;
        }

        const busesData = [];
        const busesObject = snapshot.val();
        
        console.log('Raw buses data:', busesObject);

        if (busesObject) {
          if (typeof busesObject === 'object') {
            Object.keys(busesObject).forEach(key => {
              const bus = busesObject[key];
              
              if (bus && typeof bus === 'object') {
                const hasStartLocation = bus.startLocation || bus.start_location;
                const hasEndLocation = bus.endLocation || bus.end_location;
                
                if (hasStartLocation && hasEndLocation) {
                  const busStart = (bus.startLocation || bus.start_location || '').toString().trim().toLowerCase();
                  const busEnd = (bus.endLocation || bus.end_location || '').toString().trim().toLowerCase();
                  const originSearch = (originPlace?.data?.description || '').toString().trim().toLowerCase();
                  const destinationSearch = (destinationPlace?.data?.description || '').toString().trim().toLowerCase();

                  if (!originSearch && !destinationSearch) {
                    const normalizedBus = {
                      ...bus,
                      busId: bus.busId || key,
                      fare: bus.fare || bus.price || 0,
                      availableSeats: bus.availableSeats || bus.capacity || 0,
                      totalSeats: bus.totalSeats || bus.capacity || 45,
                      busType: bus.busType || (bus.isAC ? 'AC' : 'Standard'),
                      departureTime: bus.departureTime || 'N/A',
                      arrivalTime: bus.arrivalTime || 'N/A'
                    };
                    busesData.push(normalizedBus);
                  } else if (busStart === originSearch && busEnd === destinationSearch) {
                    const normalizedBus = {
                      ...bus,
                      busId: bus.busId || key,
                      fare: bus.fare || bus.price || 0,
                      availableSeats: bus.availableSeats || bus.capacity || 0,
                      totalSeats: bus.totalSeats || bus.capacity || 45,
                      busType: bus.busType || (bus.isAC ? 'AC' : 'Standard'),
                      departureTime: bus.departureTime || 'N/A',
                      arrivalTime: bus.arrivalTime || 'N/A'
                    };
                    busesData.push(normalizedBus);
                  }
                }
              }
            });
          }
        }

        console.log(`Found ${busesData.length} buses`);
        setAvailableBuses(busesData);

        if (busesData.length === 0) {
          setErrorMessage('No buses found for this route. Please try another route.');
        }

      } catch (error) {
        console.error('Error fetching buses:', error);
        setErrorMessage('Could not fetch buses. Please try again later.');
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Could not fetch buses. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableBuses();
  }, [originPlace, destinationPlace]);

  // Handle map ready state
  const handleMapReady = () => {
    setIsMapReady(true);
    console.log('Map is ready');
  };

  const gotoLayout = (bus) => {
    navigation.navigate('Bus Layout', {
      busId: bus.busId,
      busNumber: bus.busNumber || bus.busId,
      busName: bus.name || bus.busNumber || bus.busId,
      departureTime: bus.departureTime || 'N/A',
      arrivalTime: bus.arrivalTime || 'N/A',
      price: bus.fare || 0,
      availableSeats: bus.availableSeats || 0,
      totalSeats: bus.totalSeats || bus.capacity || 45,
      isAC: bus.busType === 'AC' || bus.isAC,
      busType: bus.busType || 'Standard',
      startLocation: bus.startLocation || bus.start_location || 'Unknown',
      endLocation: bus.endLocation || bus.end_location || 'Unknown',
    });
  };

  const goToMap = (bus) => {
    navigation.navigate('BusMapScreen', {
      busData: {
        busId: bus.busId,
        busNumber: bus.busNumber || bus.busId,
        departureTime: bus.departureTime || 'N/A',
        startLocation: bus.startLocation || bus.start_location || 'Unknown',
        endLocation: bus.endLocation || bus.end_location || 'Unknown',
      },
      currentLocation: bus.currentLocation || null,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading buses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Available Buses"
        subtitle={`${availableBuses.length} ${availableBuses.length === 1 ? 'bus' : 'buses'} found`}
        showBackButton={true}
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.routeInfoCard}>
          <View style={styles.routeRow}>
            <View style={styles.routeIconContainer}>
              <View style={styles.originDot} />
              <View style={styles.routeLine} />
              <MaterialCommunityIcons name="map-marker" size={24} color="#F44336" />
            </View>
            <View style={styles.routeTextContainer}>
              <View style={styles.locationItem}>
                <Text style={styles.locationLabel}>From</Text>
                <Text style={styles.locationText} numberOfLines={1}>
                  {originPlace?.data?.description || 'All Locations'}
                </Text>
              </View>
              <View style={styles.locationItem}>
                <Text style={styles.locationLabel}>To</Text>
                <Text style={styles.locationText} numberOfLines={1}>
                  {destinationPlace?.data?.description || 'All Locations'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {originPlace && destinationPlace && (
          <View style={styles.mapContainer}>
            <RouteMap 
              origin={originPlace} 
              destination={destinationPlace}
              onMapReady={handleMapReady}
            />
          </View>
        )}

        <View style={styles.busListSection}>
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-circle" size={50} color="#F44336" />
              <Text style={styles.errorText}>{errorMessage}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.retryButtonText}>Try Another Route</Text>
              </TouchableOpacity>
            </View>
          ) : availableBuses.length > 0 ? (
            <FlatList
              data={availableBuses}
              scrollEnabled={false}
              keyExtractor={(item, index) => item.busId || index.toString()}
              renderItem={({ item }) => (
                <View style={styles.busCard}>
                  <View style={styles.busHeader}>
                    <View style={styles.busIconContainer}>
                      <FontAwesome5 name="bus" size={28} color="#4CAF50" />
                    </View>
                    <View style={styles.busInfoContainer}>
                      <Text style={styles.busNumber}>{item.busNumber || item.busId}</Text>
                      <View style={styles.busDetailRow}>
                        <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
                        <Text style={styles.busDetailText}>
                          {item.departureTime || 'N/A'} - {item.arrivalTime || 'N/A'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceLabel}>Price</Text>
                      <Text style={styles.priceText}>Rs {item.fare || item.price || '0'}</Text>
                    </View>
                  </View>

                  <View style={styles.busFooter}>
                    <View style={styles.busFeatures}>
                      <View style={styles.featureItem}>
                        <MaterialCommunityIcons name="seat-passenger" size={18} color="#4CAF50" />
                        <Text style={styles.featureText}>
                          {item.availableSeats || 0} seats available
                        </Text>
                      </View>
                      <View style={styles.featureItem}>
                        <MaterialCommunityIcons name="air-conditioner" size={18} color="#4CAF50" />
                        <Text style={styles.featureText}>
                          {item.busType || (item.isAC ? 'AC' : 'Non-AC')}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.actionButtons}>
                      <TouchableOpacity
                        style={styles.trackButton}
                        onPress={() => goToMap(item)}
                      >
                        <MaterialCommunityIcons name="map-marker-radius" size={20} color="#4CAF50" />
                        <Text style={styles.trackButtonText}>Track</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.bookButton}
                        onPress={() => gotoLayout(item)}
                      >
                        <MaterialCommunityIcons name="ticket" size={20} color="white" />
                        <Text style={styles.bookButtonText}>Book Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="bus-alert" size={60} color="#999" />
              <Text style={styles.emptyText}>No buses available</Text>
              <Text style={styles.emptySubtext}>
                No buses found. Please try another route or check back later.
              </Text>
              <TouchableOpacity 
                style={styles.tryAgainButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.tryAgainButtonText}>Try Another Route</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNavBar activeTab="Booking" />

      <Toast />
    </View>
  );
};

export default BusDetailsScreen;