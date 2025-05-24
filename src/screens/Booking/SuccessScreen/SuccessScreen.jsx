import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';

const SuccessScreen = () => {
  const route = useRoute();
  const { busId, fromLocation, toLocation, totalPayment, paymentTimestamp } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧾 Payment Receipt</Text>
      <Text style={styles.label}>Bus ID: <Text style={styles.value}>{busId}</Text></Text>
      <Text style={styles.label}>From: <Text style={styles.value}>{fromLocation}</Text></Text>
      <Text style={styles.label}>To: <Text style={styles.value}>{toLocation}</Text></Text>
      <Text style={styles.label}>Amount Paid: <Text style={styles.value}>LKR {totalPayment}</Text></Text>
      <Text style={styles.label}>Date: <Text style={styles.value}>{new Date(paymentTimestamp).toLocaleString()}</Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  value: {
    fontWeight: 'bold',
  },
});

export default SuccessScreen;
