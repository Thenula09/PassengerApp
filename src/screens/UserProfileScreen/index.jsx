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
  const [userData, setUserData] = useState({});
  const [imageUri, setImageUri] = useState(null);
  
  // Current User UID ලබා ගැනීම
  const user = auth().currentUser;
  const uid = user ? user.uid : null;

  useEffect(() => {
    if (uid) {
      // 1. මුලින්ම Cache එකේ ඇති පරණ Image එක Load කිරීම
      loadProfileImageFromCache();
      
      // 2. Real-time Database එකට සම්බන්ධ වීම
      const userRef = database().ref(`/passenger/${uid}`);
      
      const onValueChange = userRef.on('value', snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log('User data loaded:', data);
          setUserData(data);
          
          // Firebase එකේ image එකක් තිබේ නම් එය පෙන්වීම සහ Cache කිරීම
          if (data.profileImage) {
            setImageUri(data.profileImage);
            saveProfileImageToCache(data.profileImage);
          }
        } else {
          console.log('No user data found for UID:', uid);
        }
      });
      
      // Screen එකෙන් ඉවත් වන විට listener එක නතර කිරීම
      return () => userRef.off('value', onValueChange);
    }
  }, [uid]);

  const loadProfileImageFromCache = async () => {
    try {
      const cachedImageUrl = await AsyncStorage.getItem(`profileImage_${uid}`);
      if (cachedImageUrl) {
        setImageUri(cachedImageUrl);
      }
    } catch (error) {
      console.error('Cache load error:', error);
    }
  };

  const saveProfileImageToCache = async (imageUrl) => {
    try {
      await AsyncStorage.setItem(`profileImage_${uid}`, imageUrl);
    } catch (error) {
      console.error('Cache save error:', error);
    }
  };

  const handleImagePick = async () => {
    // UID එක නැවත පරීක්ෂා කිරීම (undefined ගැටලුව මගහරවා ගැනීමට)
    if (!uid) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'User not authenticated' });
      return;
    }

    try {
      const result = await launchImageLibrary({ 
        mediaType: 'photo',
        quality: 0.7, // Size එක අඩු කිරීමට
      });

      if (result?.assets && result.assets.length > 0) {
        const { uri } = result.assets[0];

        Toast.show({
          type: 'info',
          text1: 'Uploading...',
          text2: 'Updating your profile picture',
        });

        // 1. Supabase එකට Upload කිරීම
        const downloadURL = await uploadProfileImageToSupabase(uid, uri);

        // 2. Firebase එකේ පවතින User node එකටම Update කිරීම
        // මෙහිදී image එක passenger/${uid} යටතටම යන බව සහතික කරයි
        await database().ref(`/passenger/${uid}`).update({ 
          profileImage: downloadURL,
          profileImageUpdatedAt: new Date().toISOString(),
        });

        setImageUri(downloadURL);
        await saveProfileImageToCache(downloadURL);

        Toast.show({
          type: 'success',
          text1: 'Success!',
          text2: 'Profile picture updated!',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: error.message,
      });
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    await auth().signOut();
    navigation.replace('Welcome');
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
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
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
          <Text style={styles.userName}>{userData.username || 'Loading...'}</Text>
          <Text style={styles.userEmail}>{userData.email || 'Please wait'}</Text>
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
            {/* Username Row */}
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

            {/* Mobile Row */}
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

            {/* Email Row */}
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

        {/* Settings / Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Destination')}>
            <View style={styles.actionIcon}>
              <MaterialCommunityIcons name="ticket" size={24} color="#4CAF50" />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>My Bookings</Text>
              <Text style={styles.actionSubtitle}>View booking history</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={22} color="white" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNavBar activeTab="Profile" />
      <Toast />
    </View>
  );
};

export default UserProfileScreen;