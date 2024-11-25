import { View,TouchableOpacity, TextInput, Text, Image } from 'react-native';
import React, { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();

  const arrowLogin = () => {
    navigation.navigate('Welcome');
  };

  const register = () => {
    navigation.navigate('Register');
  };

  const handleLogin = () => {
    navigation.navigate('Home');
  };

  const [secureEntry, setSecureEntry] = useState(true);

  return (
    <View style={styles.container}>
      {/*Arrow_back icon*/}
      <TouchableOpacity style={styles.backArrowContainer}>
        <Ionicons name={'arrow-back-outline'} color={'black'} size={30} onPress={arrowLogin}/>
      </TouchableOpacity>
       {/*Welcome message*/}
       <View style={styles.welcomeMsg}>
          <Text style={styles.welcomeText}>Hi, Welcome Back!</Text>
          <MaterialCommunityIcons name={'hand-wave'} size={30} color={'#FFBF00'} />
       </View>
      {/*Login Form*/}
      <View style={styles.form}>
        {/*User_name input box*/}
        <View style={styles.inputContainer}>
          <Feather name={'user'} size={25} color={'lightgray'}/>
        <TextInput style={styles.textInput} placeholder="Username" placeholderTextColor={'lightgray'}/>
        </View>
         {/*Password input box*/}
        <View style={styles.inputContainer}>
          <Fontisto name={'locked'} size={25} color={'lightgray'}/>
        <TextInput style={styles.textInput} placeholder="Password" placeholderTextColor={'lightgray'} secureTextEntry={secureEntry}/>
          {/*Eye icon*/}
        <TouchableOpacity onPress={() =>{
          setSecureEntry((prev) => !prev);
        }}>
           <MaterialIcons name={'remove-red-eye'} size={20} color={'lightgray'}/>
        </TouchableOpacity>
        </View>
           {/*Forgot Password label*/}
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
           {/*Login Button*/}
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.buttonLoginText} onPress={handleLogin}>Login</Text>
        </TouchableOpacity>
           {/*or continue with text*/}
        <Text style={styles.continueText}>or continue with</Text>
           {/*Google Button*/}
        <TouchableOpacity style={styles.googleButton}>
          <Image style={styles.googleLogo} source={require('../../assets/download.png')}/>
          <Text style={styles.buttonGoogleText}>Google</Text>
        </TouchableOpacity>
           {/*Login page bottom text label*/}
        <View style={styles.bottomText}>
            {/*Don't have account text*/}
           <Text style={styles.doNotAccountText}>Don't have an account?</Text>
            {/*signUp button label*/}
           <TouchableOpacity>
            <Text style={styles.bottomSignUp} onPress={register}>SignUp</Text>
           </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
