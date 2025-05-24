import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import LinearGradient from 'react-native-linear-gradient';

const SuccessScreen = ({ navigation }) => {
  const route = useRoute();
  const { busId, fromLocation, toLocation, totalPayment, paymentTimestamp } = route.params;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  const handleSaveReceipt = () => {
  Alert.alert(
    "Confirm Save",
    "Do you want to save the receipt and go to Home screen?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Yes",
        onPress: () => {
          navigation.navigate('Receipt', {
            busId,
            fromLocation,
            toLocation,
            totalPayment,
            paymentTimestamp,
            username,
            email,
          });
        }
      }
    ],
    { cancelable: true }
  );
};

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = auth().currentUser;
        //console.log('User ID:', user?.uid);

        if (user?.uid) {
          const snapshot = await database().ref(`/passenger/${user.uid}`).once('value');
          const data = snapshot.val();

          //console.log('Fetched data:', data);

          if (data) {
            setUsername(data.username || 'N/A');
            setEmail(data.email || 'N/A');
          }
        }
      } catch (error) {
        //console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const qrValue = JSON.stringify({
    busId,
    fromLocation,
    toLocation,
    totalPayment,
    paymentTimestamp,
    username,
    email,
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#28a745" />
        <Text style={{ marginTop: 10 }}>Loading receipt...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['white','white', 'green']} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🧾 Payment Receipt</Text>

        <Text style={styles.label}> Passenger Name: <Text style={styles.value}>{username}</Text></Text>
        <Text style={styles.label}> Email: <Text style={styles.value}>{email}</Text></Text>
        <Text style={styles.label}> Bus ID: <Text style={styles.value}>{busId}</Text></Text>
        <Text style={styles.label}> From: <Text style={styles.value}>{fromLocation}</Text></Text>
        <Text style={styles.label}> To: <Text style={styles.value}>{toLocation}</Text></Text>
        <Text style={styles.label}> Paid: <Text style={styles.value}>LKR {totalPayment}</Text></Text>
        <Text style={styles.label}> Date: <Text style={styles.value}>{new Date(paymentTimestamp).toLocaleString()}</Text></Text>

        <View style={styles.qrContainer}>
          <Text style={styles.qrText}>🔲 Scan QR for Receipt</Text>
          <QRCode value={qrValue} size={200} />
        </View>

      <Pressable style={styles.okButton} onPress={handleSaveReceipt}>
  <Text style={styles.okButtonText}>SAVE RECEIPT</Text>
</Pressable>

      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  card: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
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
    marginTop: 25,
    alignItems: 'center',
  },
  qrText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
  okButton: {
    marginTop: 30,
    backgroundColor: 'black',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  okButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default SuccessScreen;
