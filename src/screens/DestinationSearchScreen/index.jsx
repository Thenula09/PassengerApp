import 'react-native-get-random-values';
import {View} from 'react-native';
import React from 'react';
import styles from './styles';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import PlaceRow from './PlaceRow';

const homePlace = {
  description: 'Matara Bus Stand',
  geometry: { location: { lat: 5.9431, lng: 80.5490 } },
};
const workPlace = {
  description: 'NIBM Matara',
  geometry: { location: { lat: 5.9493, lng: 80.5463} },
};

const DestinationSearchScreen = () => {
  return (
    <View style={styles.container}>
     <GooglePlacesAutocomplete
      placeholder="Where from"
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      enablePoweredByContainer={false}
      suppressDefaultStyles
      currentLocation={true}
      currentLocationLabel="Current location"
      styles={{
        textInput:styles.textInput,
        container:{
          position:'absolute',
          top:0,
          left:10,
          right:10,
        },
        listView:{
          position:'absolute',
          top:105,
        },
        separator:{
          backgroundColor:'#ababab',
          height:1,
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
     <GooglePlacesAutocomplete
      placeholder="Where to?"
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      enablePoweredByContainer={false}
      suppressDefaultStyles
      styles={{
        textInput:styles.textInput,
        container:{
          position:'absolute',
          top:55,
          left:10,
          right:10,
        },
        separator:{
          backgroundColor:'#ababab',
          height:1,
        },
      }}
      query={{
        key: 'AIzaSyA55BcfnDZ54cEaQyHMRllgX4Fo-niDUN8',
        language: 'en',
      }}
      renderRow={(data) => <PlaceRow data={data} />}
      renderDescription={(data) => data.description || data.vicinity}
    />
      {/* Circle near Origin input */}
      <View style={styles.circle} />

{/* Line between dots */}
<View style={styles.line} />

{/* Square near Destination input */}
<View style={styles.square} />

    </View>
  );
};

export default DestinationSearchScreen;
