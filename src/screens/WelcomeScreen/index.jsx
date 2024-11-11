import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import styles from './styles';

const WelcomeScreen = () => {

  return (
    <View style={styles.container}>
       {/*Title of app*/}
      <Text style={styles.title}>Highway Bus Tracking App</Text>
       {/*Home image*/}
      <Image source={require('../../assets/tm_img.jpg')} style={styles.welcomeImage}/>
       {/*Page bottom text*/}
      <Text style={styles.description}>Begin Your Journey Now </Text>
       {/*SignUp & login button container*/}
      <View style={styles.buttonContainer}>
         {/*Login Button*/}
         <TouchableOpacity style={styles.loginButtonWrapper}>
          <Text style={styles.loginText}>Login</Text>
         </TouchableOpacity>
         {/*SignUp Button*/}
         <TouchableOpacity style={styles.signUpButtonWrapper} >
          <Text style={styles.signUpText}>Sign-Up</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;
