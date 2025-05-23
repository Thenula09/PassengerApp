import {View, TouchableOpacity, TextInput, Text, Image, ScrollView} from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../FirebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import styles from './styles';
import Toast from 'react-native-toast-message';

import LinearGradient from 'react-native-linear-gradient';

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
    <LinearGradient
      colors={['white', 'white', 'green']}
      style={styles.container}>

    <View
      
    >
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backArrowContainer} onPress={arrowLogin}>
        <Ionicons name={'arrow-back-outline'} color={'black'} size={30} />
      </TouchableOpacity>

      {/* Welcome Message */}
      <View style={styles.welcomeMsg}>
          <Text style={styles.welcomeText}>Welcome Back👋</Text>
          <Text style={styles.p}>Enter your email & password</Text>
        </View>


      {/* Scrollable Form */}
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 10 }} 
        keyboardShouldPersistTaps='never'
      >
        
        {/* Email Input */}
        <View style={styles.textInputContainer}>
        <View style={styles.inputContainer}>
          <Fontisto name={'email'} size={20} color={'gray'} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor={'gray'}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Fontisto name={'locked'} size={20} color={'gray'} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor={'gray'}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
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
        </View>

        {/* Forgot Password */}
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button - Light Black Transparent */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.buttonLoginText}>Sign in</Text>
        </TouchableOpacity>

        {/* Bottom Text - Sign Up Link */}
        <View style={styles.bottomText}>
          <Text style={styles.doNotAccountText}>Don't have an account?</Text>
          <TouchableOpacity onPress={register}>
            <Text style={styles.bottomSignUp}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Toast />
    </View>
      </LinearGradient>
  );
};

export default LoginScreen;
