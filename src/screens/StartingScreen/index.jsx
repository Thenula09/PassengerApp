import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Onboarding from 'react-native-onboarding-swiper';

const DoneButtonComponent = ({ ...rest }) => {
  return (
    <TouchableOpacity {...rest} style={{ marginHorizontal: 20 }}>
      <Text style={{ color: 'white', fontSize: 16 }}>Done</Text>
    </TouchableOpacity>
  );
};

const Start = () => {
  const navigation = useNavigation();

  const onSkip = () => {
    navigation.navigate('Welcome');
  };

  const onDone = () => {
    navigation.navigate('Welcome');
  };

  return (
    <LinearGradient
      colors={['white', 'white', 'green']}
      style={{ flex: 1 }}
    >
      <Onboarding
        DoneButtonComponent={DoneButtonComponent}
        onSkip={onSkip}
        onDone={onDone}
        containerStyles={{ backgroundColor: 'transparent' }} 
        titleStyles={{
          fontSize: 24,
          fontWeight: 'bold',
          textAlign: 'center',
          color: 'black',
        }}
        subTitleStyles={{
          fontSize: 16,
          textAlign: 'center',
          color: 'black',
          paddingHorizontal: 20,
        }}
        pages={[
          {
            backgroundColor: 'transparent',
            image: <Image source={require('../../assets/image1.png')} style={styles.image1} />,
            title: 'Track your bus in real-time',
            subtitle:
              'See your bus moving live on the map, track its exact location, and check for any delays all in real-time.',
          },
          {
            backgroundColor: 'transparent',
            image: <Image source={require('../../assets/image2.png')} style={styles.image2} />,
            title: 'Reserve seats and make online payments',
            subtitle:
              'Easily reserve your seats and confirm your booking with secure online payments. With trusted payment gateways, you can book your seat with confidence and peace of mind.',
          },
          {
            backgroundColor: 'transparent',
            image: <Image source={require('../../assets/image3.png')} style={styles.image3} />,
            title: 'Plan your journey with easy',
            subtitle:
              'Effortlessly plan your journey ahead of time. Check bus schedules, seat availability, and routes — all in one place, making your travel planning simple and stress-free.',
          },
        ]}
      />
    </LinearGradient>
  );
};

export default Start;
