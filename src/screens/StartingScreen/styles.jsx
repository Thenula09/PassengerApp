import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  onboardingContainer: {
    paddingBottom: 60,
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBg: {
    position: 'absolute',
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    backgroundColor: '#C8E6C9',
    opacity: 0.5,
  },
  imageStyle: {
    width: width * 0.8,
    height: height * 0.35,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1B5E20',
    fontFamily: Platform.OS === 'ios' ? 'Arial Rounded MT Bold' : 'sans-serif-condensed',
  },
  subtitle: {
    fontSize: 16,
    color: '#455A64',
    paddingHorizontal: 40,
    lineHeight: 24,
    marginTop: 10,
  },
  // Buttons
  nextButton: {
    marginRight: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  doneButton: {
    marginRight: 20,
    overflow: 'hidden',
    borderRadius: 15,
  },
  gradientButton: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});