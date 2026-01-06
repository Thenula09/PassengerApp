import { View, Text, Image, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import React from 'react';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { height } = Dimensions.get('window');

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <LinearGradient
        colors={['#1B5E20', '#2E7D32', '#388E3C', '#4CAF50']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative circles */}
        <View style={styles.circle1} />
        <View style={styles.circle2} />
        <View style={styles.circle3} />

        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image source={require('../../assets/logo2.png')} style={styles.logoImage} />
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>Welcome to</Text>
            <Text style={styles.appName}>BusLanka 🚌</Text>
            <Text style={styles.tagline}>Your journey begins here</Text>
            
            {/* Features */}
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                </View>
                <Text style={styles.featureText}>Easy booking</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                </View>
                <Text style={styles.featureText}>Real-time tracking</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                </View>
                <Text style={styles.featureText}>Secure payments</Text>
              </View>
            </View>
          </View>

          {/* Welcome Image */}
          <View style={styles.imageContainer}>
            <Image source={require('../../assets/welcome.png')} style={styles.welcomeImage} />
          </View>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={handleLogin}>
            <LinearGradient
              colors={['#FFFFFF', '#F5F5F5']}
              style={styles.loginButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.loginText}>Sign In</Text>
              <Ionicons name="arrow-forward" size={22} color="#1B5E20" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signUpButton} onPress={handleRegister}>
            <Text style={styles.signUpText}>Create Account</Text>
            <MaterialCommunityIcons name="account-plus" size={22} color="white" />
          </TouchableOpacity>

          <View style={styles.guestContainer}>
            <Text style={styles.guestText}>First time here? </Text>
            <TouchableOpacity>
              <Text style={styles.guestLink}>Explore as guest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default WelcomeScreen;
