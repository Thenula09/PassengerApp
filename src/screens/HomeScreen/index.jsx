import React from 'react';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import styles from './styles';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const goToUserProfile = () => {
    navigation.navigate('User Profile');
  };

  const goToBooking = () => {
    navigation.navigate('Bus Layout');
  };

  const goToBusDetails = () => {
    navigation.navigate('Bus Details');
  };

  const gotoSearch = () => {
    navigation.navigate('Destination Search');
  };

  return (
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
          Help flatten the curve. If you must travel, please exercise caution for your safety and the safety of our
          community.
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
       {/*  <View style={styles.timeContainer}>
          <AntDesign name={'clockcircle'} size={16} color={'#535353'} />
          <Text>Now</Text>
          <MaterialIcons name={'keyboard-arrow-down'} size={16} />
        </View>*/}
      </Pressable>


      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navButton} onPress={goToUserProfile}>
          <Entypo name="user" size={30} color="black" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={goToBooking}>
          <AntDesign name="calendar" size={30} color="black" />
          <Text style={styles.navText}>Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={goToBusDetails}>
          <MaterialIcons name="directions-bus" size={30} color="black" />
          <Text style={styles.navText}>Bus Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
