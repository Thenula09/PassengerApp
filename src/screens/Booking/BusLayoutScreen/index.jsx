import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import database from '@react-native-firebase/database';

// Color constants for consistency
const GREEN_PRIMARY = '#2E7D32';
const GREEN_SECONDARY = '#43A047';
const WHITE = '#fff';

const BusLayoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { 
    busId,
    busNumber,
    busName,
    departureTime,
    arrivalTime,
    price,
    availableSeats,
    totalSeats,
    isAC,
    busType,
    startLocation,
    endLocation
  } = route.params;

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatData, setSeatData] = useState({});

  // Fetch seat data from Firebase when the component mounts
  useEffect(() => {
    if (!busId) {
      console.log('Bus ID not available');
      return;
    }

    const seatRef = database().ref(`/buses/${busId}/seats`);

    // Listen for seat data updates
    seatRef.on('value', (snapshot) => {
      const liveData = snapshot.val();
      setSeatData(liveData || {}); // Add fallback for real-time updates
    });

    // Cleanup the real-time listener on component unmount
    return () => seatRef.off('value');
  }, [busId]);

  // Handle seat selection
  const toggleSeatSelection = (seat) => {
    if (seatData[seat] === 'booked') {
      Alert.alert('Seat Unavailable', 'This seat is already booked!');
      return;
    }

    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seat)
        ? prevSelectedSeats.filter((s) => s !== seat)
        : [...prevSelectedSeats, seat]
    );
  };

  // Confirm seat selection and update Firebase
  const confirmSeatSelection = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('No Seats Selected', 'Please select at least one seat.');
      return;
    }

    // Update the seats to "booked" under `/buses/{busId}/seats`
    const updates = {};
    selectedSeats.forEach((seat) => {
      updates[`/buses/${busId}/seats/${seat}`] = 'booked';
    });

    // Save the booked seats under a `bookedSeats` node with the busId
    const bookedSeatsRef = database().ref(`/bookedSeats/${busId}`);
    const newBookings = selectedSeats.reduce((acc, seat) => {
      acc[seat] = 'booked';
      return acc;
    }, {});

    // Perform the updates
    database()
      .ref()
      .update(updates)
      .then(() => {
        return bookedSeatsRef.update(newBookings);
      })
      .then(() => {
        Alert.alert('Success', 'Seats booked successfully!');
        navigation.navigate('SeatDetailsScreen', {
          selectedSeats: selectedSeats,
          busId: busId,
          busNumber: busNumber,
          busName: busName,
          departureTime: departureTime,
          arrivalTime: arrivalTime,
          price: price,
          startLocation: startLocation,
          endLocation: endLocation,
          totalSeats: totalSeats,
          isAC: isAC,
          busType: busType,
        });
      })
      .catch((error) => {
        Alert.alert('Error', `Failed to book seats: ${error.message}`);
      });
  };

  // Render a single seat
  const renderSeat = (seat, rowIndex, seatIndex) => (
    <TouchableOpacity
      key={`${rowIndex}-${seatIndex}`}
      style={[
        styles.seat,
        seatData[seat] === 'booked' ? styles.unavailableSeat : styles.availableSeat,
        selectedSeats.includes(seat) && seatData[seat] !== 'booked' && styles.selectedSeat,
      ]}
      disabled={seatData[seat] === 'booked'}
      onPress={() => toggleSeatSelection(seat)}
    >
      <Text style={[
        styles.seatText,
        selectedSeats.includes(seat) && seatData[seat] !== 'booked' && { color: WHITE }
      ]}>
        {seat}
      </Text>
    </TouchableOpacity>
  );

  // Seat layout with bus rows
  const seatLayout = [
    ['1', '2', '', '3', '4'],
    ['5', '6', '', '7', '8'],
    ['9', '10', '', '11', '12'],
    ['13', '14', '', '15', '16'],
    ['17', '18', '', '19', '20'],
    ['21', '22', '', '23', '24'],
    ['25', '26', '', '27', '28'],
    ['29', '30', '', '31', '32'],
    ['33', '34', '', '35', '36'],
    ['37', '38', '', '39', '40'],
    ['41', '42', '43', '44', '45'],
  ];

  // Bus info
  const busInfo = {
    name: busName || 'Deluxe Coach',
    number: busNumber || 'BUS-001',
    totalSeats: totalSeats || 45,
    bookedSeats: Object.values(seatData).filter(s => s === 'booked').length,
    departureTime: departureTime || '10:00 AM',
    arrivalTime: arrivalTime || '2:00 PM',
    price: price || '2500',
    isAC: isAC !== undefined ? isAC : true,
    busType: busType || 'Standard',
    startLocation: startLocation || 'Matara',
    endLocation: endLocation || 'Colombo',
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerSection}>
        <View style={styles.head}>
          <TouchableOpacity style={styles.backArrowContainer} onPress={() => navigation.goBack()}>
            <Ionicons name={'arrow-back-outline'} color={GREEN_PRIMARY} size={28} />
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Select Your Seat</Text>
            <Text style={styles.subtitle}>Choose your preferred seat for a comfortable journey</Text>
          </View>
        </View>
      </View>

      <View style={styles.busInfoCard}>
        <View style={styles.busInfoContent}>
          <View style={{ flex: 1 }}>
            <Text style={styles.busName}>{busInfo.name}</Text>
            <Text style={styles.busDetails}>{busInfo.number} • {busInfo.busType}</Text>
            <Text style={styles.busDetails}>{busInfo.totalSeats} Total Seats • {busInfo.bookedSeats} Booked</Text>
            
            {/* Route Information */}
            <View style={styles.routeInfo}>
              <Text style={styles.routeText}>{busInfo.startLocation}</Text>
              <Text style={styles.routeArrow}>→</Text>
              <Text style={styles.routeText}>{busInfo.endLocation}</Text>
            </View>
            
            {/* Detailed Bus Information Grid */}
            <View style={styles.busDetailGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Departure</Text>
                <Text style={styles.detailValue}>{busInfo.departureTime}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Arrival</Text>
                <Text style={styles.detailValue}>{busInfo.arrivalTime}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Price</Text>
                <Text style={styles.detailValue}>Rs {busInfo.price}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Type</Text>
                <Text style={styles.detailValue}>{busInfo.isAC ? 'AC' : 'Non-AC'}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.seatsAvailableBadge}>
            <Text style={styles.seatsAvailableText}>{busInfo.totalSeats - busInfo.bookedSeats}</Text>
            <Text style={styles.seatsAvailableLabel}>Available</Text>
          </View>
        </View>
      </View>

    
      <View style={styles.seatLayout}>
        <View style={styles.seatLayoutHeader}>
          <Ionicons name="car-outline" color={GREEN_PRIMARY} size={20} />
          <Text style={styles.seatLayoutTitle}>Bus Interior Layout</Text>
        </View>
        {seatLayout.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((seat, seatIndex) =>
              seat !== '' ? renderSeat(seat, rowIndex, seatIndex) : <View key={seatIndex} style={styles.spacer} />
            )}
          </View>
        ))}
        <View style={styles.directionIndicator}>
          <View style={styles.directionArrow}>
            <Ionicons name="arrow-up-outline" color={WHITE} size={18} />
          </View>
          <Text style={styles.directionText}>Front of Bus</Text>
        </View>
      </View>

      <View style={styles.legendSection}>
        <View style={styles.legendItem}>
          <View style={styles.legendBox1} />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendBox2} />
          <Text style={styles.legendText}>Unavailable</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendBox3} />
          <Text style={styles.legendText}>Selected</Text>
        </View>
      </View>

      {selectedSeats.length > 0 && (
        <View style={styles.selectedSeatsCard}>
          <Text style={styles.selectedSeatsTitle}>Selected Seats</Text>
          <View style={styles.selectedSeatsList}>
            {selectedSeats.map((seat) => (
              <View key={seat} style={styles.selectedSeatBadge}>
                <Text style={styles.selectedSeatText}>{seat}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.continueButton, selectedSeats.length === 0 && styles.disabledButton]} 
        onPress={confirmSeatSelection}
        disabled={selectedSeats.length === 0}
      >
        <Text style={styles.continueText}>
          {selectedSeats.length === 0 ? 'Select Seats' : `Confirm ${selectedSeats.length} Seat${selectedSeats.length > 1 ? 's' : ''}`}
        </Text>
        <Ionicons name="arrow-forward-outline" color={WHITE} size={22} style={styles.buttonIcon} />
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BusLayoutScreen;
