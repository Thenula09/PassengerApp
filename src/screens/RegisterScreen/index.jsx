import { View,TouchableOpacity, TextInput, Text, Image } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';

const RegisterScreen = () => {
  const navigation = useNavigation();

  const arrowLogin = () => {
    navigation.navigate('Welcome');
  };

  const Login = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
       {/*Arrow_back icon*/}
      <TouchableOpacity style={styles.backArrowContainer} onPress={arrowLogin}>
        <Ionicons name={'arrow-back-outline'} color={'black'} size={30} />
      </TouchableOpacity>
       {/*Welcome message*/}
          <Text style={styles.welcomeText}>Get Start Now!</Text>
       {/*Register form*/}
      <View style={styles.form}>
         {/*User_name input box*/}
        <View style={styles.inputContainer}>
          <Feather name={'user'} size={25} color={'lightgray'}/>
        <TextInput style={styles.textInput} placeholder="Enter Username" placeholderTextColor={'lightgray'}/>
        </View>
         {/*Password input box*/}
        <View style={styles.inputContainer}>
          <Fontisto name={'locked'} size={25} color={'lightgray'}/>
        <TextInput style={styles.textInput} placeholder="Enter password" placeholderTextColor={'lightgray'} />
        </View>
         {/*NIC number input box*/}
        <View style={styles.inputContainer}>
          <Fontisto name={'person'} size={25} color={'lightgray'}/>
        <TextInput style={styles.textInput} placeholder="Enter your nic number" placeholderTextColor={'lightgray'}/>
        </View>
         {/*Mobile_no input box*/}
        <View style={styles.inputContainer}>
          <Foundation name={'telephone'} size={25} color={'lightgray'}/>
        <TextInput style={styles.textInput} placeholder="Enter your mobile number" placeholderTextColor={'lightgray'} keyboardType={'number-pad'}/>
        </View>
         {/*Email input box*/}
        <View style={styles.inputContainer}>
          <Fontisto name={'email'} size={25} color={'lightgray'}/>
        <TextInput style={styles.textInput} placeholder="Enter your email" placeholderTextColor={'lightgray'}/>
        </View>
         {/*SignUp button*/}
        <TouchableOpacity style={styles.signUpButton}>
          <Text style={styles.buttonSignUpText}>SignUp</Text>
        </TouchableOpacity>
         {/*or continue with text*/}
        <Text style={styles.continueText}>or continue with</Text>
         {/*Google button*/}
        <TouchableOpacity style={styles.googleButton}>
          {/*Google logo*/}
          <Image style={styles.googleLogo} source={require('../../assets/download.png')}/>
          <Text style={styles.buttonGoogleText}>Google</Text>
        </TouchableOpacity>
         {/*Already have account text*/}
        <View style={styles.bottomText}>
           <Text style={styles.alreadyAccountText}>Already have an account?</Text>
         {/*Login button label*/}
           <TouchableOpacity>
            <Text style={styles.bottomLogin} onPress={Login}>Login</Text>
           </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RegisterScreen;
