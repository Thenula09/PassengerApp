import { View, Text } from 'react-native'
import React from 'react'
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';

const AppScreen = () => {
  return (
    <LinearGradient
    colors={['#6DD5FA', '#C471ED', '#F64F59']}
      style={styles.container}
    ></LinearGradient>
  )
}

export default AppScreen