import { StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container:{
    flex:1,
    backdropFilter: 'blur(10px)',
 },
backArrowContainer:{
  height:40,
  width:40,
  justifyContent:'center',
  alignItems:'center',
  marginVertical:10,
  marginLeft:10,
},
textInput:{
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  marginHorizontal:5,
  marginLeft:20,
  height:45,
  fontSize:18,
},
row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 17,
  },
  iconContainer: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 50,
    marginRight: 15,
  },
  locationText: {
   fontSize:15,
   color:'white'
  },
  circle: {
    width: 5,
    height: 5,
    backgroundColor: 'black',
    position: 'absolute',
    top: 18,
    left: 16,
    borderRadius: 75,
  },
  line: {
    width: 2,
    height: 43,
    backgroundColor: 'black',
    position: 'absolute',
    top: 26,
    left: 17,
  },
  square: {
    width: 5,
    height: 5,
    backgroundColor: 'black',
    position: 'absolute',
    top: 72,
    left: 16,
  },
});
export default styles;
