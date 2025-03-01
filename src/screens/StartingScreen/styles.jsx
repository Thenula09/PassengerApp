import { StyleSheet} from 'react-native';

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)', // Transparent white
        backdropFilter: 'blur(10px)',
    },
    image1:{
        width:350,
        height:350,
        resizeMode: 'contain',
    },
    image2:{
        width:350,
        height:350,
        resizeMode: 'contain',
    },
    image3:{
        width:350,
        height:350,
        resizeMode: 'contain',
    },
});
export default styles;

