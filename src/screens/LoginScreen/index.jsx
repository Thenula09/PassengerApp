import { View, TouchableOpacity, TextInput, Text, Image, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../firebase'; // Firebase auth import
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'; // Firebase authentication functions
import styles from './styles';

const LoginScreen = () => {
  const navigation = useNavigation();

  const arrowLogin = () => {
    navigation.navigate('Welcome');
  };

  const register = () => {
    navigation.navigate('Register');
  };

  const [secureEntry, setSecureEntry] = useState(true);
  const [email, setEmail] = useState(''); // Email state
  const [password, setPassword] = useState(''); // Password state
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility

  // Login function to handle user authentication
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error','Please fill in both fields');
      return;
    }

    try {
      // Firebase login with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error',error.message); // Set error message
    }
  };

  // Forgot password function to handle password reset email
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error','Please enter your email address');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email); // Send reset password email
      Alert.alert('Success', 'Password reset email has been sent!');
    } catch (error) {
      setErrorMessage('Error sending password reset email');
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
        <Text style={styles.welcomeText}>Hi, Welcome Back!</Text>
      </View>

      {/* Login Form */}
      <View style={styles.form}>
        {/* Username (Email) input box */}
        <View style={styles.inputContainer}>
          <Feather name={'user'} size={20} color={'gray'} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor={'lightgray'}
            value={email} // Bind email state
            onChangeText={setEmail} // Update email on change
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
            value={password} // Bind password state
            onChangeText={setPassword} // Update password on change
          />
          {/* Eye icon to toggle password visibility */}
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

        {/* Display error message if any */}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        {/* Forgot Password label */}
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonLoginText}>Login</Text>
        </TouchableOpacity>

        {/* or continue with text */}
        <Text style={styles.continueText}>or continue with</Text>

        {/* Google Button (optional) */}
        <TouchableOpacity style={styles.googleButton}>
          <Image style={styles.googleLogo} source={require('../../assets/download.png')} />
          <Text style={styles.buttonGoogleText}>Google</Text>
        </TouchableOpacity>

        {/* Login page bottom text label */}
        <View style={styles.bottomText}>
          {/* Don't have account text */}
          <Text style={styles.doNotAccountText}>Don't have an account?</Text>
          {/* signUp button label */}
          <TouchableOpacity>
            <Text style={styles.bottomSignUp} onPress={register}>
              SignUp
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
