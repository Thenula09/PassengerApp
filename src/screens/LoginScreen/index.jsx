import {View, TouchableOpacity, TextInput, Text, Image, ScrollView} from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../FirebaseConfig'; // Firebase auth file eka
import {signInWithEmailAndPassword,sendPasswordResetEmail} from 'firebase/auth'; // Firebase authentication function eka
import styles from './styles';
import Toast from 'react-native-toast-message';

const LoginScreen = () => {
  const navigation = useNavigation();

  const arrowLogin = () => {
    navigation.navigate('Welcome');
  };

  const register = () => {
    navigation.navigate('Register');
  };

  const [secureEntry, setSecureEntry] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'Please fill in both fields.',
      });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      Toast.show({
        type: 'success',
        text1: 'Welcome Back!',
        text2: 'Login successful.',
      });

      navigation.navigate('Home');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'Invalid email or password.',
      });
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: 'Please enter your email address.',
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password reset email has been sent!',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: 'Error sending password reset email.',
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Arrow_back icon */}
      <TouchableOpacity style={styles.backArrowContainer} onPress={arrowLogin}>
        <Ionicons name={'arrow-back-outline'} color={'black'} size={30} />
      </TouchableOpacity>

      {/* Welcome message */}
      <View style={styles.welcomeMsg}>
        <Text style={styles.welcomeText}>Hi, Welcome Back!👋</Text>
      </View>

      {/* Login Form */}
      <View style={styles.form}>
        {/*Email input box */}
        <View style={styles.inputContainer}>
          <Feather name={'user'} size={20} color={'gray'} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor={'lightgray'}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password input box */}
        <View style={styles.inputContainer}>
          <Fontisto name={'locked'} size={20} color={'gray'} />
          <TextInput
            style={styles.textInput}
            placeholder=" Enter your password"
            placeholderTextColor={'lightgray'}
            secureTextEntry={secureEntry}
            value={password}
            onChangeText={setPassword}
          />
          {/* Eye icon */}
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIconContainer}
          >
            <Ionicons
              name={passwordVisible ? 'eye' : 'eye-off'}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonLoginText}>Login</Text>
        </TouchableOpacity>

        {/*
        <Text style={styles.continueText}>or continue with</Text>
         */}
        {/*
        <TouchableOpacity style={styles.googleButton}>
          <Image style={styles.googleLogo} source={image} />
          <Text style={styles.buttonGoogleText}>Google</Text>
        </TouchableOpacity> */}

        {/* Login page bottom text */}
        <View style={styles.bottomText}>
          {/* Don't have account text */}
          <Text style={styles.doNotAccountText}>Don't have an account?</Text>
          {/* signUp button */}
          <TouchableOpacity>
            <Text style={styles.bottomSignUp} onPress={register}>
              SignUp
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </ScrollView>
  );
};

export default LoginScreen;
