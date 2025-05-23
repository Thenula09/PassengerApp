import React from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_APIKEY = 'AIzaSyA_prl2ZQaKaEXOE0mszf6b9sj-WDdCvQg';

const RouteMap = ({ origin, destination }) => {
  const originLoc = origin?.details?.geometry?.location
    ? {
        latitude: origin.details.geometry.location.lat,
        longitude: origin.details.geometry.location.lng,
      }
    : { latitude: 0, longitude: 0 };

  const destinationLoc = destination?.details?.geometry?.location
    ? {
        latitude: destination.details.geometry.location.lat,
        longitude: destination.details.geometry.location.lng,
      }
    : { latitude: 0, longitude: 0 };

  return (
    <MapView
      style={{ width: '100%', height: '100%' }}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      initialRegion={{
        latitude: 5.9431,
        longitude: 80.5490,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      }}
    >
      {origin && destination && (
        <MapViewDirections
          origin={originLoc}
          destination={destinationLoc}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          strokeColor="black"
        />
      )}
      {origin && (
        <Marker
          coordinate={originLoc}
          title={'Origin'}
        />
      )}
      {destination && (
        <Marker
          coordinate={destinationLoc}
          title={'Destination'}
        />
      )}
    </MapView>
  );
};

export default RouteMap;
