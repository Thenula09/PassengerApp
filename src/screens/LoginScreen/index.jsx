import { View, TouchableOpacity, TextInput, Text, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useNavigation } from '@react-navigation/native';

import styles from './styles';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const arrowLogin = () => {
    navigation.navigate('Welcome');
  };

  const register = () => {
    navigation.navigate('Register');
  };

  const handleLogin = () => {
    navigation.navigate('Home'); // Replace 'Home' with your target screen
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
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password input box */}
        <View style={styles.inputContainer}>
          <Fontisto name={'locked'} size={20} color={'gray'} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor={'lightgray'}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
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
          <TouchableOpacity onPress={register}>
            <Text style={styles.bottomSignUp}>
              SignUp
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;
