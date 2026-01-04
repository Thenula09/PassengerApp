import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ActivityIndicator, 
  ScrollView,
  Share,
  Animated,
  Dimensions,
  Image
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const SuccessScreen = ({ navigation }) => {
  const route = useRoute();
  const { 
    busId, 
    busNumber,
    busName,
    passengerName,
    phoneNumber,
    selectedSeats,
    startLocation, 
    endLocation, 
    departureTime,
    arrivalTime,
    totalPayment, 
    paymentTimestamp 
  } = route.params;

  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState('');
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (!loading) {
      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading]);

  // Fetch user details and save booking receipt to Firebase
  useEffect(() => {
    const fetchAndSaveBooking = async () => {
      try {
        const user = auth().currentUser;

        if (user?.uid) {
          const snapshot = await database().ref(`/passenger/${user.uid}`).once('value');
          const userData = snapshot.val();

          // Save receipt to Firebase
          const receiptData = {
            userId: user.uid,
            busId: busId,
            busNumber: busNumber,
            busName: busName,
            passengerName: passengerName || userData?.username || 'Guest',
            phoneNumber: phoneNumber,
            selectedSeats: Array.isArray(selectedSeats) ? selectedSeats.join(', ') : selectedSeats,
            startLocation: startLocation,
            endLocation: endLocation,
            departureTime: departureTime,
            arrivalTime: arrivalTime,
            totalPayment: totalPayment,
            paymentTimestamp: paymentTimestamp,
            receiptGeneratedAt: new Date().toISOString(),
            status: 'confirmed',
          };

          // Save to Firebase /receipts/{userId}
          const newReceiptRef = await database()
            .ref(`/receipts/${user.uid}`)
            .push(receiptData);
          
          setBookingId(newReceiptRef.key);
        }
      } catch (error) {
        console.error('Error saving receipt:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSaveBooking();
  }, []);

  const handleGoHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handleViewBookings = () => {
    navigation.navigate('MyBookings');
  };

  const handleShareReceipt = async () => {
    try {
      await Share.share({
        message: `🎫 Bus Booking Confirmed!\n\n📍 ${startLocation} → ${endLocation}\n🚌 ${busNumber} - ${busName}\n💺 Seats: ${Array.isArray(selectedSeats) ? selectedSeats.join(', ') : selectedSeats}\n⏰ Departure: ${departureTime}\n💰 Total: Rs.${totalPayment}\n\nBooking ID: ${bookingId}`,
        title: 'My Bus Booking',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const qrValue = JSON.stringify({
    bookingId,
    busId,
    busNumber,
    busName,
    passengerName,
    selectedSeats: Array.isArray(selectedSeats) ? selectedSeats.join(', ') : selectedSeats,
    startLocation,
    endLocation,
    departureTime,
    arrivalTime,
    totalPayment,
    paymentTimestamp,
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Processing your booking...</Text>
          <Text style={styles.loadingSubText}>Please wait a moment</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient 
        colors={['#2E7D32', '#43A047', '#66BB6A']} 
        style={styles.headerBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Success Animation Header */}
        <Animated.View 
          style={[
            styles.successHeader,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          <View style={styles.successIconContainer}>
            <View style={styles.successIconRing}>
              <View style={styles.successIconInner}>
                <Ionicons name="checkmark" size={45} color="#2E7D32" />
              </View>
            </View>
          </View>
          <Text style={styles.successTitle}>Booking Successful!</Text>
          <Text style={styles.successSubtitle}>Your ticket has been confirmed</Text>
        </Animated.View>

        {/* Receipt Card */}
        <Animated.View 
          style={[
            styles.receiptCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Receipt Header */}
          <View style={styles.receiptHeader}>
            <View style={styles.receiptLogo}>
              <MaterialCommunityIcons name="bus" size={28} color="#2E7D32" />
            </View>
            <View style={styles.receiptHeaderText}>
              <Text style={styles.receiptTitle}>Highway Bus</Text>
              <Text style={styles.receiptSubtitle}>E-Ticket</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>CONFIRMED</Text>
            </View>
          </View>

          {/* Decorative Line */}
          <View style={styles.decorativeLine}>
            <View style={styles.decorativeCircleLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.decorativeCircleRight} />
          </View>

          {/* Route Section */}
          <View style={styles.routeSection}>
            <View style={styles.routePoint}>
              <View style={styles.routeDot} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>FROM</Text>
                <Text style={styles.routeCity}>{startLocation}</Text>
                <Text style={styles.routeTime}>{departureTime}</Text>
              </View>
            </View>
            
            <View style={styles.routeArrow}>
              <MaterialCommunityIcons name="arrow-right" size={24} color="#2E7D32" />
              <Text style={styles.busInfo}>{busNumber}</Text>
            </View>
            
            <View style={styles.routePoint}>
              <View style={[styles.routeDot, { backgroundColor: '#E91E63' }]} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>TO</Text>
                <Text style={styles.routeCity}>{endLocation}</Text>
                <Text style={styles.routeTime}>{arrivalTime}</Text>
              </View>
            </View>
          </View>

          {/* Ticket Details Grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="person" size={18} color="#666" />
              <Text style={styles.detailLabel}>Passenger</Text>
              <Text style={styles.detailValue}>{passengerName}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="seat" size={18} color="#666" />
              <Text style={styles.detailLabel}>Seat(s)</Text>
              <Text style={styles.detailValue}>
                {Array.isArray(selectedSeats) ? selectedSeats.join(', ') : selectedSeats}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="call" size={18} color="#666" />
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{phoneNumber}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <MaterialCommunityIcons name="bus" size={18} color="#666" />
              <Text style={styles.detailLabel}>Bus</Text>
              <Text style={styles.detailValue}>{busName}</Text>
            </View>
          </View>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Total Fare</Text>
              <Text style={styles.priceValue}>Rs. {totalPayment}</Text>
            </View>
            <View style={styles.bookingIdRow}>
              <Text style={styles.bookingIdLabel}>Booking ID</Text>
              <Text style={styles.bookingIdValue}>{bookingId?.slice(-8)?.toUpperCase() || '...'}</Text>
            </View>
          </View>

          {/* QR Code Section */}
          <View style={styles.qrSection}>
            <View style={styles.qrContainer}>
              <QRCode 
                value={qrValue} 
                size={140} 
                color="#2E7D32" 
                backgroundColor="#fff"
              />
            </View>
            <Text style={styles.qrHint}>Show this QR code to the conductor</Text>
          </View>

          {/* Booking Date */}
          <View style={styles.footerInfo}>
            <Ionicons name="time-outline" size={14} color="#999" />
            <Text style={styles.footerText}>
              Booked on {new Date(paymentTimestamp).toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View 
          style={[
            styles.actionButtons,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }
          ]}
        >
          {/* Share Button */}
          <Pressable style={styles.shareButton} onPress={handleShareReceipt}>
            <Ionicons name="share-social-outline" size={22} color="#2E7D32" />
            <Text style={styles.shareButtonText}>Share</Text>
          </Pressable>

          {/* View Bookings Button */}
          <Pressable style={styles.viewBookingsButton} onPress={handleViewBookings}>
            <MaterialCommunityIcons name="ticket-confirmation-outline" size={22} color="#2E7D32" />
            <Text style={styles.viewBookingsText}>My Bookings</Text>
          </Pressable>
        </Animated.View>

        {/* Home Button */}
        <Pressable style={styles.homeButton} onPress={handleGoHome}>
          <LinearGradient 
            colors={['#2E7D32', '#43A047']} 
            style={styles.homeButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="home-outline" size={22} color="#fff" />
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </LinearGradient>
        </Pressable>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingCard: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  loadingSubText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },

  // Success Header
  successHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successIconRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  successSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },

  // Receipt Card
  receiptCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
  },
  receiptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  receiptLogo: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  receiptTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  receiptSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
    letterSpacing: 0.5,
  },

  // Decorative Line
  decorativeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: -20,
  },
  decorativeCircleLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    marginLeft: -10,
  },
  dashedLine: {
    flex: 1,
    height: 2,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 10,
  },
  decorativeCircleRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    marginRight: -10,
  },

  // Route Section
  routeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingHorizontal: 5,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  routeInfo: {
    flex: 1,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2E7D32',
    marginRight: 10,
    marginTop: 4,
  },
  routeLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  routeCity: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginTop: 2,
  },
  routeTime: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  routeArrow: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  busInfo: {
    fontSize: 11,
    color: '#2E7D32',
    fontWeight: '600',
    marginTop: 4,
  },

  // Details Grid
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    marginBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 20,
  },
  detailItem: {
    width: '50%',
    marginBottom: 18,
  },
  detailLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 6,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 3,
  },

  // Price Section
  priceSection: {
    backgroundColor: '#F8FBF8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E7D32',
  },
  bookingIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E8F5E9',
  },
  bookingIdLabel: {
    fontSize: 12,
    color: '#999',
  },
  bookingIdValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    letterSpacing: 1,
  },

  // QR Section
  qrSection: {
    alignItems: 'center',
    paddingTop: 10,
  },
  qrContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E8F5E9',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  qrHint: {
    fontSize: 12,
    color: '#999',
    marginTop: 12,
    fontWeight: '500',
  },

  // Footer Info
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 6,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#2E7D32',
  },
  shareButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 8,
  },
  viewBookingsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 14,
    borderRadius: 12,
    marginLeft: 8,
  },
  viewBookingsText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D32',
    marginLeft: 8,
  },

  // Home Button
  homeButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  homeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 10,
  },
});

export default SuccessScreen;
