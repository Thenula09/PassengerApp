import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, FlatList, StatusBar, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import RouteMap from '../../components/RouteMap';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-toast-message';

const BusDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { originPlace, destinationPlace } = route.params;

  const [availableBuses, setAvailableBuses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('buses');

  useEffect(() => {
    const fetchAvailableBuses = async () => {
      try {
        const snapshot = await database().ref('/buses').once('value');
        const busesData = [];

        snapshot.forEach((childSnapshot) => {
          const bus = childSnapshot.val();
          const busId = childSnapshot.key;

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
              busesData.push({ ...bus, busId });
            }
          } else {
            console.warn('Invalid bus data or missing location fields:', bus);
          }
        });

        setAvailableBuses(busesData);
      } catch (error) {
        console.error('Error fetching buses:', error);
        setErrorMessage('Could not fetch buses. Please try again later.');
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Could not fetch buses. Please try again later.',
        });
      }
    };

    fetchAvailableBuses();
  }, [originPlace, destinationPlace]);

  const gotoLayout = (bus) => {
    navigation.navigate('Bus Layout', { busId: bus.busId });
  };

  const goToMap = (bus) => {
    const { currentLocation, driverLocation } = bus;
    navigation.navigate('BusMapScreen', {
      currentLocation: currentLocation,
      driverLocation: driverLocation,
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleHome = () => {
    navigation.navigate('Home');
  };

  const goToBooking = () => {
    navigation.navigate('Destination');
  };

  const goToUserProfile = () => {
    navigation.navigate('UserProfile');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <LinearGradient
        colors={['#1B5E20', '#2E7D32', '#388E3C']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Available Buses</Text>
            <Text style={styles.headerSubtitle}>
              {availableBuses.length} {availableBuses.length === 1 ? 'bus' : 'buses'} found
            </Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

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
                  {originPlace?.data?.description || 'Origin'}
                </Text>
              </View>
              <View style={styles.locationItem}>
                <Text style={styles.locationLabel}>To</Text>
                <Text style={styles.locationText} numberOfLines={1}>
                  {destinationPlace?.data?.description || 'Destination'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.mapContainer}>
          <RouteMap origin={originPlace} destination={destinationPlace} />
        </View>

        <View style={styles.busListSection}>
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-circle" size={50} color="#F44336" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : availableBuses.length > 0 ? (
            <FlatList
              data={availableBuses}
              scrollEnabled={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.busCard}>
                  <View style={styles.busHeader}>
                    <View style={styles.busIconContainer}>
                      <FontAwesome5 name="bus" size={28} color="#4CAF50" />
                    </View>
                    <View style={styles.busInfoContainer}>
                      <Text style={styles.busNumber}>{item.busNumber}</Text>
                      <View style={styles.busDetailRow}>
                        <MaterialCommunityIcons name="clock-outline" size={16} color="#666" />
                        <Text style={styles.busDetailText}>
                          {item.departureTime || 'N/A'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceLabel}>Price</Text>
                      <Text style={styles.priceText}>Rs {item.price || '0'}</Text>
                    </View>
                  </View>

                  <View style={styles.busFooter}>
                    <View style={styles.busFeatures}>
                      <View style={styles.featureItem}>
                        <MaterialCommunityIcons name="seat-passenger" size={18} color="#4CAF50" />
                        <Text style={styles.featureText}>
                          {item.availableSeats || 0} seats
                        </Text>
                      </View>
                      <View style={styles.featureItem}>
                        <MaterialCommunityIcons name="air-conditioner" size={18} color="#4CAF50" />
                        <Text style={styles.featureText}>
                          {item.isAC ? 'AC' : 'Non-AC'}
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
                No buses found for the selected route. Please try another route.
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navButton} onPress={handleHome}>
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={24}
            color={activeTab === 'home' ? '#4CAF50' : '#999'}
          />
          <Text style={[styles.navText, activeTab === 'home' && styles.activeNavText]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={goToBooking}>
          <Ionicons
            name={activeTab === 'booking' ? 'search' : 'search-outline'}
            size={24}
            color={activeTab === 'booking' ? '#4CAF50' : '#999'}
          />
          <Text style={[styles.navText, activeTab === 'booking' && styles.activeNavText]}>
            Booking
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => setActiveTab('buses')}>
          <FontAwesome5
            name="bus"
            size={22}
            color={activeTab === 'buses' ? '#4CAF50' : '#999'}
          />
          <Text style={[styles.navText, activeTab === 'buses' && styles.activeNavText]}>
            Buses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={goToUserProfile}>
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={24}
            color={activeTab === 'profile' ? '#4CAF50' : '#999'}
          />
          <Text style={[styles.navText, activeTab === 'profile' && styles.activeNavText]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </View>
  );
};

export default BusDetailsScreen;
