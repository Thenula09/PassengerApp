import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const UserProfileScreen = () => {
  const [secureEntry, setSecureEntry] = useState(true);

  const [isValid, setIsValid] = useState(true);

  const [email, setEmail] = useState('');
  const validateEmail = (text) => {
    setEmail(text);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailPattern.test(text));
  };

  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (text) => {
    if (/[^0-9]/.test(text)) {
      setError('Only numbers allowed');
    } else {
      setError(''); // Clear the error if input is valid
    }

    // Remove any non-numeric characters
    const numericText = text.replace(/[^0-9]/g, '');
    setPhoneNumber(numericText);
  };


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
        <TouchableOpacity style={styles.editIcon}>
          <SimpleLineIcons name={'camera'} color={'white'} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Text style={styles.textLabel}>Your Username</Text>
        <View style={styles.inputContainer}>
          <Feather name={'user'} size={25} color={'lightgray'} />
          <TextInput
            style={styles.textInput}
            placeholder="Username"
            placeholderTextColor={'lightgray'}
          />
        </View>

        <Text style={styles.textLabel}>NIC number</Text>
        <View style={styles.inputContainer}>
          <Fontisto name={'person'} size={25} color={'lightgray'} />
          <TextInput
            style={styles.textInput}
            placeholder="NIC number"
            placeholderTextColor={'lightgray'}
          />
        </View>

        <Text style={styles.textLabel}>Mobile number</Text>
        <View style={styles.inputContainer}>
          <Foundation name={'telephone'} size={25} color={'lightgray'} />
          <TextInput
            style={[styles.textInput, error ? styles.errorInput : null]}
            placeholder="07x xxx xxxx"
            placeholderTextColor={'lightgray'}
            maxLength={10}
            keyboardType={'number-pad'}
            value={phoneNumber}
            onChangeText={handleInputChange}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        <Text style={styles.textLabel}>Email address</Text>
        <View style={styles.inputContainer}>
          <Fontisto name={'email'} size={25} color={'lightgray'} />
          <TextInput
            style={[styles.textInput, !isValid && styles.errorInput]}
            placeholder="user@domain.com"
            placeholderTextColor={'lightgray'}
            value={email}
            onChangeText={validateEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {!isValid && email.length > 0 && (
            <Text style={styles.errorText}>Invalid email format</Text>
          )}
        </View>

        <Text style={styles.textLabel}>Your password</Text>
        <View style={styles.inputContainer}>
          <Fontisto name={'locked'} size={25} color={'lightgray'} />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor={'lightgray'}
            secureTextEntry={secureEntry}
          />
          <TouchableOpacity
            onPress={() => {
              setSecureEntry((prev) => !prev);
            }}
          >
            <MaterialIcons name={'remove-red-eye'} size={20} color={'lightgray'} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.buttonSaveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default UserProfileScreen;
