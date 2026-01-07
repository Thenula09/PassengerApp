import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBCCrqECHOid0b_QkiUT3NNrUSMGe55Wb4';

const RouteMap = forwardRef(({ origin, destination, onMapReady }, ref) => {
  const mapRef = useRef(null);

  // Parent component වලට methods expose කිරීම
  useImperativeHandle(ref, () => ({
    fitToCoordinates: (coordinates, options) => {
      if (mapRef.current && mapRef.current.fitToCoordinates) {
        mapRef.current.fitToCoordinates(coordinates, options);
      }
    },
    getMap: () => mapRef.current,
  }));

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
        if (mapRef.current && mapRef.current.fitToCoordinates) {
          mapRef.current.fitToCoordinates([originLoc, destinationLoc], {
            edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
            animated: true,
          });
        }
      }, 1000);
    }
  }, [originLoc, destinationLoc]);

  const handleMapReady = () => {
    if (onMapReady) {
      onMapReady();
    }
  };

  // Default region (Sri Lanka center)
  const defaultRegion = {
    latitude: 6.9271,
    longitude: 79.8612,
    latitudeDelta: 2.0,
    longitudeDelta: 2.0,
  };

  // If no valid locations, show fallback
  if (!originLoc || !destinationLoc) {
    return (
      <MapView
        style={{ width: '100%', height: '100%' }}
        provider={PROVIDER_GOOGLE}
        initialRegion={defaultRegion}
        onMapReady={handleMapReady}
      >
        <Marker
          coordinate={defaultRegion}
          title="No Route Available"
          description="Please check your locations"
          pinColor="#FF9800"
        />
      </MapView>
    );
  }

  return (
    <MapView
      ref={mapRef}
      style={{ width: '100%', height: '100%' }}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      initialRegion={defaultRegion}
      onMapReady={handleMapReady}
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
              if (mapRef.current && mapRef.current.fitToCoordinates) {
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
});

// Display name for debugging
RouteMap.displayName = 'RouteMap';

export default RouteMap;