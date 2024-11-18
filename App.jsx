import React, {useEffect} from 'react';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import BusLayoutScreen from './src/screens/Booking/BusLayoutScreen';
import SeatDetailsScreen from './src/screens/Booking/SeatDetailsScreen';
import HomeScreen from './src/screens/HomeScreen';
import PaymentScreen from './src/screens/Booking/PaymentScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import DestinationSearchScreen from './src/screens/DestinationSearchScreen';
import BusDetailsScreen from './src/screens/BusDetailsScreen';
import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
navigator.geolocation = require('@react-native-community/geolocation');


const App = () => {

  const androidPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'HighwayBus tracking & booking App needs access to your location ' +
            'so you can take awesome rides.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(()=>{
    if( Platform.OS === 'android'){
      androidPermission();
    }
    else{
      //ios
      Geolocation.requestAuthorization();
    }
  },[]);
  return (

  <UserProfileScreen/>
);
};

export default App;
