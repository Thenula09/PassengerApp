import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
            status: 'completed',
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

  const handleSaveReceipt = () => {
    Alert.alert(
      "Confirm",
      "Do you want to go back to Home screen?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            navigation.navigate('Home');
          }
        }
      ],
      { cancelable: true }
    );
  };

  const qrValue = JSON.stringify({
    bookingId,
    busId,
    busNumber,
    busName,
    passengerName,
    selectedSeats,
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
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={{ marginTop: 10, color: '#666' }}>Processing your booking...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#E8F5E9', '#ffffff']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Header */}
        <View style={styles.successHeader}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark-done" size={50} color="#2E7D32" />
          </View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>Your seat reservation is complete</Text>
        </View>

        {/* Booking Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Booking Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Booking ID:</Text>
            <Text style={styles.value}>{bookingId || 'Generating...'}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.label}>Bus:</Text>
            <Text style={styles.value}>{busNumber} - {busName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Passenger Name:</Text>
            <Text style={styles.value}>{passengerName}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.value}>{phoneNumber}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.label}>From:</Text>
            <Text style={styles.value}>{startLocation}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>To:</Text>
            <Text style={styles.value}>{endLocation}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Departure:</Text>
            <Text style={styles.value}>{departureTime}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Arrival:</Text>
            <Text style={styles.value}>{arrivalTime}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.label}>Seats Selected:</Text>
            <Text style={styles.value}>{Array.isArray(selectedSeats) ? selectedSeats.join(', ') : selectedSeats}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Total Amount:</Text>
            <Text style={[styles.value, { color: '#2E7D32', fontWeight: '700', fontSize: 16 }]}>Rs:{totalPayment}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.label}>Booked On:</Text>
            <Text style={styles.value}>{new Date(paymentTimestamp).toLocaleString()}</Text>
          </View>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <Text style={styles.qrText}>Scan QR Code for Receipt</Text>
            <QRCode value={qrValue} size={180} color="#2E7D32" backgroundColor="#fff" />
          </View>
        </View>

        {/* Action Button */}
        <Pressable style={styles.homeButton} onPress={handleSaveReceipt}>
          <LinearGradient colors={['#2E7D32', '#43A047']} style={styles.buttonGradient}>
            <Ionicons name="home-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </LinearGradient>
        </Pressable>

        <View style={styles.spacing} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  // Success Header
  successHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#2E7D32',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },

  // Card Styling
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#2E7D32',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#E8F5E9',
  },

  // Detail Row
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8F5E9',
    marginVertical: 12,
  },

  // QR Container
  qrContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8F5E9',
    alignItems: 'center',
  },
  qrText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 16,
  },

  // Home Button
  homeButton: {
    marginHorizontal: 0,
    marginBottom: 16,
    height: 56,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
  spacing: {
    height: 20,
  },
});

export default SuccessScreen;
