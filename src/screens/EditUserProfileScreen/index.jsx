import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, StatusBar, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { uploadProfileImageToSupabase, deleteProfileImageFromSupabase } from '../../SupabaseConfig';

const EditUserProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({});
  const [imageUri, setImageUri] = useState(null);
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const uid = auth().currentUser?.uid;

  useEffect(() => {
    if (uid) {
      loadProfileImageFromCache();
      
      const userRef = database().ref(`/passenger/${uid}`);
      userRef.once('value', snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log('User data loaded for edit:', data);
          setUserData(data);
          setUsername(data.username || '');
          setMobile(data.mobile || '');
          setEmail(data.email || '');
          
          // Load cached image if available, else use Firebase image
          loadProfileImageFromCache().then(cachedUri => {
            if (!cachedUri && data.profileImage) {
              setImageUri(data.profileImage);
              saveProfileImageToCache(data.profileImage);
            }
          });
        } else {
          console.log('No user data found for editing');
        }
      });
    }
  }, [uid]);

  // Load profile image from device cache
  const loadProfileImageFromCache = async () => {
    try {
      const cachedImageUrl = await AsyncStorage.getItem(`profileImage_${uid}`);
      if (cachedImageUrl) {
        console.log('Loaded profile image from device cache');
        setImageUri(cachedImageUrl);
        return cachedImageUrl;
      }
      return null;
    } catch (error) {
      console.error('Error loading cached profile image:', error);
      return null;
    }
  };

  // Save profile image URL to device cache
  const saveProfileImageToCache = async (imageUrl) => {
    try {
      await AsyncStorage.setItem(`profileImage_${uid}`, imageUrl);
      console.log('Profile image URL saved to device cache');
    } catch (error) {
      console.error('Error saving profile image to cache:', error);
    }
  };

  const handleImagePick = async () => {
    try {
      const result = await launchImageLibrary({ 
        mediaType: 'photo',
        quality: 0.8,
      });

      if (result?.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const { uri } = asset;

        // Get the correct URI path
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        
        // Store local URI for preview
        setImageUri(uploadUri);

        Toast.show({
          type: 'info',
          text1: 'Photo Selected',
          text2: 'Save changes to upload the photo',
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to pick image: ' + error.message,
      });
    }
  };

  const uploadProfileImageToStorage = async (localUri) => {
    try {
      if (!localUri || localUri === userData.profileImage) {
        return userData.profileImage;
      }

      console.log('Starting image upload to Supabase from URI:', localUri);

      // Show upload progress
      Toast.show({
        type: 'info',
        text1: 'Uploading...',
        text2: 'Please wait while we upload your photo',
        duration: 3000,
      });

      // Upload to Supabase Storage
      const downloadURL = await uploadProfileImageToSupabase(uid, localUri);
      console.log('Image uploaded to Supabase:', downloadURL);

      // Delete old profile image from Supabase if it exists
      if (userData.profileImage && userData.profileImage !== downloadURL) {
        await deleteProfileImageFromSupabase(uid, userData.profileImage);
      }

      return downloadURL;
    } catch (error) {
      console.error('Error uploading image to Supabase:', error);
      console.error('Error message:', error.message);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!username || !mobile || !email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'All fields are required!',
      });
      return;
    }

    setIsLoading(true);

    try {
      let profileImageUrl = userData.profileImage;

      // Upload image to Firebase Storage if a new image was selected
      if (imageUri && imageUri !== userData.profileImage) {
        profileImageUrl = await uploadProfileImageToStorage(imageUri);
      }

      // Update user data in Realtime Database
      await database().ref(`/passenger/${uid}`).update({
        username,
        mobile,
        email,
        profileImage: profileImageUrl,
        profileUpdatedAt: new Date().toISOString(),
      });

      // Save to device cache
      if (profileImageUrl) {
        await saveProfileImageToCache(profileImageUrl);
      }

      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Profile updated successfully!',
      });

      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      console.error('Error saving profile:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update profile: ' + error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
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
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={styles.placeholder} />
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
          <Text style={styles.changePhotoText}>Tap to change photo</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account" size={22} color="#4CAF50" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter username"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="phone" size={22} color="#4CAF50" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter phone number"
                placeholderTextColor="#999"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email" size={22} color="#4CAF50" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter email address"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            disabled={isLoading}
          >
            <MaterialCommunityIcons name="content-save" size={22} color="white" />
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      <Toast />
    </View>
  );
};

export default EditUserProfileScreen;
