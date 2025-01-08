import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';

const BusLayoutScreen = () => {
  const navigation = useNavigation();

  const [busId, setBusId] = useState('A123'); // Default bus ID
  const [seatData, setSeatData] = useState({}); // Firebase seat data
  const [selectedSeats, setSelectedSeats] = useState([]); // Locally selected seats

  // Firebase seat layout fetch + real-time updates
  useEffect(() => {
    const fetchSeatData = async () => {
      const seatRef = database().ref(`/buses/${busId}/seats`);

      // Fetch seats once
      const snapshot = await seatRef.once('value');
      const data = snapshot.val();
      setSeatData(data || {}); // Add fallback for null values

      // Real-time listener
      seatRef.on('value', (snapshot) => {
        const liveData = snapshot.val();
        setSeatData(liveData || {}); // Add fallback for real-time updates
      });

      return () => seatRef.off('value'); // Cleanup listener
    };

    fetchSeatData();
  }, [busId]);

  // Navigate to seat details screen
  const goToSeatDetails = () => {
    navigation.navigate('Seat Details', { selectedSeats });
  };

  // Navigate back to bus list
  const goBackToBusList = () => {
    navigation.navigate('Destination Search');
  };

  // Handle seat selection and deselection
  const toggleSeatSelection = async (seat) => {
    if (seatData[seat] === 'booked') {
      Alert.alert('Seat Unavailable', 'This seat is already booked!');
    } else {
      // Check if the seat is already selected
      const updatedSeats = selectedSeats.includes(seat)
        ? selectedSeats.filter((s) => s !== seat) // Deselect if it's already selected
        : [...selectedSeats, seat]; // Select if it's not already selected

      setSelectedSeats(updatedSeats);
    }
  };

  // Confirm selection and send to database
  const confirmSeatSelection = async () => {
    if (selectedSeats.length === 0) {
      Alert.alert('No Seats Selected', 'Please select at least one seat.');
      return;
    }

    // Update selected seats in Firebase
    selectedSeats.forEach(async (seat) => {
      await database().ref(`/buses/${busId}/seats/${seat}`).set('booked');
    });

    Alert.alert('Seats Confirmed', 'Your seats have been successfully booked.');

    // Navigate to the seat details page
    navigation.navigate('Seat Details', { selectedSeats });
  };

  // Render a single seat
  const renderSeat = (seat, rowIndex, seatIndex) => (
    <TouchableOpacity
      key={`${rowIndex}-${seatIndex}`} // Unique key using both rowIndex and seatIndex
      style={[
        styles.seat,
        seatData[seat] === 'booked' ? styles.unavailableSeat : styles.availableSeat,
        selectedSeats.includes(seat) && seatData[seat] !== 'booked' && styles.selectedSeat,
      ]}
      disabled={seatData[seat] === 'booked'} // Disable booked seats
      onPress={() => toggleSeatSelection(seat)}
    >
      <Text style={styles.seatText}>{seat}</Text>
    </TouchableOpacity>
  );

  // Bus seat layout structure
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
    ['41', '42', '43', '44', '45'], // Last row
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.head}>
        <TouchableOpacity style={styles.backArrowContainer} onPress={goBackToBusList}>
          <Ionicons name={'arrow-back-outline'} color={'black'} size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Select Your Seat</Text>
      </View>

      {/* Seat Layout */}
      <View style={styles.seatLayout}>
        {seatLayout.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((seat, seatIndex) =>
              seat !== '' ? renderSeat(seat, rowIndex, seatIndex) : <View key={seatIndex} style={styles.spacer} />
            )}
          </View>
        ))}
      </View>

      {/* Seat Info */}
      <View style={styles.seatAvailable}>
        <Text style={styles.box1} />
        <Text style={styles.available}>Available</Text>
        <Text style={styles.box2} />
        <Text style={styles.unavailable}>Unavailable</Text>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.continueButton} onPress={confirmSeatSelection}>
        <Text style={styles.continueText}>Confirm Selection</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BusLayoutScreen;
