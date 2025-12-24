import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { View, Pressable, Text, StatusBar, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import PlaceRow from './PlaceRow';
import LinearGradient from 'react-native-linear-gradient';

const homePlace = {
  description: 'Matara Bus Stand',
  geometry: { location: { lat: 5.9431, lng: 80.5490 } },
};
const workPlace = {
  description: 'NIBM Matara',
  geometry: { location: { lat: 5.9493, lng: 80.5463 } },
};

const DestinationSearchScreen = () => {
  const [originPlace, setOriginPlace] = useState(null);
  const [destinationPlace, setDestinationPlace] = useState(null);
  const [activeTab, setActiveTab] = useState('Home');

  const navigation = useNavigation();

  useEffect(() => {
    if (originPlace && destinationPlace) {
      navigation.navigate('Bus Details', {
        originPlace,
        destinationPlace,
      });
    }
  }, [originPlace, destinationPlace, navigation]);

  const handleHome = () => {
    navigation.navigate('Home');
  };

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

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <LinearGradient
        colors={['#1B5E20', '#2E7D32', '#388E3C']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleHome}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </Pressable>
          <Text style={styles.headerTitle}>Search Destination</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="map-marker-radius" size={24} color="#4CAF50" />
          <Text style={styles.infoText}>Enter your journey details to find buses</Text>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.searchContainer}>
          <View style={styles.inputWrapper}>
            <View style={styles.iconColumn}>
              <View style={styles.originDot} />
              <View style={styles.connectLine} />
              <MaterialCommunityIcons name="map-marker" size={20} color="#D32F2F" />
            </View>

            <View style={styles.inputsColumn}>
              <GooglePlacesAutocomplete
                placeholder="Pick-up location"
                onPress={(data, details = null) => {
                  setOriginPlace({ data, details });
                }}
                fetchDetails={true}
                enablePoweredByContainer={false}
                suppressDefaultStyles
                currentLocation={true}
                currentLocationLabel="Current location"
                styles={{
                  textInput: styles.textInput,
                  container: styles.autocompleteContainer,
                  listView: styles.listView,
                  separator: styles.separator,
                }}
                query={{
                  key: 'AIzaSyBCCrqECHOid0b_QkiUT3NNrUSMGe55Wb4',
                  language: 'en',
                }}
                renderRow={(data) => <PlaceRow data={data} />}
                renderDescription={(data) => data.description || data.vicinity}
                predefinedPlaces={[homePlace, workPlace]}
              />

              <View style={styles.inputDivider} />

              <GooglePlacesAutocomplete
                placeholder="Drop-off location"
                onPress={(data, details = null) => {
                  setDestinationPlace({ data, details });
                }}
                fetchDetails={true}
                enablePoweredByContainer={false}
                suppressDefaultStyles
                styles={{
                  textInput: styles.textInput,
                  container: styles.autocompleteContainer2,
                  separator: styles.separator,
                }}
                query={{
                  key: 'AIzaSyBCCrqECHOid0b_QkiUT3NNrUSMGe55Wb4',
                  language: 'en',
                }}
                renderRow={(data) => <PlaceRow data={data} />}
                renderDescription={(data) => data.description || data.vicinity}
              />
            </View>
          </View>
        </View>

        <View style={styles.quickLinksContainer}>
          <Text style={styles.quickLinksTitle}>Quick Links</Text>
          <View style={styles.quickLinks}>
            <Pressable style={styles.quickLinkCard}>
              <View style={styles.quickLinkIcon}>
                <MaterialCommunityIcons name="home" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.quickLinkText}>Home</Text>
            </Pressable>
            <Pressable style={styles.quickLinkCard}>
              <View style={styles.quickLinkIcon}>
                <MaterialCommunityIcons name="briefcase" size={24} color="#4CAF50" />
              </View>
              <Text style={styles.quickLinkText}>Work</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'Home' && styles.activeTab]}
          onPress={handleHome}>
          <Ionicons name={activeTab === 'Home' ? 'home' : 'home-outline'} size={24} color={activeTab === 'Home' ? '#4CAF50' : '#666'} />
          <Text style={[styles.navText, activeTab === 'Home' && styles.activeNavText]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, activeTab === 'Booking' && styles.activeTab]}
          onPress={goToBooking}>
          <AntDesign name="calendar" size={24} color={activeTab === 'Booking' ? '#4CAF50' : '#666'} />
          <Text style={[styles.navText, activeTab === 'Booking' && styles.activeNavText]}>Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, activeTab === 'BusDetails' && styles.activeTab]}
          onPress={goToBusDetails}>
          <Ionicons name={activeTab === 'BusDetails' ? 'bus' : 'bus-outline'} size={24} color={activeTab === 'BusDetails' ? '#4CAF50' : '#666'} />
          <Text style={[styles.navText, activeTab === 'BusDetails' && styles.activeNavText]}>Buses</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, activeTab === 'Profile' && styles.activeTab]}
          onPress={goToUserProfile}>
          <FontAwesome5 name={activeTab === 'Profile' ? 'user-alt' : 'user'} size={22} color={activeTab === 'Profile' ? '#4CAF50' : '#666'} />
          <Text style={[styles.navText, activeTab === 'Profile' && styles.activeNavText]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DestinationSearchScreen;
