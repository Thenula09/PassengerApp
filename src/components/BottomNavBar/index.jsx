import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing, StyleSheet, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const BottomNavBar = ({ activeTab = 'Home' }) => {
  const navigation = useNavigation();
  const [bookingCount, setBookingCount] = React.useState(0);
  const [hasActiveBooking, setHasActiveBooking] = React.useState(false);
  const [latestBooking, setLatestBooking] = React.useState(null);

  // Animation refs
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringScale = useRef(new Animated.Value(0.8)).current;
  const ringOpacity = useRef(new Animated.Value(1)).current;

  // Fetch booking data
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
              
              bookingsList.sort((a, b) => 
                new Date(b.paymentTimestamp) - new Date(a.paymentTimestamp)
              );
              if (bookingsList.length > 0) {
                setLatestBooking(bookingsList[0]);
                const bookingDate = new Date(bookingsList[0].paymentTimestamp);
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
      
      ringScale.setValue(0.8);
      ringOpacity.setValue(1);
    }, [])
  );

  // Animations
  useEffect(() => {
    if (hasActiveBooking) {
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

  const goToHome = () => navigation.navigate('Home');
  const goToBooking = () => navigation.navigate('Destination');
  const goToMyBookings = () => navigation.navigate('MyBookings');
  const goToUserProfile = () => navigation.navigate('Profile');
  
  const goToTrackBus = () => {
    if (latestBooking && latestBooking.busId) {
      navigation.navigate('BusMapScreen', {
        busData: {
          busId: latestBooking.busId,
          busNumber: latestBooking.busNumber || 'Bus',
          departureTime: latestBooking.departureTime || '',
          startLocation: latestBooking.startLocation || '',
          endLocation: latestBooking.endLocation || '',
        },
        currentLocation: null,
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

  return (
    <View style={styles.bottomNavigation}>
      <TouchableOpacity
        style={[styles.navButton, activeTab === 'Home' && styles.activeTab]}
        onPress={goToHome}>
        <Ionicons 
          name={activeTab === 'Home' ? 'home' : 'home-outline'} 
          size={24} 
          color={activeTab === 'Home' ? '#4CAF50' : '#666'} 
        />
        <Text style={[styles.navText, activeTab === 'Home' && styles.activeNavText]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, activeTab === 'Booking' && styles.activeTab]}
        onPress={goToBooking}>
        <AntDesign 
          name="calendar" 
          size={24} 
          color={activeTab === 'Booking' ? '#4CAF50' : '#666'} 
        />
        <Text style={[styles.navText, activeTab === 'Booking' && styles.activeNavText]}>Book</Text>
      </TouchableOpacity>

      {/* Animated Track Bus Button */}
      <TouchableOpacity
        style={styles.trackNavButton}
        onPress={goToTrackBus}
        activeOpacity={0.8}>
        <View style={styles.trackButtonContainer}>
          {hasActiveBooking && (
            <Animated.View 
              style={[
                styles.trackButtonRing, 
                { 
                  transform: [{ scale: ringScale }],
                  opacity: ringOpacity 
                }
              ]} 
            />
          )}
          <Animated.View 
            style={[
              styles.trackButtonInner,
              hasActiveBooking && { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <LinearGradient
              colors={hasActiveBooking ? ['#17b21aff', '#25af23ff'] : ['#9E9E9E', '#757575']}
              style={styles.trackButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome5 name="bus" size={20} color="white" />
            </LinearGradient>
          </Animated.View>
          {hasActiveBooking && (
            <View style={styles.trackLiveDot} />
          )}
        </View>
        <Text style={[styles.navText, styles.trackNavText, hasActiveBooking && styles.trackNavTextActive]}>Track</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, activeTab === 'MyBookings' && styles.activeTab]}
        onPress={goToMyBookings}>
        <View>
          <MaterialCommunityIcons 
            name="ticket-confirmation-outline" 
            size={24} 
            color={activeTab === 'MyBookings' ? '#4CAF50' : '#666'} 
          />
          {bookingCount > 0 && (
            <View style={styles.navBadge}>
              <Text style={styles.navBadgeText}>{bookingCount > 9 ? '9+' : bookingCount}</Text>
            </View>
          )}
        </View>
        <Text style={[styles.navText, activeTab === 'MyBookings' && styles.activeNavText]}>Tickets</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, activeTab === 'Profile' && styles.activeTab]}
        onPress={goToUserProfile}>
        <FontAwesome5 
          name={activeTab === 'Profile' ? 'user-alt' : 'user'} 
          size={22} 
          color={activeTab === 'Profile' ? '#4CAF50' : '#666'} 
        />
        <Text style={[styles.navText, activeTab === 'Profile' && styles.activeNavText]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingBottom: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 15,
  },
  navButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
  },
  navText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
    marginTop: 4,
  },
  activeNavText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  activeTab: {
    backgroundColor: '#E8F5E9',
  },
  navBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#FF5252',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    paddingHorizontal: 3,
  },
  navBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
  trackNavButton: {
    alignItems: 'center',
    paddingVertical: 4,
    marginTop: -30,
  },
  trackButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  trackButtonRing: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#3bc929ff',
    backgroundColor: 'transparent',
  },
  trackButtonInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: '#1dbe18ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  trackButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 26,
    borderWidth: 3,
    borderColor: '#fff',
  },
  trackLiveDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#db1d1dff',
    borderWidth: 2,
    borderColor: '#fff',
  },
  trackNavText: {
    marginTop: 6,
    color: '#666',
  },
  trackNavTextActive: {
    color: '#41a314ff',
    fontWeight: '600',
  },
});

export default BottomNavBar;
