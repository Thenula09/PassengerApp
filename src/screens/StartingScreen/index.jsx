import { View, Text, TouchableOpacity, Animated, Dimensions, StatusBar } from 'react-native';
import React, { useRef, useEffect } from 'react';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Onboarding from 'react-native-onboarding-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable'; // Animation සඳහා

const { width } = Dimensions.get('window');

// --- Custom Components ---

const SquareDot = ({ isLight, selected }) => {
  const backgroundColor = selected ? '#1B5E20' : 'rgba(0, 0, 0, 0.1)';
  const widthAnim = useRef(new Animated.Value(selected ? 20 : 8)).current;

  useEffect(() => {
    Animated.spring(widthAnim, {
      toValue: selected ? 25 : 8,
      useNativeDriver: false,
    }).start();
  }, [selected]);

  return (
    <Animated.View
      style={{
        width: widthAnim,
        height: 8,
        marginHorizontal: 4,
        borderRadius: 4,
        backgroundColor,
      }}
    />
  );
};

const DoneButton = ({ ...rest }) => (
  <TouchableOpacity {...rest} style={styles.doneButton}>
    <LinearGradient
      colors={['#43A047', '#1B5E20']}
      style={styles.gradientButton}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Text style={styles.doneButtonText}>Get Started</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const NextButton = ({ ...rest }) => (
  <TouchableOpacity {...rest} style={styles.nextButton}>
    <Text style={styles.nextButtonText}>Next</Text>
  </TouchableOpacity>
);

const Start = () => {
  const navigation = useNavigation();

  const handleComplete = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    navigation.replace('Welcome');
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
      
      <LinearGradient
       colors={['#E8F5E9', '#C8E6C9', '#81C784']}
        style={{ flex: 1 }}
      >
        <Onboarding
          DotComponent={SquareDot}
          NextButtonComponent={NextButton}
          DoneButtonComponent={DoneButton}
          onSkip={handleComplete}
          onDone={handleComplete}
          bottomBarHeight={100}
          containerStyles={styles.onboardingContainer}
          titleStyles={styles.title}
          subTitleStyles={styles.subtitle}
          pages={[
            {
              backgroundColor: 'transparent',
              image: (
                <Animatable.View animation="bounceIn" duration={1500} style={styles.imageWrapper}>
                  <View style={styles.circleBg} />
                  <Animated.Image 
                    source={require('../../assets/image1.png')} 
                    style={styles.imageStyle} 
                  />
                </Animatable.View>
              ),
              title: 'Live Tracking',
              subtitle: 'Track your bus in real-time with precise GPS location updates.',
            },
            {
              backgroundColor: 'transparent',
              image: (
                <Animatable.View animation="fadeInUp" duration={1000} style={styles.imageWrapper}>
                  <View style={[styles.circleBg, { backgroundColor: '#A5D6A7' }]} />
                  <Animated.Image 
                    source={require('../../assets/image2.png')} 
                    style={styles.imageStyle} 
                  />
                </Animatable.View>
              ),
              title: 'Instant Booking',
              subtitle: 'Secure your favorite seat and pay digitally in seconds.',
            },
            {
              backgroundColor: 'transparent',
              image: (
                <Animatable.View animation="zoomIn" duration={1000} style={styles.imageWrapper}>
                  <View style={[styles.circleBg, { backgroundColor: '#81C784' }]} />
                  <Animated.Image 
                    source={require('../../assets/image3.png')} 
                    style={styles.imageStyle} 
                  />
                </Animatable.View>
              ),
              title: 'Easy Planning',
              subtitle: 'Plan your trips with up-to-date schedules and routes.',
            },
          ]}
        />
      </LinearGradient>
    </View>
  );
};

export default Start;