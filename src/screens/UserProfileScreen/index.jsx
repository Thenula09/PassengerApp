import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({});
  const [imageUri, setImageUri] = useState(null);

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
      Alert.alert('Profile picture updated!');
    }
  };

  const handleLogout = async () => {
    await auth().signOut();
    navigation.replace('Login');
  };

  const arrowLogin = () => {
    navigation.navigate('Home');
  };

  return (
    <LinearGradient colors={['white', 'white', 'green']} style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backArrowContainer} onPress={arrowLogin}>
            <Ionicons name={'arrow-back-outline'} color={'black'} size={30} />
          </TouchableOpacity>
          <Text style={styles.profileText}>Profile</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={
              imageUri ? { uri: imageUri } : require('../../assets/images.jpeg')
            }
            style={styles.image}
          />
          <TouchableOpacity style={styles.editIcon} onPress={handleImagePick}>
            <MaterialIcons name="edit" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.textLabel}>Username</Text>
          <View style={styles.inputContainer}>
            <Feather name={'user'} size={25} color={'gray'} />
            <TextInput
              style={styles.textInput}
              editable={false}
              value={userData.username || ''}
            />
          </View>

          <Text style={styles.textLabel}>Mobile number</Text>
          <View style={styles.inputContainer}>
            <Foundation name={'telephone'} size={25} color={'gray'} />
            <TextInput
              style={styles.textInput}
              editable={false}
              value={userData.phone || ''}
            />
          </View>

          <Text style={styles.textLabel}>Email address</Text>
          <View style={styles.inputContainer}>
            <Fontisto name={'email'} size={25} color={'gray'} />
            <TextInput
              style={styles.textInput}
              editable={false}
              value={userData.email || ''}
            />
          </View>

          <Text style={styles.textLabel}>Your password</Text>
          <View style={styles.inputContainer}>
            <Fontisto name={'locked'} size={25} color={'gray'} />
            <TextInput
              style={styles.textInput}
              editable={false}
              value={'**'}
              secureTextEntry
            />
            <TouchableOpacity>
              <MaterialIcons name={'remove-red-eye'} size={20} color={'gray'} />
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogout}>
              <Text style={styles.buttonLoginText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default UserProfileScreen;
