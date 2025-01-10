import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, Text, Image, Alert, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import styles from './styles';

const RegisterScreen = () => {
  const navigation = useNavigation();

  // State to handle form inputs
  const [username, setUsername] = useState('');
 
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Navigate to Welcome screen
  const arrowLogin = () => {
    navigation.navigate('Welcome');
  };

  // Navigate to Login screen
  const Login = () => {
    navigation.navigate('Login');
  };


  const handleSignUp = () => {

    if (!username || !mobile || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    // Create a new user
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const userId = userCredential.user.uid;

        const newPassenger = {
          username,
    
          mobile,
          email,
        };

        return database()
          .ref(`/passenger/${userId}`)
          .set(newPassenger);
      })
      .then(() => {
        Alert.alert('Success', 'Registration Successful!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]);
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Error', 'This email address is already in use!');
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert('Error', 'This email address is invalid!');
        } else if (error.code === 'auth/weak-password') {
          Alert.alert('Error', 'Password should be at least 6 characters!');
        } else {
          Alert.alert('Error', 'Something went wrong: ' + error.message);
        }
      });
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backArrowContainer} onPress={arrowLogin}>
        <Ionicons name={'arrow-back-outline'} color={'black'} size={30} />
      </TouchableOpacity>

      <Text style={styles.welcomeText}>Get Started Now!</Text>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Feather name={'user'} size={20} color={'gray'} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter username"
            placeholderTextColor={'lightgray'}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputContainer}>
          <Foundation name={'telephone'} size={20} color={'gray'} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your mobile number"
            placeholderTextColor={'lightgray'}
            value={mobile}
            onChangeText={setMobile}
            keyboardType={'number-pad'}
          />
        </View>

        <View style={styles.inputContainer}>
          <Fontisto name={'email'} size={20} color={'gray'} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your email"
            placeholderTextColor={'lightgray'}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Fontisto name={'locked'} size={20} color={'gray'} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter password"
            placeholderTextColor={'lightgray'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>

        <View style={styles.inputContainer}>
          <Fontisto name={'locked'} size={20} color={'gray'} />
          <TextInput
            style={styles.textInput}
            placeholder="Confirm password"
            placeholderTextColor={'lightgray'}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.buttonSignUpText}>Sign Up</Text>
        </TouchableOpacity>

       {/*  <Text style={styles.continueText}>or continue with</Text>

        <TouchableOpacity style={styles.googleButton}>
          <Image
            style={styles.googleLogo}
            source={require('../../assets/download.png')}
          />
          <Text style={styles.buttonGoogleText}>Google</Text>
        </TouchableOpacity>*/}

        <View style={styles.bottomText}>
          <Text style={styles.alreadyAccountText}>Already have an account?</Text>
          <TouchableOpacity onPress={Login}>
            <Text style={styles.bottomLogin}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegisterScreen;
