import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import React from 'react';
import styles from './styles';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {

  const navigation = useNavigation();

  const gotoSearch = () => {
    navigation.navigate('Destination Search');
  };


  return (
    <View style={styles.container}>
    <View style={styles.homeMap}>
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
    </View>
    <View style={styles.message}>
      <Text style={styles.title}>Travel with Highway bus</Text>
      <Text style={styles.field}>Help flatten to the curve, if you must travel.please exercise caution for your safety and the safety of our community.</Text>
      <TouchableOpacity>
      <View style={styles.learnContainer}>
      <Text style={styles.learnMore}>Learn more</Text>
      <AntDesign name={'arrowright'} size={20} color={'white'}/>
      </View>
      </TouchableOpacity>
    </View>
    {/*  Input Box */}
    <Pressable style={styles.inputBox} onPress={gotoSearch}>
        <Text style={styles.inputText}>Where To?</Text>

        <View style={styles.timeContainer}>
          <AntDesign name={'clockcircle'} size={16} color={'#535353'} />
          <Text>Now</Text>
          <MaterialIcons name={'keyboard-arrow-down'} size={16} />
        </View>
      </Pressable>

      {/* Previous destination */}
      <View style={styles.row}>
        <View style={styles.iconContainer}>
          <AntDesign name={'clockcircle'} size={20} color={'#ffffff'} />
        </View>
        <Text style={styles.destinationText}>Spin Nightclub</Text>
      </View>

      {/* Home destination */}
      <View style={styles.row}>
        <View style={[styles.iconContainer, {backgroundColor: 'black'}]}>
          <Entypo name={'home'} size={20} color={'#ffffff'} />
        </View>
        <Text style={styles.destinationText}>Matara Bus Stand</Text>
      </View>
    </View>
  );
};

export default HomeScreen;
