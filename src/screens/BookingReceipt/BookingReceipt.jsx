import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BookingReceipt = () => {
  const route = useRoute();
  const {
    busId,
    fromLocation,
    toLocation,
    totalPayment,
    paymentTimestamp,
    username,
    email,
  } = route.params;

  const qrValue = JSON.stringify({
    busId,
    fromLocation,
    toLocation,
    totalPayment,
    paymentTimestamp,
    username,
    email,
  });

   const navigation = useNavigation();
    const arrowLogin = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backArrowContainer} onPress={arrowLogin}>
        <Ionicons name={'arrow-back-outline'} color={'black'} size={30} />
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.title}>🧾 Saved Receipt</Text>

        <Text style={styles.label}>Passenger Name: <Text style={styles.value}>{username}</Text></Text>
        <Text style={styles.label}>Email: <Text style={styles.value}>{email}</Text></Text>
        <Text style={styles.label}>Bus ID: <Text style={styles.value}>{busId}</Text></Text>
        <Text style={styles.label}>From: <Text style={styles.value}>{fromLocation}</Text></Text>
        <Text style={styles.label}>To: <Text style={styles.value}>{toLocation}</Text></Text>
        <Text style={styles.label}>Paid: <Text style={styles.value}>LKR {totalPayment}</Text></Text>
        <Text style={styles.label}>Date: <Text style={styles.value}>{new Date(paymentTimestamp).toLocaleString()}</Text></Text>

        <View style={styles.qrContainer}>
          <Text style={styles.qrText}>🔲 QR Code</Text>
          <QRCode value={qrValue} size={200} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    color: 'green',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  value: {
    fontWeight: '600',
    color: '#000',
  },
  qrContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  qrText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
});

export default BookingReceipt;
