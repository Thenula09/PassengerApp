import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../theme';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },

  // Decorative circles
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -50,
    right: -50,
  },
  circle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: 100,
    left: -30,
  },
  circle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: 200,
    right: 30,
  },

  // Logo Section
  logoContainer: {
    paddingTop: 60,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },

  // Content Section
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  welcomeTextContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 18,
    color: 'rgba(0, 0, 0, 0.9)',
    fontWeight: '500',
    marginBottom: 8,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.85)',
    marginBottom: 30,
  },

  // Features
  featuresContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  featureText: {
    fontSize: 15,
    color: '#1B5E20',
    fontWeight: '500',
  },

  // Image
  imageContainer: {
    alignItems: 'center',
    marginTop: 2,
  },
  welcomeImage: {
    width: width * 0.85,
    height: 180,
    resizeMode: 'contain',
  },

  // Buttons Section
  buttonsContainer: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    gap: 15,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    gap: 10,
  },
  loginText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffffff',
  },
  signUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 2,
    borderColor: '#1B5E20',
    gap: 10,
  },
  signUpText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },

  // Guest Section
  guestContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  guestText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.8)',
  },
  guestLink: {
    fontSize: 14,
    color: '#1B5E20',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
export default styles;
