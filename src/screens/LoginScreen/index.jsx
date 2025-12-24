import {View, TouchableOpacity, TextInput, Text, ScrollView, Keyboard} from 'react-native';
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    Keyboard.dismiss();
    
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'Please fill in both fields.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      Toast.show({
        type: 'success',
        text1: 'Welcome Back! ',
        text2: 'Login successful.',
      });
      setTimeout(() => {
        navigation.navigate('Home');
      }, 500);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'Invalid email or password.',
      });
    } finally {
      setIsLoading(false);
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
      colors={['#E8F5E9', '#C8E6C9', '#81C784']}
      style={styles.container}>

    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.backArrowContainer} onPress={arrowLogin}>
        <Ionicons name={'arrow-back-outline'} color={'#1B5E20'} size={30} />
      </TouchableOpacity>

      <View style={styles.welcomeMsg}>
          <Text style={styles.welcomeText}>Welcome Back </Text>
          <Text style={styles.p}>Enter your email & password</Text>
        </View>

      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 10 }} 
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        
        <View style={styles.textInputContainer}>
        <View style={styles.inputContainer}>
          <Fontisto name={'email'} size={20} color={'#4CAF50'} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor={'#999'}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Fontisto name={'locked'} size={20} color={'#4CAF50'} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor={'#999'}
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
              size={22}
              color="#4CAF50"
            />
          </TouchableOpacity>
        </View>
        </View>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonLoginText}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Text>
        </TouchableOpacity>

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
