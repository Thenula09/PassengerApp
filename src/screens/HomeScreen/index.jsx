import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Pressable, ScrollView, StatusBar } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Home');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const goToUserProfile = () => {
    setActiveTab('Profile');
    navigation.navigate('Profile');
  };

  const goToBooking = () => {
    setActiveTab('Booking');
    navigation.navigate('Receipt');
  };

  const goToBusDetails = () => {
    setActiveTab('BusDetails');
    navigation.navigate('Bus Details');
  };

  const gotoSearch = () => {
    navigation.navigate('Destination Search');
  };

  const quickActions = [
    { id: 1, icon: 'ticket', label: 'Book Ticket', color: '#4CAF50', onPress: gotoSearch },
    { id: 2, icon: 'bus', label: 'Track Bus', color: '#FF9800', onPress: goToBusDetails },
    { id: 3, icon: 'clock-time-four', label: 'Schedule', color: '#2196F3', onPress: () => {} },
    { id: 4, icon: 'map-marker', label: 'Routes', color: '#E91E63', onPress: () => {} },
  ];

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      {/* Header Section */}
      <LinearGradient 
        colors={['#4CAF50', '#45a049', '#388E3C']} 
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greetingText}>{greeting} 👋</Text>
            <Text style={styles.headerSubText}>Where do you want to go?</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={26} color="white" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Box */}
        <Pressable style={styles.searchBox} onPress={gotoSearch}>
          <Ionicons name="search" size={22} color="#4CAF50" />
          <Text style={styles.searchText}>Search destinations...</Text>
          <AntDesign name="arrowright" size={20} color="#4CAF50" />
        </Pressable>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={action.onPress}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                  <MaterialCommunityIcons name={action.icon} size={28} color={action.color} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <Text style={styles.sectionTitle}>Nearby Buses</Text>
          <View style={styles.mapWrapper}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              showsUserLocation={true}
              region={{
                latitude: 5.9431,
                longitude: 80.5490,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}
            />
            <TouchableOpacity style={styles.mapOverlay}>
              <MaterialCommunityIcons name="fullscreen" size={24} color="#4CAF50" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoCard}>
          <LinearGradient
            colors={['#1B5E20', '#2E7D32', '#388E3C']}
            style={styles.infoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.infoContent}>
              <View style={styles.infoIcon}>
                <Ionicons name="bus" size={32} color="white" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Travel with Highway Bus</Text>
                <Text style={styles.infoDescription}>
                  Book your seat in advance and enjoy a safe, comfortable journey
                </Text>
                <TouchableOpacity style={styles.learnMoreBtn}>
                  <Text style={styles.learnMoreText}>Learn more</Text>
                  <AntDesign name="arrowright" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Features Section */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Why Choose Us?</Text>
          <View style={styles.featuresList}>
            {[
              { icon: 'shield-check', title: 'Safe Travel', desc: 'Your safety is our priority' },
              { icon: 'clock-fast', title: 'On Time', desc: 'Always punctual service' },
              { icon: 'wallet', title: 'Best Price', desc: 'Affordable fares' },
            ].map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <MaterialCommunityIcons name={feature.icon} size={24} color="#4CAF50" />
                </View>
                <View style={styles.featureTextContainer}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc}>{feature.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'Home' && styles.activeTab]}
          onPress={() => setActiveTab('Home')}>
          <Ionicons name={activeTab === 'Home' ? 'home' : 'home-outline'} size={24} color={activeTab === 'Home' ? '#4CAF50' : '#666'} />
          <Text style={[styles.navText, activeTab === 'Home' && styles.activeNavText]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, activeTab === 'Booking' && styles.activeTab]}
          onPress={goToBooking}>
          <AntDesign name="calendar" size={24} color={activeTab === 'Booking' ? '#4CAF50' : '#666'} />
          <Text style={[styles.navText, activeTab === 'Booking' && styles.activeNavText]}>Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, activeTab === 'BusDetails' && styles.activeTab]}
          onPress={goToBusDetails}>
          <Ionicons name={activeTab === 'BusDetails' ? 'bus' : 'bus-outline'} size={24} color={activeTab === 'BusDetails' ? '#4CAF50' : '#666'} />
          <Text style={[styles.navText, activeTab === 'BusDetails' && styles.activeNavText]}>Buses</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, activeTab === 'Profile' && styles.activeTab]}
          onPress={goToUserProfile}>
          <FontAwesome5 name={activeTab === 'Profile' ? 'user-alt' : 'user'} size={22} color={activeTab === 'Profile' ? '#4CAF50' : '#666'} />
          <Text style={[styles.navText, activeTab === 'Profile' && styles.activeNavText]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;
