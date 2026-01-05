import React, { useEffect, useState, useRef, Component } from 'react';
import { 
  View, 
  Text, 
  Dimensions, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
  Platform,
  PermissionsAndroid
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import Geolocation from 'react-native-geolocation-service'; // Disabled - causing crash
import MapViewDirections from 'react-native-maps-directions';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';

const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_APIKEY = 'AIzaSyCIK1Z1X8H2GId9qNBVa4ilaccNG-cXuXE';

// Error Boundary Component
class MapErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Map Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 }}>
          <MaterialCommunityIcons name="map-marker-off" size={80} color="#F44336" />
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20, color: '#333' }}>Map Error</Text>
          <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginTop: 10 }}>
            {this.state.error?.message || 'Unable to load map'}
          </Text>
          <TouchableOpacity 
            style={{ marginTop: 30, backgroundColor: '#4CAF50', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 25 }}
            onPress={() => this.props.navigation?.goBack()}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const BusMapScreen = ({ route }) => {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  
  // Debug log
  console.log('BusMapScreen mounted, route:', route);
  console.log('BusMapScreen params:', route?.params);
  
  // Get params with defaults - handle undefined route.params
  const params = route?.params || {};
  const busData = params.busData || {};
  const initialBusLocation = params.currentLocation || null;
  
  console.log('BusMapScreen busData:', busData);
  
  const [userLocation, setUserLocation] = useState(null);
  const [busLocation, setBusLocation] = useState(initialBusLocation);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [error, setError] = useState(null);
  const [driverInfo, setDriverInfo] = useState(null);
  const [isDriverOnline, setIsDriverOnline] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  
  // Animation for bus pulse
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Pulse animation for bus marker
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Rotate animation for refresh button
  const startRotate = () => {
    rotateAnim.setValue(0);
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Request location permission
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to show your position on the map.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Get user location - using default location only (Geolocation disabled)
  useEffect(() => {
    // Use default Colombo location - Geolocation library causing crashes
    setUserLocation({
      latitude: 6.9271,
      longitude: 79.8612,
    });
    setLoading(false);
  }, []);

  // Listen for real-time bus location updates from liveLocation node
  useEffect(() => {
    if (busData?.busId) {
      const busRef = database().ref(`/buses/${busData.busId}/liveLocation`);
      
      const unsubscribe = busRef.on('value', (snapshot) => {
        const liveData = snapshot.val();
        if (liveData) {
          // Check if driver is tracking
          if (liveData.isTracking && liveData.latitude && liveData.longitude) {
            setBusLocation({
              latitude: liveData.latitude,
              longitude: liveData.longitude,
            });
            setIsDriverOnline(true);
            setLastUpdated(liveData.lastUpdated || null);
            
            // Set driver info
            if (liveData.driverName) {
              setDriverInfo({
                name: liveData.driverName,
                email: liveData.driverEmail,
                id: liveData.driverId,
              });
            }
          } else {
            setIsDriverOnline(false);
          }
        } else {
          setIsDriverOnline(false);
        }
      });

      return () => busRef.off('value', unsubscribe);
    }
  }, [busData.busId]);

  // Center on user
  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  };

  // Center on bus
  const centerOnBus = () => {
    if (busLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...busLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  };

  // Fit both markers
  const fitBothMarkers = () => {
    startRotate();
    if (userLocation && busLocation && mapRef.current) {
      mapRef.current.fitToCoordinates([userLocation, busLocation], {
        edgePadding: { top: 100, right: 50, bottom: 250, left: 50 },
        animated: true,
      });
    }
  };

  // Handle directions ready
  const handleDirectionsReady = (result) => {
    setDistance(result.distance.toFixed(1));
    setDuration(Math.ceil(result.duration));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#1B5E20', '#2E7D32', '#388E3C']}
          style={styles.loadingGradient}
        >
          <Animated.View style={[styles.loadingIcon, { transform: [{ scale: pulseAnim }] }]}>
            <FontAwesome5 name="bus" size={50} color="white" />
          </Animated.View>
          <Text style={styles.loadingText}>Finding your location...</Text>
          <ActivityIndicator size="large" color="white" style={{ marginTop: 20 }} />
        </LinearGradient>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="map-marker-off" size={80} color="#F44336" />
        <Text style={styles.errorTitle}>Location Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            setLoading(true);
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      {/* Map */}
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude || 6.9271,
          longitude: userLocation?.longitude || 79.8612,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={false}
        onMapReady={() => {
          console.log('Map is ready');
          setMapReady(true);
        }}
      >
        {/* User Marker - hidden since showsUserLocation is true */}
        {userLocation && (
          <Marker coordinate={userLocation} title="You are here" anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.userMarkerContainer}>
              <View style={styles.userMarkerOuter}>
                <View style={styles.userMarkerInner} />
              </View>
            </View>
          </Marker>
        )}

        {/* Bus Marker */}
        {busLocation && busLocation.latitude && busLocation.longitude && (
          <Marker 
            coordinate={busLocation} 
            title={busData?.busNumber || 'Bus'} 
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.busMarkerContainer}>
              <View style={styles.busMarkerPulse} />
              <View style={styles.busMarker}>
                <FontAwesome5 name="bus" size={20} color="white" />
              </View>
            </View>
          </Marker>
        )}

        {/* Directions Line */}
        {userLocation && busLocation && busLocation.latitude && busLocation.longitude && (
          <MapViewDirections
            origin={userLocation}
            destination={busLocation}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="#4CAF50"
            onReady={handleDirectionsReady}
            onError={(errorMessage) => console.log('Directions error:', errorMessage)}
          />
        )}
      </MapView>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Track Bus</Text>
          {busData?.busNumber && (
            <Text style={styles.headerSubtitle}>{busData.busNumber}</Text>
          )}
        </View>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <TouchableOpacity style={styles.refreshButton} onPress={fitBothMarkers}>
            <Ionicons name="refresh" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Map Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.controlButton} onPress={centerOnUser}>
          <MaterialCommunityIcons name="crosshairs-gps" size={22} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={centerOnBus}>
          <FontAwesome5 name="bus" size={18} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Bottom Info Card */}
      <View style={styles.bottomCard}>
        <LinearGradient
          colors={['#ffffff', '#f8f9fa']}
          style={styles.bottomCardGradient}
        >
          {/* Bus Info */}
          <View style={styles.busInfoRow}>
            <View style={styles.busIconBox}>
              <FontAwesome5 name="bus" size={24} color="#4CAF50" />
            </View>
            <View style={styles.busDetails}>
              <Text style={styles.busNumberText}>{busData?.busNumber || 'Bus'}</Text>
              <View style={styles.busStatusRow}>
                <View style={[styles.statusDot, { backgroundColor: isDriverOnline ? '#4CAF50' : '#FF9800' }]} />
                <Text style={styles.statusText}>
                  {isDriverOnline ? 'Live Tracking' : 'Driver Offline'}
                </Text>
              </View>
              {lastUpdated && isDriverOnline && (
                <Text style={styles.lastUpdatedText}>
                  Updated: {new Date(lastUpdated).toLocaleTimeString()}
                </Text>
              )}
            </View>
            {distance && duration && (
              <View style={styles.etaContainer}>
                <Text style={styles.etaTime}>{duration} min</Text>
                <Text style={styles.etaDistance}>{distance} km away</Text>
              </View>
            )}
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="map-marker-distance" size={24} color="#4CAF50" />
              <Text style={styles.statValue}>{distance || '--'} km</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="clock-outline" size={24} color="#FF9800" />
              <Text style={styles.statValue}>{duration || '--'} min</Text>
              <Text style={styles.statLabel}>ETA</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="bus-clock" size={24} color="#2196F3" />
              <Text style={styles.statValue}>{busData?.departureTime || '--'}</Text>
              <Text style={styles.statLabel}>Departure</Text>
            </View>
          </View>

          {!busLocation && (
            <View style={styles.noBusLocationCard}>
              <MaterialCommunityIcons name="bus-alert" size={40} color="#FF9800" />
              <Text style={styles.noBusText}>Bus location not available</Text>
              <Text style={styles.noBusSubtext}>The bus may not have started yet</Text>
            </View>
          )}
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  retryButton: {
    marginTop: 30,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  map: {
    width: width,
    height: height,
    position: 'absolute',
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    left: 15,
    right: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapControls: {
    position: 'absolute',
    right: 15,
    top: Platform.OS === 'ios' ? 130 : StatusBar.currentHeight + 90,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  controlButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  userMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userMarkerOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(33, 150, 243, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMarkerInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2196F3',
    borderWidth: 2,
    borderColor: 'white',
  },
  busMarkerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  busMarkerPulse: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
  },
  busMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  bottomCardGradient: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 35 : 25,
  },
  busInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  busIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  busDetails: {
    flex: 1,
    marginLeft: 15,
  },
  busNumberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  busStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  lastUpdatedText: {
    fontSize: 11,
    color: '#888',
    marginTop: 2,
  },
  etaContainer: {
    alignItems: 'flex-end',
  },
  etaTime: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  etaDistance: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ddd',
    marginVertical: 5,
  },
  noBusLocationCard: {
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: 15,
    backgroundColor: '#FFF3E0',
    borderRadius: 16,
  },
  noBusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E65100',
    marginTop: 10,
  },
  noBusSubtext: {
    fontSize: 13,
    color: '#FF9800',
    marginTop: 4,
  },
});

// Wrap with Error Boundary
const BusMapScreenWithErrorBoundary = (props) => {
  const navigation = useNavigation();
  return (
    <MapErrorBoundary navigation={navigation}>
      <BusMapScreen {...props} />
    </MapErrorBoundary>
  );
};

export default BusMapScreenWithErrorBoundary;
