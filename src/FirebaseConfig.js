import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: 'AIzaSyCaI4bL0fF2L523hDw6LJBbEC-vzHfEAlQ',
  authDomain: 'test-259cc.firebaseapp.com',
  databaseURL: 'https://test-259cc-default-rtdb.firebaseio.com',//real time data base url
  projectId: 'test-259cc',
  storageBucket: 'test-259cc.appspot.com',
  messagingSenderId: '900037855825',
  appId: '1:900037855825:android:00996e6f7167d2c0848670',
};

// Firebase initialize karanna, check karala
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig); // Firebase eka initialize karanna
} else {
  app = getApps()[0]; // Firebase app already thiyenawanam, eya use karanna
}

// Auth persistence setup
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Realtime Database initialize karanna
const database = getDatabase(app);

// Google Sign-In Configuration
GoogleSignin.configure({
  webClientId: '900037855825-66f1e1171a0d81a4848670.apps.googleusercontent.com',
});

export { auth, GoogleSignin, database };
