import { StyleSheet} from 'react-native';
const styles = StyleSheet.create({
container:{
    height:'100%',
    marginVertical:10,
},
textInput:{
backgroundColor:'lightgray',
marginHorizontal:5,
marginLeft:20,
},
row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  iconContainer: {
    backgroundColor: '#a2a2a2',
    padding: 5,
    borderRadius: 50,
    marginRight: 15,
  },
  locationText: {
   fontSize:15,
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
