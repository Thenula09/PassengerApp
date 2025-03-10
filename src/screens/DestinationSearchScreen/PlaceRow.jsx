import React from 'react';
import { View, Text } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import styles from './styles';

const PlaceRow = ({ data }) => {
  const isMataraBusStand = data.description === 'Matara Bus Stand';

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.iconContainer,
          isMataraBusStand && { backgroundColor: '#007BFF' },
        ]}
      >
        <Entypo
          name={isMataraBusStand ? 'home' : 'location-pin'}
          size={20}
          color={isMataraBusStand ? 'white' : 'white'} // Icon color
        />
      </View>
      <Text style={styles.locationText}>{data.description || data.vicinity}</Text>
    </View>
  );
};

export default PlaceRow;