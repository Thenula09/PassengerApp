import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import styles from './styles'; // Ensure you have the correct styles
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import LinearGradient from 'react-native-linear-gradient';

const BusLayoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { busId } = route.params; // Get busId from route parameters

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
          selectedSeats: selectedSeats, // Pass selected seats to the next screen
          busId: busId, // Pass busId as well
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
      <Text style={styles.seatText}>{seat}</Text>
    </TouchableOpacity>
  );

  // Seat layout (adjust this as needed for your bus layout)
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

  return (
    <LinearGradient
      colors={['white', 'white','green']}
      style={styles.container}
    >
    <View style={styles.container}>
      <View style={styles.head}>
        <TouchableOpacity style={styles.backArrowContainer} onPress={() => navigation.goBack()}>
          <Ionicons name={'arrow-back-outline'} color={'black'} size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Select your seat</Text>
      </View>

      <View style={styles.busInfoContainer}>
        {busId ? (
         <Text style={[styles.busIdText, { display: 'none' }]}>
  Bus ID: {busId}
</Text>

        ) : (
          <Text style={styles.busIdText}>Bus ID not available</Text>
        )}
      </View>

      <View style={styles.seatLayout}>
        {seatLayout.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((seat, seatIndex) =>
              seat !== '' ? renderSeat(seat, rowIndex, seatIndex) : <View key={seatIndex} style={styles.spacer} />
            )}
          </View>
        ))}
      </View>

      <View style={styles.seatAvailable}>
        <Text style={styles.box1} />
        <Text style={styles.available}>Available</Text>
        <Text style={styles.box2} />
        <Text style={styles.unavailable}>Unavailable</Text>
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={confirmSeatSelection}>
        <Text style={styles.continueText}>Confirm Selection</Text>
      </TouchableOpacity>
    </View>
    </LinearGradient>
  );
};

export default BusLayoutScreen;
