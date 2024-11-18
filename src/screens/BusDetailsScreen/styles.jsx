import { StyleSheet} from 'react-native';

const styles = StyleSheet.create({
map: {
     ...StyleSheet.absoluteFillObject,
},
homeMap:{
     height:450,
     backgroundColor:'lightblue',
     borderRadius:25,
     margin:5,
},
availableBuses:{
     fontSize:25,
     fontFamily:'serif',
     textAlign:'center',
     fontWeight:'bold',
     marginTop:10,
     textDecorationLine:'underline',
},
});
export default styles;

