import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import LinearGradient from 'react-native-linear-gradient';

const SeatDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Get busId from route.params
  const busId = route.params?.busId; // `busId` එක Bus Layout එකෙන් pass වෙන්න ඕනේ

  // Dummy data for testing
  const totalPayment = 1000; // Replace with dynamic total payment value
  const fromLocation = 'Matara Bus Stand';
  const toLocation = 'Colombo';

  // State and validation logic
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    let newErrors = {};
    if (!cardHolderName) newErrors.cardHolderName = 'Required';
    if (!cardNumber) newErrors.cardNumber = 'Required';
    if (!expiryDate) newErrors.expiryDate = 'Required';
    if (!cvv) newErrors.cvv = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayPress = () => {
    if (validateFields()) {
      if (!busId) {
        Alert.alert('Error', 'Bus ID not found!');
        return;
      }

      // Save only necessary details to Firebase (excluding cardHolderName, fromLocation, and toLocation)
      const paymentDetails = {
        busId: busId,
        total: `LKR ${totalPayment}`,
        paymentTimestamp: new Date().toISOString(),
      };

      database()
        .ref(`/payments/${busId}`)
        .push(paymentDetails)
        .then(() => {
          Alert.alert('Payment Successful', 'Your payment has been processed successfully!', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('SuccessScreen'),
            },
          ]);
        })
        .catch((error) => {
          Alert.alert('Error', `Failed to process payment: ${error.message}`);
        });
    }
  };

  return (
     <LinearGradient
      colors={['white', 'white','green']}
      style={styles.container}
    >
    <ScrollView style={styles.container}>
      <View style={styles.head}>
        <TouchableOpacity style={styles.backArrowContainer} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" color="black" size={30} />
        </TouchableOpacity>
        <Text style={styles.title}>Payment</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.text}>Where from</Text>
        <TextInput style={styles.textInput} editable={false} value={fromLocation} />

        <Text style={styles.text}>Where to</Text>
        <TextInput style={styles.textInput} editable={false} value={toLocation} />

        <Text style={styles.text}>Total</Text>
        <TextInput style={styles.textInput} editable={false} value={`LKR ${totalPayment}`} />

        <View style={styles.fieldContainer}>
          {errors.cardHolderName && <Text style={styles.errorText}>{errors.cardHolderName}</Text>}
          <Text style={styles.text}>Card holder name</Text>
          <TextInput
            style={[styles.textInput, errors.cardHolderName ? styles.errorBorder : null]}
            placeholder="Card holder name"
            placeholderTextColor="lightgray"
            value={cardHolderName}
            onChangeText={setCardHolderName}
          />
        </View>

        <View style={styles.fieldContainer}>
          {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
          <Text style={styles.text}>Card number</Text>
          <TextInput
            style={[styles.textInput, errors.cardNumber ? styles.errorBorder : null]}
            placeholder="xxxx xxxx xxxx xxxx"
            placeholderTextColor="lightgray"
            keyboardType="number-pad"
            value={cardNumber}
            onChangeText={setCardNumber}
            maxLength={19}
          />
        </View>

        <View style={styles.fieldContainer}>
          {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}
          <Text style={styles.text}>Expiry date</Text>
          <TextInput
            style={[styles.textInput, errors.expiryDate ? styles.errorBorder : null]}
            placeholder="MM/YY"
            placeholderTextColor="lightgray"
            keyboardType="number-pad"
            value={expiryDate}
            onChangeText={setExpiryDate}
            maxLength={5}
          />
        </View>

        <View style={styles.fieldContainer}>
          {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
          <Text style={styles.text}>CVV</Text>
          <TextInput
            style={[styles.textInput, errors.cvv ? styles.errorBorder : null]}
            placeholder="xxx"
            placeholderTextColor="lightgray"
            keyboardType="number-pad"
            value={cvv}
            onChangeText={setCvv}
            maxLength={3}
          />
        </View>

        <TouchableOpacity style={styles.payButton} onPress={handlePayPress}>
          <Text style={styles.pay}>Pay</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </LinearGradient>
  );
};

export default SeatDetailsScreen;
