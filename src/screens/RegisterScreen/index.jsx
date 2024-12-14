import React, { useState } from 'react';
import {View, TouchableOpacity, TextInput, Text, Image, Alert, ScrollView} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import { auth, database, GoogleSignin, signInWithCredential, GoogleAuthProvider } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';


const RegisterScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nic, setNic] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const arrowLogin = () => {
    navigation.navigate('Welcome');
  };

  const Login = () => {
    navigation.navigate('Login');
  };

  const isValidMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

  const isValidEmail = (email) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);

  const handleSignUp = () => {
    if (!username || !password || !confirmPassword || !nic || !mobile || !email) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    if (!isValidMobile(mobile)) {
      Alert.alert('Error', 'Please enter a valid mobile number (10 digits).');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        set(ref(database, 'users/' + user.uid), {
          username: username,
          nic: nic,
          mobile: mobile,
          email: email,
        });

        Alert.alert('Success', 'Account created successfully!');
        navigation.navigate('Login');
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  const handleGoogleSignUp = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn();

      const googleCredential = GoogleAuthProvider.credential(idToken);

      const userCredential = await signInWithCredential(auth, googleCredential);

      const { user } = userCredential;

      set(ref(database, 'users/' + user.uid), {
        username: user.displayName,
        email: user.email,
      });

      Alert.alert('Success', 'Signed up with Google!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Error', 'Google Sign-In failed. Please try again.');
    }
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
          <Fontisto name={'person'} size={20} color={'gray'} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your NIC number"
            placeholderTextColor={'lightgray'}
            value={nic}
            onChangeText={setNic}
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
            secureTextEntry={!passwordVisible}
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

        <View style={styles.inputContainer}>
          <Fontisto name={'locked'} size={20} color={'gray'} />
          <TextInput
            style={styles.textInput}
            placeholder="Confirm password"
            placeholderTextColor={'lightgray'}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!confirmPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            style={styles.eyeIconContainer}
          >
            <Ionicons
              name={confirmPasswordVisible ? 'eye' : 'eye-off'}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.buttonSignUpText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.continueText}>or continue with</Text>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp}>
          <Image
            style={styles.googleLogo}
            source={require('../../assets/download.png')}
          />
          <Text style={styles.buttonGoogleText}>Google</Text>
        </TouchableOpacity>

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
