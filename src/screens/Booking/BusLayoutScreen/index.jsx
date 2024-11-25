import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

const BusLayoutScreen = () => {
  const navigation = useNavigation();

  const SeatDetails = () => {
    navigation.navigate('Seat Details');
  };

  const arrowBusDetails = () => {
    navigation.navigate('Bus Details');
  };

  const [selectedSeats, setSelectedSeats] = useState([]);

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

  const toggleSeatSelection = (seat) => {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seat)
        ? prevSelectedSeats.filter((s) => s !== seat)
        : [...prevSelectedSeats, seat]
    );
  };

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
        <TouchableOpacity style={styles.backArrowContainer} onPress={arrowBusDetails}>
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
       <Text style={styles.box1}/>
        <Text style={styles.available}>available</Text>
        <Text style={styles.box2}/>
        <Text style={styles.available}>unavailable</Text>
        </View>
        <TouchableOpacity style={styles.continueButton} onPress={SeatDetails}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
    </View>
  );
};

export default BusLayoutScreen;
