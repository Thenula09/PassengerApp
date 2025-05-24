import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import React from 'react';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const UserProfileScreen = () => {
   const navigation = useNavigation();
    const arrowLogin = () => {
    navigation.navigate('Home');
  };

  return (
    <LinearGradient
      colors={['white', 'white','green']}
      style={styles.container}
    >
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backArrowContainer} onPress={arrowLogin}>
          <Ionicons name={'arrow-back-outline'} color={'black'} size={30} />
        </TouchableOpacity>
        <Text style={styles.profileText}>Profile</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={require('../../assets/images.jpeg')} style={styles.image} />
      </View>

      <View style={styles.form}>
        <Text style={styles.textLabel}>Username</Text>
        <View style={styles.inputContainer}>
          <Feather name={'user'} size={25} color={'gray'} />
          <TextInput
            style={styles.textInput} editable={false}
          />
        </View>

        <Text style={styles.textLabel}>Mobile number</Text>
        <View style={styles.inputContainer}>
          <Foundation name={'telephone'} size={25} color={'gray'} />
          <TextInput
            style={styles.textInput} editable={false}
          />
        </View>

        <Text style={styles.textLabel}>Email address</Text>
        <View style={styles.inputContainer}>
          <Fontisto name={'email'} size={25} color={'gray'} />
          <TextInput
            style={styles.textInput} editable={false}
          />
        </View>

        <Text style={styles.textLabel}>Your password</Text>
        <View style={styles.inputContainer}>
          <Fontisto name={'locked'} size={25} color={'gray'} />
          <TextInput
            style={styles.textInput}
            editable={false}
          />
          <TouchableOpacity>
            <MaterialIcons name={'remove-red-eye'} size={20} color={'gray'} />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.buttonLoginText}>Log out</Text>
        </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </LinearGradient>
  );
};

export default UserProfileScreen;
