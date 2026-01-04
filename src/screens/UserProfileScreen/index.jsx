import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Platform
} from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({});
  const [imageUri, setImageUri] = useState(null);
  const [activeTab, setActiveTab] = useState('Profile');

  const uid = auth().currentUser?.uid;

  useEffect(() => {
    if (uid) {
      const userRef = database().ref(`users/${uid}`);
      userRef.on('value', snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);
          setImageUri(data.profileImage || null);
        }
      });
    }
  }, []);

  const handleImagePick = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result?.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const { uri, fileName } = asset;
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      const reference = storage().ref(`/profileImages/${uid}/${fileName}`);

      await reference.putFile(uploadUri);
      const downloadURL = await reference.getDownloadURL();

      await database().ref(`users/${uid}`).update({ profileImage: downloadURL });
      setImageUri(downloadURL);
      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Profile picture updated!'
      });
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('userEmail');
    await auth().signOut();
    navigation.replace('Welcome');
  };

  const arrowLogin = () => {
    navigation.navigate('Home');
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const goToBooking = () => {
    setActiveTab('Booking');
    navigation.navigate('Destination');
  };

  const goToBusDetails = () => {
    setActiveTab('BusDetails');
    navigation.navigate('Bus Details');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      <LinearGradient
        colors={['#1B5E20', '#2E7D32', '#388E3C']}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={arrowLogin}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <MaterialIcons name="edit" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.imageWrapper}>
            <Image
              source={
                imageUri ? { uri: imageUri } : require('../../assets/images.jpeg')
              }
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraButton} onPress={handleImagePick}>
              <MaterialCommunityIcons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userData.username || 'User'}</Text>
          <Text style={styles.userEmail}>{userData.email || 'email@example.com'}</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="account" size={22} color="#4CAF50" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Username</Text>
                <Text style={styles.infoValue}>{userData.username || 'Not set'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="phone" size={22} color="#4CAF50" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{userData.phone || 'Not set'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="email" size={22} color="#4CAF50" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>{userData.email || 'Not set'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="ticket" size={24} color="#4CAF50" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>My Bookings</Text>
              <Text style={styles.actionSubtitle}>View booking history</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="heart" size={24} color="#4CAF50" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Saved Routes</Text>
              <Text style={styles.actionSubtitle}>Your favorite routes</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="cog" size={24} color="#4CAF50" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Settings</Text>
              <Text style={styles.actionSubtitle}>App preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={22} color="white" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={[styles.navButton, activeTab === 'Home' && styles.activeTab]}
          onPress={arrowLogin}>
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
          onPress={() => setActiveTab('Profile')}>
          <FontAwesome5 name={activeTab === 'Profile' ? 'user-alt' : 'user'} size={22} color={activeTab === 'Profile' ? '#4CAF50' : '#666'} />
          <Text style={[styles.navText, activeTab === 'Profile' && styles.activeNavText]}>Profile</Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </View>
  );
};

export default UserProfileScreen;
