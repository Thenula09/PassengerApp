import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <LinearGradient
      colors={['white', 'white','green']}
      style={styles.container}
    >
      {/*Title of app*/}
      <View>
        <Image source={require('../../assets/logo2.png')} style={styles.logoImage} />
      </View>
      <View style={styles.text}>
        {/*<View style={styles.tiImg}>
          <Text style={styles.title}>Get Started</Text>
          <Text style={styles.img}>🚌.....</Text>
        </View>*/}
        <Text style={styles.description}>Begin your journey now</Text>
      </View>

      {/*Home image*/}
      <Image source={require('../../assets/welcome.png')} style={styles.welcomeImage} />

      {/*Login Button*/}
      <TouchableOpacity style={styles.loginButtonWrapper} onPress={handleLogin}>
        <Text style={styles.loginText}>Sign in</Text>
      </TouchableOpacity>

      {/*SignUp Button*/}
      <TouchableOpacity style={styles.signUpButtonWrapper} onPress={handleRegister}>
        <Text style={styles.signUpText}>Sign up</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default WelcomeScreen;
