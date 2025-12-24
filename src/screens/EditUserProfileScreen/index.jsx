import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, StatusBar, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';

const EditUserProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({});
  const [imageUri, setImageUri] = useState(null);
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const uid = auth().currentUser?.uid;

  useEffect(() => {
    if (uid) {
      const userRef = database().ref(`users/${uid}`);
      userRef.once('value', snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);
          setUsername(data.username || '');
          setPhone(data.phone || '');
          setEmail(data.email || '');
          setImageUri(data.profileImage || null);
        }
      });
    }
  }, [uid]);

  const handleImagePick = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result?.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      const { uri, fileName } = asset;
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      setImageUri(uploadUri);
    }
  };

  const handleSave = async () => {
    if (!username || !phone || !email) {
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

      if (imageUri && imageUri !== userData.profileImage) {
        const fileName = `profile_${uid}_${Date.now()}.jpg`;
        const reference = storage().ref(`/profileImages/${uid}/${fileName}`);
        await reference.putFile(imageUri);
        profileImageUrl = await reference.getDownloadURL();
      }

      await database().ref(`users/${uid}`).update({
        username,
        phone,
        email,
        profileImage: profileImageUrl,
      });

      Toast.show({
        type: 'success',
        text1: 'Success!',
        text2: 'Profile updated successfully!',
      });

      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
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
                value={phone}
                onChangeText={setPhone}
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
