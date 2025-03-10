import 'react-native-get-random-values';
import React, { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import PlaceRow from './PlaceRow';

const homePlace = {
  description: 'Matara Bus Stand',
  geometry: { location: { lat: 5.9431, lng: 80.5490 } },
};
const workPlace = {
  description: 'NIBM Matara',
  geometry: { location: { lat: 5.9493, lng: 80.5463 } },
};

const DestinationSearchScreen = () => {
  const [originPlace, setOriginPlace] = useState(null); // where from
  const [destinationPlace, setDestinationPlace] = useState(null); // where to

  const navigation = useNavigation();

  useEffect(() => {
    if (originPlace && destinationPlace) { // two select and go to bus details page
      navigation.navigate('Bus Details', {
        originPlace,
        destinationPlace,
      });
    }
  }, [originPlace, destinationPlace, navigation]);

  const handleHome = () => {
    navigation.navigate('Home'); // back button, navigate to home
  };

  return (
    <View
      style={styles.container}
    >
      {/* Back button */}
      <Pressable style={styles.backArrowContainer} onPress={handleHome}>
        <Ionicons name={'arrow-back-outline'} color={'black'} size={30} />
      </Pressable>

      <View style={styles.container}>
        {/* Origin input */}
        <GooglePlacesAutocomplete
          placeholder="Where from"
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
            container: {
              position: 'absolute',
              top: 0,
              left: 30,
              right: 10,
              borderWidth:1,
              width:'90%',
              borderRadius:5,
            },
            listView: {
              position: 'absolute',
              top: 105,
            },
            separator: {
              backgroundColor: 'gray',
              height: 2,
            },
          }}
          query={{
            key: 'AIzaSyA55BcfnDZ54cEaQyHMRllgX4Fo-niDUN8',
            language: 'en',
          }}
          renderRow={(data) => <PlaceRow data={data} />}
          renderDescription={(data) => data.description || data.vicinity}
          predefinedPlaces={[homePlace, workPlace]}
        />

        {/* Destination input */}
        <GooglePlacesAutocomplete
          placeholder="Where to?"
          onPress={(data, details = null) => {
            setDestinationPlace({ data, details });
          }}
          fetchDetails={true}
          enablePoweredByContainer={false}
          suppressDefaultStyles
          styles={{
            textInput: styles.textInput,
            container: {
              position: 'absolute',
              top: 55,
              left: 30,
              right: 10,
              borderWidth:1,
              width:'90%',
              borderRadius:5
            },
            separator: {
              backgroundColor: 'gray',
              height: 2,
            },
          }}
          query={{
            key: 'AIzaSyA55BcfnDZ54cEaQyHMRllgX4Fo-niDUN8',
            language: 'en',
          }}
          renderRow={(data) => <PlaceRow data={data} />}
          renderDescription={(data) => data.description || data.vicinity}
        />

        {/* UI elements: Circle, Line, and Square */}
        <View style={styles.circle} />
        <View style={styles.line} />
        <View style={styles.square} />
      </View>
    </View>
  );
};

export default DestinationSearchScreen;
