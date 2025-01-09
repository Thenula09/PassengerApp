import React from 'react';
import { View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const BusMapScreen = ({ route }) => {
  const { currentLocation } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          title="Bus Location"
          description="This is the current location of the bus"
        />
      </MapView>
    </View>
  );
};

export default BusMapScreen;
