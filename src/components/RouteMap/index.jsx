import React, { useEffect, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBCCrqECHOid0b_QkiUT3NNrUSMGe55Wb4';

const RouteMap = ({ origin, destination }) => {
  const mapRef = useRef(null);

  // Handle different data structures
  const getLocation = (place) => {
    // Check if it has details.geometry.location (from autocomplete)
    if (place?.details?.geometry?.location) {
      return {
        latitude: place.details.geometry.location.lat,
        longitude: place.details.geometry.location.lng,
      };
    }
    // Check if it has geometry.location (alternative structure)
    if (place?.geometry?.location) {
      return {
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
      };
    }
    // Check if it has direct lat/lng
    if (place?.latitude && place?.longitude) {
      return {
        latitude: place.latitude,
        longitude: place.longitude,
      };
    }
    return null;
  };

  const originLoc = getLocation(origin);
  const destinationLoc = getLocation(destination);

  useEffect(() => {
    if (mapRef.current && originLoc && destinationLoc) {
      // Fit map to show both markers with a delay to ensure map is ready
      setTimeout(() => {
        mapRef.current.fitToCoordinates([originLoc, destinationLoc], {
          edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
          animated: true,
        });
      }, 1000);
    }
  }, [originLoc, destinationLoc]);

  // Default region (Sri Lanka center)
  const defaultRegion = {
    latitude: 6.9271,
    longitude: 79.8612,
    latitudeDelta: 2.0,
    longitudeDelta: 2.0,
  };

  return (
    <MapView
      ref={mapRef}
      style={{ width: '100%', height: '100%' }}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      initialRegion={defaultRegion}
    >
      {originLoc && destinationLoc && (
        <>
          <MapViewDirections
            origin={originLoc}
            destination={destinationLoc}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={6}
            strokeColor="#2E7D32"
            mode="DRIVING"
            avoidTolls={false}
            avoidFerries={true}
            optimizeWaypoints={true}
            precision="high"
            timePrecision="now"
            onError={(errorMessage) => {
              console.log('MapViewDirections Error: ', errorMessage);
            }}
            onReady={(result) => {
              console.log(`Route ready - Distance: ${result.distance} km, Duration: ${result.duration} min`);
              // Fit to route coordinates after route is calculated
              if (mapRef.current) {
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
                  animated: true,
                });
              }
            }}
          />
          <Marker
            coordinate={originLoc}
            title="Origin"
            description={origin?.data?.description || origin?.description || 'Starting point'}
            pinColor="#4CAF50"
          />
          <Marker
            coordinate={destinationLoc}
            title="Destination"
            description={destination?.data?.description || destination?.description || 'End point'}
            pinColor="#F44336"
          />
        </>
      )}
    </MapView>
  );
};

export default RouteMap;
