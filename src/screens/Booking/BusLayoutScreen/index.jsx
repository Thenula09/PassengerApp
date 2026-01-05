import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Text, Alert, ScrollView, Animated, Easing } from 'react-native';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../../components/Header';
import database from '@react-native-firebase/database';
import LinearGradient from 'react-native-linear-gradient';

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
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const busCardScale = useRef(new Animated.Value(0.9)).current;
  const seatAnimations = useRef({}).current;
  
  // Initialize seat animations
  const getSeatAnimation = (seat) => {
    if (!seatAnimations[seat]) {
      seatAnimations[seat] = {
        scale: new Animated.Value(1),
        bounce: new Animated.Value(0),
      };
    }
    return seatAnimations[seat];
  };

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.spring(busCardScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

  // Handle seat selection with animation
  const toggleSeatSelection = (seat) => {
    if (seatData[seat] === 'booked') {
      Alert.alert('Seat Unavailable', 'This seat is already booked!');
      return;
    }

    const anim = getSeatAnimation(seat);
    
    // Bounce animation on selection
    Animated.sequence([
      Animated.timing(anim.scale, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(anim.scale, {
        toValue: 1,
        friction: 3,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seat)
        ? prevSelectedSeats.filter((s) => s !== seat)
        : [...prevSelectedSeats, seat]
    );
  };

  // Confirm seat selection - Navigate to payment screen (seats will be booked after payment)
  const confirmSeatSelection = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('No Seats Selected', 'Please select at least one seat.');
      return;
    }

    // Navigate to SeatDetailsScreen for payment
    // Seats will be marked as "booked" only after successful payment
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
  };

  // Render a single seat with animation
  const renderSeat = (seat, rowIndex, seatIndex) => {
    const anim = getSeatAnimation(seat);
    const isBooked = seatData[seat] === 'booked';
    const isSelected = selectedSeats.includes(seat) && !isBooked;
    
    // Calculate staggered animation delay
    const delay = (rowIndex * 5 + seatIndex) * 30;
    
    return (
      <Animated.View
        key={`${rowIndex}-${seatIndex}`}
        style={{
          transform: [{ scale: anim.scale }],
        }}
      >
        <TouchableOpacity
          style={[
            styles.seat,
            isBooked ? styles.unavailableSeat : styles.availableSeat,
            isSelected && styles.selectedSeat,
          ]}
          disabled={isBooked}
          onPress={() => toggleSeatSelection(seat)}
          activeOpacity={0.7}
        >
          {isSelected ? (
            <View style={styles.seatIconContainer}>
              <MaterialCommunityIcons name="check" size={18} color={WHITE} />
            </View>
          ) : isBooked ? (
            <View style={styles.seatIconContainer}>
              <MaterialCommunityIcons name="close" size={14} color="#999" />
            </View>
          ) : (
            <MaterialCommunityIcons name="seat" size={20} color={GREEN_PRIMARY} />
          )}
          <Text style={[
            styles.seatText,
            isSelected && { color: WHITE },
            isBooked && { color: '#999' }
          ]}>
            {seat}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

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
    <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      <Header 
        title="Select Your Seat" 
        subtitle="Choose your preferred seat for a comfortable journey"
        showBackButton={true}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Animated Bus Info Card */}
      <Animated.View style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: busCardScale }
        ]
      }}>
        <View style={styles.busInfoCard}>
          <LinearGradient
            colors={['#1B5E20', '#2E7D32']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.busInfoGradient}
          >
            {/* Bus Number */}
            <View style={styles.busNumberRow}>
              <MaterialCommunityIcons name="bus" size={28} color={WHITE} />
              <Text style={styles.busNumber}>{busInfo.number}</Text>
            </View>
            
            {/* Route */}
            <View style={styles.routeContainer}>
              <View style={styles.routeLocationBox}>
                <View style={styles.routeDotStart} />
                <Text style={styles.routeLocationText}>{busInfo.startLocation}</Text>
              </View>
              <View style={styles.routeArrowContainer}>
                <View style={styles.routeDottedLine} />
                <MaterialCommunityIcons name="arrow-right" size={20} color="rgba(255,255,255,0.7)" />
                <View style={styles.routeDottedLine} />
              </View>
              <View style={styles.routeLocationBox}>
                <View style={styles.routeDotEnd} />
                <Text style={styles.routeLocationText}>{busInfo.endLocation}</Text>
              </View>
            </View>
            
            {/* Seat Stats */}
            <View style={styles.seatStatsRow}>
              <View style={styles.seatStatBox}>
                <MaterialCommunityIcons name="seat" size={22} color="#4CAF50" />
                <Text style={styles.seatStatNumber}>{busInfo.totalSeats - busInfo.bookedSeats}</Text>
                <Text style={styles.seatStatLabel}>Available</Text>
              </View>
              <View style={styles.seatStatDivider} />
              <View style={styles.seatStatBox}>
                <MaterialCommunityIcons name="seat-outline" size={22} color="#FF5722" />
                <Text style={styles.seatStatNumber}>{busInfo.bookedSeats}</Text>
                <Text style={styles.seatStatLabel}>Booked</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </Animated.View>

      {/* Animated Seat Layout */}
      <Animated.View style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }}>
        <View style={styles.seatLayout}>
          <View style={styles.seatLayoutHeader}>
            <View style={styles.steeringIcon}>
              <MaterialCommunityIcons name="steering" size={24} color={WHITE} />
            </View>
            <Text style={styles.seatLayoutTitle}>Select Your Seats</Text>
          </View>
        
          
          {seatLayout.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((seat, seatIndex) =>
                seat !== '' ? renderSeat(seat, rowIndex, seatIndex) : <View key={seatIndex} style={styles.spacer} />
              )}
            </View>
          ))}
      
        </View>
      </Animated.View>

      {/* Legend Section */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.legendSection}>
          <View style={styles.legendItem}>
            <View style={styles.legendBox1}>
              <MaterialCommunityIcons name="seat" size={16} color={GREEN_PRIMARY} />
            </View>
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.legendBox2}>
              <MaterialCommunityIcons name="close" size={14} color="#999" />
            </View>
            <Text style={styles.legendText}>Booked</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.legendBox3}>
              <MaterialCommunityIcons name="check" size={14} color={WHITE} />
            </View>
            <Text style={styles.legendText}>Selected</Text>
          </View>
        </View>
      </Animated.View>

      {selectedSeats.length > 0 && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.selectedSeatsCard}>
            <View style={styles.selectedSeatsHeader}>
              <MaterialCommunityIcons name="ticket-confirmation" size={22} color={GREEN_PRIMARY} />
              <Text style={styles.selectedSeatsTitle}>Your Selection</Text>
            </View>
            <View style={styles.selectedSeatsList}>
              {selectedSeats.map((seat, index) => (
                <Animated.View 
                  key={seat} 
                  style={[
                    styles.selectedSeatBadge,
                    { transform: [{ scale: getSeatAnimation(seat).scale }] }
                  ]}
                >
                  <MaterialCommunityIcons name="seat" size={14} color={WHITE} />
                  <Text style={styles.selectedSeatText}>{seat}</Text>
                </Animated.View>
              ))}
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>Rs {selectedSeats.length * busInfo.price}</Text>
            </View>
          </View>
        </Animated.View>
      )}

      <TouchableOpacity 
        style={[styles.continueButton, selectedSeats.length === 0 && styles.disabledButton]} 
        onPress={confirmSeatSelection}
        disabled={selectedSeats.length === 0}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={selectedSeats.length === 0 ? ['#ccc', '#bbb'] : ['#2E7D32', '#43A047']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.continueGradient}
        >
          <Text style={styles.continueText}>
            {selectedSeats.length === 0 ? 'Select Seats to Continue' : `Continue with ${selectedSeats.length} Seat${selectedSeats.length > 1 ? 's' : ''}`}
          </Text>
          <View style={styles.continueIconContainer}>
            <Ionicons name="arrow-forward" color={WHITE} size={20} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
      
      <View style={{ height: 30 }} />
    </ScrollView>
    </View>
  );
};

export default BusLayoutScreen;
