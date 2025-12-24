import React, {useEffect, useState} from 'react';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import BusLayoutScreen from './src/screens/Booking/BusLayoutScreen';
import SeatDetailsScreen from './src/screens/Booking/SeatDetailsScreen';
import HomeScreen from './src/screens/HomeScreen';
import UserProfileScreen from './src/screens/UserProfileScreen';
import DestinationSearchScreen from './src/screens/DestinationSearchScreen';
import BusDetailsScreen from './src/screens/BusDetailsScreen';
import EditUserProfileScreen from './src/screens/EditUserProfileScreen';
import { PermissionsAndroid, Platform, ActivityIndicator, View } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
navigator.geolocation = require('@react-native-community/geolocation');
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-reanimated';
import BusMapScreen from './src/screens/BusMapScreen/BusMapScreen';
import StartingScreen from './src/screens/StartingScreen';
import SplashScreen from 'react-native-splash-screen';
import SuccessScreen from './src/screens/Booking/SuccessScreen/SuccessScreen';
import BookingRecipt from './src/screens/BookingReceipt/BookingReceipt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';


const Stack = createNativeStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    SplashScreen.hide();
  })
  
  useEffect(() => {
    checkAuthAndOnboarding();
  }, []);

  const checkAuthAndOnboarding = async () => {
    try {
      // Check if onboarding has been shown
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      
      // Check if user is logged in
      const currentUser = auth().currentUser;
      
      if (!hasSeenOnboarding) {
        // First time user - show onboarding
        setInitialRoute('Start');
      } else if (currentUser) {
        // User is logged in - go to Home
        setInitialRoute('Home');
      } else {
        // User has seen onboarding but not logged in - go to Welcome
        setInitialRoute('Welcome');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setInitialRoute('Start');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4CAF50' }}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{headerShown:false}}
        initialRouteName={initialRoute}
      >
        <Stack.Screen name="Start" component={StartingScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={UserProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditUserProfileScreen} />
        <Stack.Screen name="Receipt" component={BookingRecipt} />
        <Stack.Screen name="Destination Search" component={DestinationSearchScreen} />
        <Stack.Screen name="Destination" component={DestinationSearchScreen} />
        <Stack.Screen name="Bus Details" component={BusDetailsScreen} />
        <Stack.Screen name="Bus Layout" component={BusLayoutScreen} />
        <Stack.Screen name="Seat Details" component={SeatDetailsScreen} />
        <Stack.Screen name="BusMapScreen" component={BusMapScreen} />
        <Stack.Screen name="BusLayoutScreen" component={BusLayoutScreen} />
        <Stack.Screen name="SeatDetailsScreen" component={SeatDetailsScreen} />
        <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
