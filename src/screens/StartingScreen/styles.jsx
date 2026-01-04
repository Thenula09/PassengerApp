import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../theme';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.background
    },
    
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginBottom: 20,
    },
    
    imageShadow: {
        position: 'absolute',
        width: width * 0.8,
        height: 20,
        backgroundColor: 'rgba(0,0,0,0.08)',
        borderRadius: 100,
        bottom: -10,
        transform: [{ scaleX: 1.2 }],
    },
    
    image1: {
        width: width * 0.85,
        height: height * 0.4,
        resizeMode: 'contain',
    },
    
    image2: {
        width: width * 0.85,
        height: height * 0.4,
        resizeMode: 'contain',
    },
    
    image3: {
        width: width * 0.85,
        height: height * 0.4,
        resizeMode: 'contain',
    },
});

export default styles;

