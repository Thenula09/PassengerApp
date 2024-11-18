import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import React from 'react';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const UserProfileScreen = () => {

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backArrowContainer}>
          <Ionicons name={'arrow-back-outline'} color={'black'} size={30} />
        </TouchableOpacity>
        <Text style={styles.profileText}>Profile</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image source={require('../../assets/images.jpeg')} style={styles.image} />
      </View>

      <View style={styles.form}>
        <Text style={styles.textLabel}>Your Username</Text>
        <View style={styles.inputContainer}>
          <Feather name={'user'} size={25} color={'lightgray'} />
          <TextInput
            style={styles.textInput} editable={false}
          />
        </View>

        <Text style={styles.textLabel}>NIC number</Text>
        <View style={styles.inputContainer}>
          <Fontisto name={'person'} size={25} color={'lightgray'} />
          <TextInput
            style={styles.textInput} editable={false}
          />
        </View>

        <Text style={styles.textLabel}>Mobile number</Text>
        <View style={styles.inputContainer}>
          <Foundation name={'telephone'} size={25} color={'lightgray'} />
          <TextInput
            style={styles.textInput} editable={false}
          />
        </View>

        <Text style={styles.textLabel}>Email address</Text>
        <View style={styles.inputContainer}>
          <Fontisto name={'email'} size={25} color={'lightgray'} />
          <TextInput
            style={styles.textInput} editable={false}
          />
        </View>

        <Text style={styles.textLabel}>Your password</Text>
        <View style={styles.inputContainer}>
          <Fontisto name={'locked'} size={25} color={'lightgray'} />
          <TextInput
            style={styles.textInput}
            editable={false}
          />
          <TouchableOpacity>
            <MaterialIcons name={'remove-red-eye'} size={20} color={'lightgray'} />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.buttonLoginText}>Log out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.buttonLoginText}>Edit</Text>
        </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserProfileScreen;
