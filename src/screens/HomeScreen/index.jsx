import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Pressable, ScrollView, StatusBar, Animated, Easing, Modal, Dimensions, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import QRCode from 'react-native-qrcode-svg';
import styles from './styles';
import BottomNavBar from '../../components/BottomNavBar';
import Header from '../../components/Header';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Home');
  const [greeting, setGreeting] = useState('');
  const [bookingCount, setBookingCount] = useState(0);
  const [latestBooking, setLatestBooking] = useState(null);
  const [hasActiveBooking, setHasActiveBooking] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  // Animation for tracking icon
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.8)).current;
  const ringOpacity = useRef(new Animated.Value(1)).current;
  const modalScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Animated pulse effect for track button
  useEffect(() => {
    if (hasActiveBooking) {
      // Pulse animation
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );

      // Ring animation
      const ring = Animated.loop(
        Animated.parallel([
          Animated.timing(ringScale, {
            toValue: 1.8,
            duration: 1500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0,
            duration: 1500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      );

      pulse.start();
      ring.start();

      return () => {
        pulse.stop();
        ring.stop();
      };
    }
  }, [hasActiveBooking]);

  // Fetch booking count and latest booking
  useFocusEffect(
    useCallback(() => {
      const fetchBookings = async () => {
        try {
          const user = auth().currentUser;
          if (user?.uid) {
            const snapshot = await database()
              .ref(`/receipts/${user.uid}`)
              .orderByChild('paymentTimestamp')
              .once('value');
            const data = snapshot.val();
            if (data) {
              const bookingsList = Object.entries(data).map(([key, value]) => ({
                id: key,
                ...value,
              }));
              setBookingCount(bookingsList.length);
              
              // Get latest booking (sort by timestamp)
              bookingsList.sort((a, b) => 
                new Date(b.paymentTimestamp) - new Date(a.paymentTimestamp)
              );
              if (bookingsList.length > 0) {
                const booking = bookingsList[0];
                
                // Fetch bus time from buses node
                if (booking.busId) {
                  const busSnapshot = await database()
                    .ref(`/buses/${booking.busId}`)
                    .once('value');
                  const busData = busSnapshot.val();
                  if (busData && busData.time) {
                    booking.busTime = busData.time;
                  }
                }
                
                setLatestBooking(booking);
                
                // Check if booking is for today (active booking)
                const bookingDate = new Date(booking.paymentTimestamp);
                const today = new Date();
                const isToday = bookingDate.toDateString() === today.toDateString();
                setHasActiveBooking(isToday);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching bookings:', error);
        }
      };
      fetchBookings();
      
      // Reset ring animation on focus
      ringScale.setValue(0.8);
      ringOpacity.setValue(1);
    }, [])
  );

  const goToUserProfile = () => {
    setActiveTab('Profile');
    navigation.navigate('Profile');
  };

  const goToBooking = () => {
    setActiveTab('Booking');
    navigation.navigate('Destination');
  };

  const goToBusDetails = () => {
    setActiveTab('BusDetails');
    navigation.navigate('Destination Search');
  };

  const gotoSearch = () => {
    navigation.navigate('Destination');
  };

  const goToMyBookings = () => {
    navigation.navigate('MyBookings');
  };

  const goToTrackBus = () => {
    setActiveTab('Track');
    if (latestBooking && latestBooking.busId) {
      navigation.navigate('BusMapScreen', {
        busData: {
          busId: latestBooking.busId,
          busNumber: latestBooking.busNumber || 'Bus',
          departureTime: latestBooking.departureTime || '',
          startLocation: latestBooking.startLocation || '',
          endLocation: latestBooking.endLocation || '',
        },
        currentLocation: null, // Will be fetched from Firebase in BusMapScreen
      });
    } else if (latestBooking && !latestBooking.busId) {
      Alert.alert(
        'Tracking Unavailable',
        'Bus ID not found for this booking. Please try booking again.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert(
        'No Active Booking',
        'You don\'t have any active bookings to track. Would you like to book a bus?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Book Now', onPress: () => navigation.navigate('Destination') }
        ]
      );
    }
  };

  // QR Modal functions
  const openQRModal = () => {
    setShowQRModal(true);
    Animated.spring(modalScale, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const closeQRModal = () => {
    Animated.timing(modalScale, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowQRModal(false));
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <Header
        title={`${greeting} 👋`}
        subtitle="Where do you want to go?"
        showNotification={true}
        showSearch={true}
        onSearchPress={gotoSearch}
      />

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        

        {/* Latest Booking QR Code Section */}
        {latestBooking && (
          <TouchableOpacity 
            style={styles.qrTicketCard}
            onPress={openQRModal}
            activeOpacity={0.85}
          >
            <View style={styles.qrTicketIconContainer}>
              <MaterialCommunityIcons name="qrcode-scan" size={32} color="#4CAF50" />
            </View>
            <View style={styles.qrTicketTextContainer}>
              <Text style={styles.qrTicketTitle}>View Your Ticket</Text>
              <Text style={styles.qrTicketSubtitle}>Tap to show QR code</Text>
            </View>
            <View style={styles.qrTicketArrow}>
              <Ionicons name="chevron-forward" size={24} color="#4CAF50" />
            </View>
          </TouchableOpacity>
        )}

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <Text style={styles.sectionTitle}>Easy to Find Your Location</Text>
          <View style={styles.mapWrapper}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              showsUserLocation={true}
              region={{
                latitude: 5.9431,
                longitude: 80.5490,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            />
            <TouchableOpacity style={styles.mapOverlay}>
              <MaterialCommunityIcons name="fullscreen" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoCard}>
          <LinearGradient
            colors={['#1B5E20', '#2E7D32', '#388E3C']}
            style={styles.infoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.infoContent}>
              <View style={styles.infoIcon}>
                <Ionicons name="bus" size={32} color="white" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Travel with Highway Bus</Text>
                <Text style={styles.infoDescription}>
                  Book your seat in advance and enjoy a safe, comfortable journey
                </Text>
                <TouchableOpacity style={styles.learnMoreBtn}>
                  <Text style={styles.learnMoreText}>Learn more</Text>
                  <AntDesign name="arrowright" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Why Choose Us?</Text>
          <View style={styles.featuresList}>
            {[
              { icon: 'shield-check', title: 'Real Time Trcking', desc: 'Your safety is our priority' },
              { icon: 'clock-fast', title: 'On Time', desc: 'Always punctual service' },
              { icon: 'wallet', title: 'Best Price', desc: 'Affordable fares' },
            ].map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <MaterialCommunityIcons name={feature.icon} size={24} color="#4CAF50" />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc}>{feature.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavBar activeTab="Home" />

      {/* QR Code Modal */}
      <Modal
        visible={showQRModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeQRModal}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeQRModal}
        >
          <Animated.View 
            style={[
              styles.modalContainer,
              { transform: [{ scale: modalScale }] }
            ]}
          >
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderIcon}>
                  <Ionicons name="ticket" size={24} color="#4CAF50" />
                </View>
                <Text style={styles.modalHeaderTitle}>Your Ticket</Text>
                <TouchableOpacity style={styles.modalCloseBtn} onPress={closeQRModal}>
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Large QR Code */}
              <View style={styles.modalQRContainer}>
                <View style={styles.modalQRWrapper}>
                  {latestBooking && (
                    <QRCode
                      value={JSON.stringify({
                        bookingId: latestBooking.id,
                        busId: latestBooking.busId,
                        busNumber: latestBooking.busNumber,
                        passengerName: latestBooking.passengerName,
                        selectedSeats: latestBooking.selectedSeats,
                        startLocation: latestBooking.startLocation,
                        endLocation: latestBooking.endLocation,
                        departureTime: latestBooking.departureTime,
                        totalPayment: latestBooking.totalPayment,
                      })}
                      size={SCREEN_WIDTH * 0.55}
                      color="#2E7D32"
                      backgroundColor="#fff"
                    />
                  )}
                </View>
                <Text style={styles.modalQRHint}>Show this QR code to the conductor</Text>
              </View>

              {/* Passenger Details */}
              {latestBooking && (
                <View style={styles.modalDetailsContainer}>
                  {/* Passenger Name */}
                  <View style={styles.modalDetailRow}>
                    <View style={styles.modalDetailIcon}>
                      <Ionicons name="person" size={18} color="#4CAF50" />
                    </View>
                    <View style={styles.modalDetailTextContainer}>
                      <Text style={styles.modalDetailLabel}>Passenger</Text>
                      <Text style={styles.modalDetailValue}>{latestBooking.passengerName || 'N/A'}</Text>
                    </View>
                  </View>

                  {/* Route */}
                  <View style={styles.modalDetailRow}>
                    <View style={styles.modalDetailIcon}>
                      <MaterialCommunityIcons name="map-marker-path" size={18} color="#2196F3" />
                    </View>
                    <View style={styles.modalDetailTextContainer}>
                      <Text style={styles.modalDetailLabel}>Route</Text>
                      <Text style={styles.modalDetailValue} numberOfLines={1}>
                        {latestBooking.startLocation} → {latestBooking.endLocation}
                      </Text>
                    </View>
                  </View>

                  {/* Bus & Seats Row */}
                  <View style={styles.modalDetailGrid}>
                    <View style={styles.modalDetailGridItem}>
                      <View style={styles.modalDetailIcon}>
                        <FontAwesome5 name="bus" size={16} color="#FF9800" />
                      </View>
                      <View style={styles.modalDetailTextContainer}>
                        <Text style={styles.modalDetailLabel}>Bus</Text>
                        <Text style={styles.modalDetailValue}>{latestBooking.busNumber}</Text>
                      </View>
                    </View>
                    <View style={styles.modalDetailGridItem}>
                      <View style={styles.modalDetailIcon}>
                        <MaterialCommunityIcons name="seat" size={18} color="#9C27B0" />
                      </View>
                      <View style={styles.modalDetailTextContainer}>
                        <Text style={styles.modalDetailLabel}>Seats</Text>
                        <Text style={styles.modalDetailValue}>{latestBooking.selectedSeats}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Departure Time */}
                  <View style={styles.modalDetailRow}>
                    <View style={styles.modalDetailIcon}>
                      <Ionicons name="time" size={18} color="#E91E63" />
                    </View>
                    <View style={styles.modalDetailTextContainer}>
                      <Text style={styles.modalDetailLabel}>Departure</Text>
                      <Text style={styles.modalDetailValue}>
                        {latestBooking.busTime || latestBooking.departureTime || 'N/A'}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* View All Booking Button */}
              <TouchableOpacity 
                style={styles.modalViewAllBtn} 
                onPress={() => {
                  closeQRModal();
                  setTimeout(() => goToMyBookings(), 300);
                }}
              >
                <Text style={styles.modalViewAllText}>View All Tickets</Text>
                <Ionicons name="chevron-forward" size={18} color="#4CAF50" />
              </TouchableOpacity>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default HomeScreen;
