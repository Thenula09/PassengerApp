import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BusLayoutScreen = () => {
  // State to keep track of selected seats
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Define seat arrangement (3-column layout with the last row containing five seats)
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
    ['37', '38', '', '39', '49'],
    // Last row with five seats
    ['41', '42', '43', '44', '45']
  ];

  // Toggle seat selection
  const toggleSeatSelection = (seat) => {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seat)
        ? prevSelectedSeats.filter((s) => s !== seat)
        : [...prevSelectedSeats, seat]
    );
  };

  // Render a single seat with selection highlight
  const renderSeat = (seat) => (
    <TouchableOpacity
      key={seat}
      style={[
        styles.seat,
        selectedSeats.includes(seat) ? styles.selectedSeat : styles.availableSeat,
      ]}
      onPress={() => toggleSeatSelection(seat)}
    >
      <Text style={styles.seatText}>{seat}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <TouchableOpacity style={styles.backArrowContainer}>
          <Ionicons name={'arrow-back-outline'} color={'black'} size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Select Your Seat</Text>
      </View>
      <View style={styles.seatLayout}>
        {seatLayout.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((seat, seatIndex) =>
              seat !== '' ? renderSeat(seat) : <View key={seatIndex} style={styles.spacer} />
            )}
          </View>
        ))}
      </View>
      <View style={styles.seatAvailable}>
       <Text style={styles.rectangle}/>
        <Text style={styles.available}>Available seat</Text>
        </View>
        <TouchableOpacity style={styles.continueButton}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
    </View>
  );
};

export default BusLayoutScreen;
