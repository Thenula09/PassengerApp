import React from 'react';
import { View, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';

const PlaceRow = ({ data }) => {
  const isMataraBusStand = data.description === 'Matara Bus Stand';
  const isNIBM = data.description === 'NIBM Matara';

  return (
    <View style={styles.row}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={isMataraBusStand ? 'home' : isNIBM ? 'briefcase' : 'map-marker'}
          size={22}
          color="#4CAF50"
        />
      </View>
      <Text style={styles.locationText}>{data.description || data.vicinity}</Text>
    </View>
  );
};

export default PlaceRow;