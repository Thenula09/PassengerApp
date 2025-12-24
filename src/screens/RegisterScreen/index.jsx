import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput, Text, ScrollView, Keyboard, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';

const RegisterScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const arrowLogin = () => {
    navigation.navigate('Welcome');
  };

  const Login = () => {
    navigation.navigate('Login');
  };

  const handleSignUp = () => {
    Keyboard.dismiss();
    
    if (!username || !mobile || !email || !password || !confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'All fields are required!',
      });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Passwords do not match!',
      });
      return;
    }
    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password should be at least 6 characters!',
      });
      return;
    }

    setIsLoading(true);
    
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
        Toast.show({
          type: 'success',
          text1: 'Success! ',
          text2: 'Registration Successful!',
        });
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1000);
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'This email address is already in use!',
          });
        } else if (error.code === 'auth/invalid-email') {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'This email address is invalid!',
          });
        } else if (error.code === 'auth/weak-password') {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Password should be at least 6 characters!',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Something went wrong: ' + error.message,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <LinearGradient
      colors={['#E8F5E9', '#C8E6C9', '#81C784']}
      style={styles.container}
    >
      
    <View style={[styles.container]}>
      <TouchableOpacity style={styles.backArrowContainer} onPress={arrowLogin}>
        <Ionicons name={'arrow-back-outline'} color={'#1B5E20'} size={30} />
      </TouchableOpacity>
      
      <View style={styles.welcomeMsg}>
        <View style={styles.tiImg}>
          <Text style={styles.welcomeText}>Create Account</Text>
          <Text style={styles.img}></Text>
        </View>
        <Text style={styles.p}>Please enter your details</Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 10 }} 
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Feather name={'user'} size={20} color={'#4CAF50'} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter username"
            placeholderTextColor={'#999'}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputContainer}>
          <Foundation name={'telephone'} size={20} color={'#4CAF50'} />
          <TextInput
            style={styles.textInput}
            placeholder="Enter your mobile number"
            placeholderTextColor={'#999'}
            value={mobile}
            onChangeText={setMobile}
            keyboardType={'number-pad'}
          />
        </View>

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
            placeholder="Enter password"
            placeholderTextColor={'#999'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={{ padding: 5 }}
          >
            <Ionicons
              name={passwordVisible ? 'eye' : 'eye-off'}
              size={22}
              color="#4CAF50"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Fontisto name={'locked'} size={20} color={'#4CAF50'} />
          <TextInput
            style={styles.textInput}
            placeholder="Confirm password"
            placeholderTextColor={'#999'}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!confirmPasswordVisible}
          />
          <TouchableOpacity
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            style={{ padding: 5 }}
          >
            <Ionicons
              name={confirmPasswordVisible ? 'eye' : 'eye-off'}
              size={22}
              color="#4CAF50"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.signUpButton} 
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <Text style={styles.buttonSignUpText}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomText}>
          <Text style={styles.alreadyAccountText}>Already have an account?</Text>
          <TouchableOpacity onPress={Login}>
            <Text style={styles.bottomLogin}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
      <Toast />
    </View>
    </LinearGradient>
  );
};

export default RegisterScreen;
