import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import React, { useRef, useEffect } from 'react';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Onboarding from 'react-native-onboarding-swiper';

const DoneButtonComponent = ({ ...rest }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 40,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        {...rest}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ 
          marginHorizontal: 20,
          backgroundColor: '#4CAF50',
          paddingHorizontal: 25,
          paddingVertical: 12,
          borderRadius: 25,
          elevation: 3,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
        }}
      >
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Get Started</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const SkipButtonComponent = ({ ...rest }) => {
  return (
    <TouchableOpacity 
      {...rest} 
      style={{ 
        marginHorizontal: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
      }}
    >
      <Text style={{ color: '#666', fontSize: 15, fontWeight: '600' }}>Skip</Text>
    </TouchableOpacity>
  );
};

const NextButtonComponent = ({ ...rest }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 40,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        {...rest}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{ 
          marginHorizontal: 20,
          backgroundColor: '#4CAF50',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 20,
          elevation: 2,
        }}
      >
        <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold' }}>Next</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const AnimatedImage = ({ source, style }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.Image
      source={source}
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: slideAnim },
          ],
        },
      ]}
    />
  );
};

const Start = () => {
  const navigation = useNavigation();
  const gradientAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Gradient animation that loops
    Animated.loop(
      Animated.sequence([
        Animated.timing(gradientAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.timing(gradientAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Subtle pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const onSkip = () => {
    navigation.navigate('Welcome');
  };

  const onDone = () => {
    navigation.navigate('Welcome');
  };

  // Interpolate colors for smooth gradient animation
  const animatedColors = [
    gradientAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['#E8F5E9', '#A5D6A7', '#E8F5E9'],
    }),
    gradientAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['#C8E6C9', '#81C784', '#C8E6C9'],
    }),
    gradientAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['#81C784', '#66BB6A', '#81C784'],
    }),
  ];

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale: pulseAnim }] }}>
      <LinearGradient
        colors={['#E8F5E9', '#C8E6C9', '#81C784']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View 
          style={{ 
            ...StyleSheet.absoluteFillObject, 
            opacity: gradientAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.3],
            }),
            backgroundColor: '#66BB6A',
          }} 
        />
        <Onboarding
          DoneButtonComponent={DoneButtonComponent}
          SkipButtonComponent={SkipButtonComponent}
          NextButtonComponent={NextButtonComponent}
          onSkip={onSkip}
          onDone={onDone}
          bottomBarHeight={80}
          bottomBarColor="transparent"
          containerStyles={{ 
            backgroundColor: 'transparent',
            paddingHorizontal: 15,
          }} 
          imageContainerStyles={{
          paddingBottom: 20,
        }}
        titleStyles={{
          fontSize: 28,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#1B5E20',
          marginTop: 20,
          paddingHorizontal: 20,
        }}
        subTitleStyles={{
          fontSize: 16,
          textAlign: 'center',
          color: '#2E7D32',
          paddingHorizontal: 30,
          marginTop: 10,
          lineHeight: 24,
        }}
        pages={[
          {
            backgroundColor: 'transparent',
            image: (
              <View style={styles.imageContainer}>
                <View style={styles.imageShadow} />
                <AnimatedImage source={require('../../assets/image1.png')} style={styles.image1} />
              </View>
            ),
            title: '🚍 Track Your Bus in Real-Time',
            subtitle:
              'See your bus moving live on the map, track its exact location, and check for any delays — all in real-time.',
          },
          {
            backgroundColor: 'transparent',
            image: (
              <View style={styles.imageContainer}>
                <View style={styles.imageShadow} />
                <AnimatedImage source={require('../../assets/image2.png')} style={styles.image2} />
              </View>
            ),
            title: '💳 Reserve Seats & Pay Online',
            subtitle:
              'Easily reserve your seats and confirm your booking with secure online payments. Book with confidence and peace of mind.',
          },
          {
            backgroundColor: 'transparent',
            image: (
              <View style={styles.imageContainer}>
                <View style={styles.imageShadow} />
                <AnimatedImage source={require('../../assets/image3.png')} style={styles.image3} />
              </View>
            ),
            title: '🗺️ Plan Your Journey with Ease',
            subtitle:
              'Check bus schedules, seat availability, and routes — all in one place, making your travel planning simple and stress-free.',
          },
        ]}
      />
    </LinearGradient>
    </Animated.View>
  );
};

export default Start;
