import { StyleSheet} from 'react-native';

const styles = StyleSheet.create({
map: {
     ...StyleSheet.absoluteFillObject,
},
container:{
     flex:1,
},
backArrowContainer:{
     height:40,
     width:40,
     justifyContent:'center',
     alignItems:'center',
     marginVertical:20,
 },
availableBuses:{
     fontSize:25,
     fontFamily:'serif',
     textAlign:'center',
     fontWeight:'bold',
     marginTop:10,
     textDecorationLine:'underline',
     color:'green',
     marginBottom:10,
},
confirmButton:{
     borderWidth:1,
     height:50,
     borderRadius:25,
     alignItems:'center',
     justifyContent:'center',
     marginTop:280,
     backgroundColor:'black',
     width:'90%',
     marginLeft:20,
},
confirm:{
     fontSize:20,
     fontWeight:'bold',
     color:'white',
}
});
export default styles;

