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
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import { uploadProfileImageToSupabase } from '../../SupabaseConfig';
import BottomNavBar from '../../components/BottomNavBar';

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    mobile: '',
    profileImage: '',
    profileImageUpdatedAt: ''
  });
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = auth().currentUser;
    if (!currentUser) {
      console.log('No user is authenticated');
      navigation.replace('Welcome');
      return;
    }
    
    const userId = currentUser.uid;
    setUid(userId);
    console.log('Current user UID:', userId);
    
    loadUserProfile(userId);
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      setLoading(true);
      
      // Load from cache first
      await loadProfileImageFromCache(userId);
      
      // Load user data from Firebase
      const userRef = database().ref(`/passenger/${userId}`);
      userRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log('Firebase data:', data);
          
          // Update user data
          setUserData({
            username: data.username || '',
            email: data.email || '',
            mobile: data.mobile || '',
            profileImage: data.profileImage || '',
            profileImageUpdatedAt: data.profileImageUpdatedAt || ''
          });
          
          // Update image URI if Firebase has a newer one
          if (data.profileImage && data.profileImage !== imageUri) {
            console.log('Updating image from Firebase:', data.profileImage);
            setImageUri(data.profileImage);
            saveProfileImageToCache(userId, data.profileImage);
          }
        } else {
          console.log('No user data found in Firebase');
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'User data not found',
            duration: 3000,
          });
        }
        setLoading(false);
      }, (error) => {
        console.error('Firebase read error:', error);
        setLoading(false);
      });

      return () => userRef.off();
    } catch (error) {
      console.error('Error loading user profile:', error);
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load profile',
        duration: 3000,
      });
    }
  };

  // Load profile image from device cache
  const loadProfileImageFromCache = async (userId) => {
    try {
      const cachedImageUrl = await AsyncStorage.getItem(`profileImage_${userId}`);
      if (cachedImageUrl) {
        console.log('Loaded from cache:', cachedImageUrl);
        setImageUri(cachedImageUrl);
      }
    } catch (error) {
      console.error('Error loading cached profile image:', error);
    }
  };

  // Save profile image URL to device cache
  const saveProfileImageToCache = async (userId, imageUrl) => {
    try {
      await AsyncStorage.setItem(`profileImage_${userId}`, imageUrl);
      console.log('Saved to cache:', imageUrl);
    } catch (error) {
      console.error('Error saving profile image to cache:', error);
    }
  };

  const handleImagePick = async () => {
    try {
      if (!uid) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'User not authenticated',
          duration: 3000,
        });
        return;
      }

      const result = await launchImageLibrary({ 
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result?.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const { uri } = asset;

        console.log('Image selected:', uri);

        // Show loading
        Toast.show({
          type: 'info',
          text1: 'Uploading...',
          text2: 'Please wait while we upload your photo',
        });

        // Upload to Supabase Storage
        const downloadURL = await uploadProfileImageToSupabase(uid, uri);
        console.log('Image uploaded to Supabase:', downloadURL);

        const updateData = {
          profileImage: downloadURL,
          profileImageUpdatedAt: new Date().toISOString(),
        };

        // Update user data in Firebase Realtime Database
        await database().ref(`/passenger/${uid}`).update(updateData);

        // Save to device cache
        await saveProfileImageToCache(uid, downloadURL);

        // Update local state
        setImageUri(downloadURL);
        setUserData(prev => ({
          ...prev,
          ...updateData
        }));

        Toast.show({
          type: 'success',
          text1: 'Success!',
          text2: 'Profile picture updated successfully!',
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to upload image',
        duration: 3000,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('isLoggedIn');
      await AsyncStorage.removeItem('userEmail');
      await auth().signOut();
      Toast.show({
        type: 'success',
        text1: 'Logged out',
        text2: 'You have been logged out successfully',
        duration: 2000,
      });
      navigation.replace('Welcome');
    } catch (error) {
      console.error('Logout error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to logout',
        duration: 3000,
      });
    }
  };

  const handleEditProfile = () => {
    if (!uid) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please login first',
        duration: 3000,
      });
      return;
    }
    navigation.navigate('EditProfile', { userData });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

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
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
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
                imageUri 
                  ? { uri: imageUri } 
                  : require('../../assets/images.jpeg')
              }
              style={styles.profileImage}
              defaultSource={require('../../assets/images.jpeg')}
            />
            <TouchableOpacity style={styles.cameraButton} onPress={handleImagePick}>
              <MaterialCommunityIcons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userData.username || 'User Name'}</Text>
          <Text style={styles.userEmail}>{userData.email || 'No email'}</Text>
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
                <Text style={styles.infoValue}>{userData.mobile || 'Not set'}</Text>
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
          <Text style={styles.sectionTitle}>Settings</Text>
          
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

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          disabled={loading}
        >
          <MaterialCommunityIcons name="logout" size={22} color="white" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavBar activeTab="Profile" />

      <Toast />
    </View>
  );
};

export default UserProfileScreen;