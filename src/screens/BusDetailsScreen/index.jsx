import { View, Text } from 'react-native';
import React from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import styles from './styles';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBj9TLJs06OE70ZA3ewrWz_VpiWHxPlp3s';

const BusDetailsScreen = () => {

const origin = {latitude: 5.9431, longitude:80.5490};
const destination = {latitude: 5.9531, longitude: 80.5580};
  return (
    <View>
      <View style={styles.homeMap}>
    <MapView
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={styles.map}
       region={{
         latitude: 5.9431,
         longitude: 80.5490,
         latitudeDelta: 0.015,
         longitudeDelta: 0.0121,
       }}>

       <MapViewDirections
       origin={origin}
       destination={destination}
       apikey={GOOGLE_MAPS_APIKEY}
       strokeWidth={5}
       strokeColor="black"
     />
       <Marker
        coordinate={origin}
        title={'Origin'}
      />
      <Marker
        coordinate={destination}
        title={'Destination'}
      />
      </MapView>
    </View>
    </View>
  );
};

export default BusDetailsScreen;
