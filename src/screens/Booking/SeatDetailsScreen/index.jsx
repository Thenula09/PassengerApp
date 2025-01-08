import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

const SeatDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();  // Accessing passed parameters from navigation

  // Get the selected seats from the route params
  const { selectedSeats } = route.params || [];

  const [isValid, setIsValid] = useState(true);

  // Email validation
  const [email, setEmail] = useState('');
  const validateEmail = (text) => {
    setEmail(text);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailPattern.test(text));
  };

  // Phone number validation
  const [phoneNumber, setPhoneNumber] = useState('');
  const validatePhoneNumber = (text) => {
    setPhoneNumber(text);

    if (text.length === 10 && /^[0-9]+$/.test(text)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };

  // Navigate back to Bus Layout screen
  const arrowBusLayout = () => {
    navigation.navigate('Bus Layout');
  };

  const gotoPayment = () => {
    navigation.navigate('Payment');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.head}>
        <TouchableOpacity style={styles.backArrowContainer} onPress={arrowBusLayout}>
          <Ionicons name={'arrow-back-outline'} color={'black'} size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Seat Details</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.text}>Where from</Text>
        <TextInput style={styles.textInput} editable={false}>Matara Bus Stand</TextInput>

        <Text style={styles.text}>Where to</Text>
        <TextInput style={styles.textInput} editable={false} />

        <Text style={styles.text}>Seats</Text>
        <TextInput
          style={styles.textInput}
          editable={false}
          value={selectedSeats ? selectedSeats.join(', ') : ''}  // Displaying selected seats
        />

        <Text style={styles.text}>Total</Text>
        <TextInput style={styles.textInput} editable={false} />

        <Text style={styles.text}>Passenger name</Text>
        <TextInput style={styles.textInput} placeholder="Enter passenger name" placeholderTextColor={'lightgray'} />

        <Text style={styles.text}>Mobile number</Text>
        <TextInput
          style={[styles.textInput, !isValid && styles.errorInput]}
          placeholder="07x xxx xxxx"
          placeholderTextColor={'lightgray'}
          keyboardType={'number-pad'}
          value={phoneNumber}
          onChangeText={validatePhoneNumber}
          maxLength={10}
        />
        {!isValid && phoneNumber.length > 0 && (
          <Text style={styles.errorText}>Mobile number must be exactly 10 digits</Text>
        )}

        <Text style={styles.text}>Email</Text>
        <TextInput
          style={[styles.textInput, !isValid && styles.errorInput]}
          placeholder="user@domain.com"
          placeholderTextColor={'lightgray'}
          value={email}
          onChangeText={validateEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {!isValid && email.length > 0 && (
          <Text style={styles.errorText}>Invalid email format</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={gotoPayment}>
          <Text style={styles.buttonText}>Continue to pay</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SeatDetailsScreen;
