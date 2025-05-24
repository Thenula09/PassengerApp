import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Home');

  const goToUserProfile = () => {
    setActiveTab('Profile');
    navigation.navigate('Profile');
  };

  const goToBooking = () => {
    setActiveTab('Booking');
    navigation.navigate('Receipt');
  };

  const goToBusDetails = () => {
    setActiveTab('BusDetails');
    navigation.navigate('Bus Details');
  };

  const gotoSearch = () => {
    navigation.navigate('Destination Search');
  };

  return (
    <LinearGradient colors={['white', 'white', 'white', 'green']} style={styles.container}>
      <View style={styles.container}>
        {/* Map Section */}
        <View style={styles.homeMap}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            showsUserLocation={true}
            region={{
              latitude: 5.9431,
              longitude: 80.5490,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
          />
        </View>

        {/* Message Section */}
        <View style={styles.message}>
          <Text style={styles.title}>Travel with Highway bus</Text>
          <Text style={styles.field}>
            Travel smart with our highway buses. Book your seat in advance, arrive on time, and enjoy a safe, comfortable journey. Your safety and comfort are our top priority.
          </Text>
          <TouchableOpacity>
            <View style={styles.learnContainer}>
              <Text style={styles.learnMore}>Learn more</Text>
              <AntDesign name={'arrowright'} size={20} color={'white'} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Box */}
        <Pressable style={styles.inputBox} onPress={gotoSearch}>
          <Text style={styles.inputText}>Where To?</Text>
        </Pressable>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity
            style={[styles.navButton, activeTab === 'Profile' && styles.activeTab]}
            onPress={goToUserProfile}>
            <FontAwesome5 name="user" size={22} color="white" />
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, activeTab === 'Booking' && styles.activeTab]}
            onPress={goToBooking}>
            <AntDesign name="calendar" size={22} color="white" />
            <Text style={styles.navText}>Booking</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, activeTab === 'BusDetails' && styles.activeTab]}
            onPress={goToBusDetails}>
            <Ionicons name="bus-outline" size={22} color="white" />
            <Text style={styles.navText}>Bus Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default HomeScreen;
