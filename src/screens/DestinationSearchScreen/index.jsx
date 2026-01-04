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
import BottomNavBar from '../../components/BottomNavBar';
import Header from '../../components/Header';

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
    navigation.navigate('Destination');
  };

  const goToBusDetails = () => {
    setActiveTab('BusDetails');
    navigation.navigate('Bus Details');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Search Destination"
        subtitle="Enter your journey details to find buses"
        showBackButton={true}
      />

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
      <BottomNavBar activeTab="Booking" />
    </View>
  );
};

export default DestinationSearchScreen;
