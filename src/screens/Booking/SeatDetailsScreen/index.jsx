import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Dimensions, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../../components/Header';

// Color constants
const GREEN_PRIMARY = '#2E7D32';
const GREEN_SECONDARY = '#43A047';
const GREEN_LIGHT = '#E8F5E9';
const WHITE = '#fff';
const GRAY_LIGHT = '#F5F5F5';
const GRAY_TEXT = '#666666';

const SeatDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const selectedSeats = route.params?.selectedSeats || [];
  const busId = route.params?.busId;
  
  // Receive all bus details from navigation params
  const busDetails = {
    busNumber: route.params?.busNumber || 'BUS-001',
    busName: route.params?.busName || 'Deluxe Coach',
    departureTime: route.params?.departureTime || '10:00 AM',
    arrivalTime: route.params?.arrivalTime || '2:00 PM',
    price: route.params?.price || 2500,
    startLocation: route.params?.startLocation || 'Matara Bus Stand',
    endLocation: route.params?.endLocation || 'Colombo Fort',
    totalSeats: route.params?.totalSeats || 45,
    isAC: route.params?.isAC || true,
    busType: route.params?.busType || 'Deluxe',
  };

  const [passengerName, setPassengerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user details and auto-populate passenger fields
  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const user = auth().currentUser;
      
      if (user?.uid) {
        // Try to fetch from /passenger/{userId}
        const snapshot = await database().ref(`/passenger/${user.uid}`).once('value');
        const userData = snapshot.val();

        if (userData) {
          console.log('User data found:', userData);
          // Try multiple field names for username
          const name = userData.username || userData.firstName || userData.fullName || userData.name || '';
          const phone = userData.phoneNumber || userData.phone || userData.mobile || '';
          
          setPassengerName(name);
          setPhoneNumber(phone);
        } else {
          console.log('No user data found in /passenger/' + user.uid);
          // If not in /passenger, try to get from auth user profile
          if (user.displayName) {
            setPassengerName(user.displayName);
          }
          if (user.phoneNumber) {
            setPhoneNumber(user.phoneNumber);
          }
        }
      } else {
        console.log('No logged-in user found');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      Alert.alert('Info', 'Could not auto-fill passenger details. Please enter manually.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch on component mount
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Refetch when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchUserDetails();
    }, [])
  );

  // Booking details with dynamic data from Firebase
  const bookingDetails = {
    fromLocation: busDetails.startLocation,
    toLocation: busDetails.endLocation,
    busNumber: busDetails.busNumber,
    departureTime: busDetails.departureTime,
    totalSeats: selectedSeats.length,
    pricePerSeat: busDetails.price,
    totalPayment: selectedSeats.length * busDetails.price,
  };

  const validateFields = () => {
    let newErrors = {};
    if (!passengerName.trim()) newErrors.passengerName = 'Passenger name required';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'Phone number required';
    if (!cardHolderName.trim()) newErrors.cardHolderName = 'Card holder name required';
    if (!cardNumber.trim() || cardNumber.length < 16) newErrors.cardNumber = 'Valid card number required';
    if (!expiryDate.trim()) newErrors.expiryDate = 'Expiry date required';
    if (!cvv.trim() || cvv.length < 3) newErrors.cvv = 'Valid CVV required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmPayment = () => {
    if (validateFields()) {
      if (!busId) {
        Alert.alert('Error', 'Bus ID not found!');
        return;
      }

      const paymentTimestamp = new Date().toISOString();
      const bookingData = {
        busId: busId,
        busNumber: busDetails.busNumber,
        busName: busDetails.busName,
        passengerName: passengerName,
        phoneNumber: phoneNumber,
        selectedSeats: selectedSeats.join(', '),
        totalSeats: selectedSeats.length,
        pricePerSeat: busDetails.price,
        totalPayment: bookingDetails.totalPayment,
        startLocation: busDetails.startLocation,
        endLocation: busDetails.endLocation,
        departureTime: busDetails.departureTime,
        arrivalTime: busDetails.arrivalTime,
        paymentTimestamp: paymentTimestamp,
        cardLastFour: cardNumber.slice(-4),
        status: 'confirmed',
      };

      database()
        .ref(`/bookings/${busId}`)
        .push(bookingData)
        .then(() => {
          Alert.alert('Success', 'Booking confirmed successfully!');
          navigation.navigate('SuccessScreen', {
            busId,
            busNumber: busDetails.busNumber,
            busName: busDetails.busName,
            passengerName,
            phoneNumber,
            selectedSeats,
            startLocation: busDetails.startLocation,
            endLocation: busDetails.endLocation,
            departureTime: busDetails.departureTime,
            arrivalTime: busDetails.arrivalTime,
            totalPayment: bookingDetails.totalPayment,
            paymentTimestamp,
          });
        })
        .catch((error) => {
          Alert.alert('Error', `Failed to process payment: ${error.message}`);
        });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Header */}
      <Header 
        title="Booking Details" 
        subtitle={`${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''} selected`}
        showBackButton={true}
      />

      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" color={GREEN_PRIMARY} size={28} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirm Booking</Text>
          <View style={{ width: 46 }} />
        </View>
        <Text style={styles.headerSubtitle}>Complete your booking details</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Booking Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            <View style={styles.summaryBadge}>
              <Text style={styles.summaryBadgeText}>{selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''}</Text>
            </View>
          </View>

          <View style={styles.summaryContent}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <MaterialCommunityIcons name="map-marker" size={18} color={GREEN_PRIMARY} />
                <View style={styles.summaryTextContainer}>
                  <Text style={styles.summaryLabel}>From</Text>
                  <Text style={styles.summaryValue}>{bookingDetails.fromLocation}</Text>
                </View>
              </View>
              <Ionicons name="arrow-forward" size={18} color={GREEN_SECONDARY} />
              <View style={styles.summaryItem}>
                <MaterialCommunityIcons name="map-marker" size={18} color={GREEN_PRIMARY} />
                <View style={styles.summaryTextContainer}>
                  <Text style={styles.summaryLabel}>To</Text>
                  <Text style={styles.summaryValue}>{bookingDetails.toLocation}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsGrid}>
              <View style={styles.detailBox}>
                <Ionicons name="bus" size={20} color={GREEN_PRIMARY} />
                <Text style={styles.detailLabel}>Bus</Text>
                <Text style={styles.detailValue}>{bookingDetails.busNumber}</Text>
              </View>
              <View style={styles.detailBox}>
                <Ionicons name="time" size={20} color={GREEN_PRIMARY} />
                <Text style={styles.detailLabel}>Depart</Text>
                <Text style={styles.detailValue}>{bookingDetails.departureTime}</Text>
              </View>
              <View style={styles.detailBox}>
                <Ionicons name="ticket" size={20} color={GREEN_PRIMARY} />
                <Text style={styles.detailLabel}>Seats</Text>
                <Text style={styles.detailValue}>{selectedSeats.join(', ')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Passenger Details Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="account" size={20} color={GREEN_PRIMARY} />
            <Text style={styles.sectionTitle}>Passenger Details</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={[styles.textInput, errors.passengerName && styles.inputError]}
              placeholder="Enter passenger name"
              placeholderTextColor={GRAY_TEXT}
              value={passengerName}
              onChangeText={setPassengerName}
            />
            {errors.passengerName && <Text style={styles.errorText}>{errors.passengerName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={[styles.textInput, errors.phoneNumber && styles.inputError]}
              placeholder="Enter phone number"
              placeholderTextColor={GRAY_TEXT}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
          </View>
        </View>

        {/* Price Breakdown Card */}
        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price per Seat</Text>
            <Text style={styles.priceValue}>Rs:{bookingDetails.pricePerSeat}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Number of Seats</Text>
            <Text style={styles.priceValue}>x {bookingDetails.totalSeats}</Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>Rs:{bookingDetails.totalPayment}</Text>
          </View>
        </View>

        {/* Payment Details Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="credit-card" size={20} color={GREEN_PRIMARY} />
            <Text style={styles.sectionTitle}>Payment Details</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Holder Name</Text>
            <TextInput
              style={[styles.textInput, errors.cardHolderName && styles.inputError]}
              placeholder="Name on card"
              placeholderTextColor={GRAY_TEXT}
              value={cardHolderName}
              onChangeText={setCardHolderName}
            />
            {errors.cardHolderName && <Text style={styles.errorText}>{errors.cardHolderName}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={[styles.textInput, errors.cardNumber && styles.inputError]}
              placeholder="xxxx xxxx xxxx xxxx"
              placeholderTextColor={GRAY_TEXT}
              keyboardType="number-pad"
              value={cardNumber}
              onChangeText={(text) => setCardNumber(text.replace(/\s/g, ''))}
              maxLength={16}
            />
            {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
          </View>

          <View style={styles.cardDetailsRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={[styles.textInput, errors.expiryDate && styles.inputError]}
                placeholder="MM/YY"
                placeholderTextColor={GRAY_TEXT}
                keyboardType="number-pad"
                value={expiryDate}
                onChangeText={setExpiryDate}
                maxLength={5}
              />
              {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={[styles.textInput, errors.cvv && styles.inputError]}
                placeholder="xxx"
                placeholderTextColor={GRAY_TEXT}
                keyboardType="number-pad"
                value={cvv}
                onChangeText={setCvv}
                maxLength={3}
              />
              {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
            </View>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment}>
          <LinearGradient
            colors={[GREEN_PRIMARY, GREEN_SECONDARY]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.confirmButtonGradient}
          >
            <MaterialCommunityIcons name="lock-check" size={22} color={WHITE} />
            <Text style={styles.confirmButtonText}>Confirm & Pay Rs:{bookingDetails.totalPayment}</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

export default SeatDetailsScreen;
