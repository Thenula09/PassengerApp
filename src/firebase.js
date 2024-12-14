import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: 'AIzaSyBE-cccmciRpX1LIF1K4Lqkh1d-_kbl1To',
  authDomain: 'passenger-app-d237a.firebaseapp.com',
  databaseURL: 'https://passenger-app-d237a-default-rtdb.firebaseio.com',//real time data base url
  projectId: 'passenger-app-d237a',
  storageBucket: 'passenger-app-d237a.appspot.com',
  messagingSenderId: '429955875720',
  appId: '1:429955875720:android:3edf1116def2a675bb703d',
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
  webClientId: '429955875720-s8574jbqmek63fmv2fnpms55c84fqrdl.apps.googleusercontent.com',
});

export { auth, GoogleSignin, database };
