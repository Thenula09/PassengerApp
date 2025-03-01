import { View, Text } from 'react-native'
import React from 'react'
import styles from './styles';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const index = () => {
     const navigation = useNavigation();
    
      const handleLogin = () => {
        navigation.navigate('Welcome');
      };
    
  return (
    <LinearGradient
    colors={['#6DD5FA', '#C471ED', '#F64F59']}
      style={styles.container}
    >
  
    </LinearGradient>
  )
}

export default index