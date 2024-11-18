import { StyleSheet} from 'react-native';
const styles = StyleSheet.create({
container:{
  flex:1,
},
homeMap:{
  height:420,
  backgroundColor:'lightblue',
  marginBottom:1,
  marginHorizontal:5,
},
message:{
  backgroundColor:'black',
  borderRadius:10,
  margin:5,
  padding:15,
},
title:{
  fontSize:20,
  color:'white',
  textAlign:'center',
  padding:10,
  fontWeight:'bold',
},
field:{
    color:'white',
    paddingVertical:5,
},
learnMore:{
    color:'white',
    fontWeight:'bold',
    marginVertical:10,
},
learnContainer:{
    flexDirection:'row',
    alignItems:'center',
    marginRight:1,
},
inputBox: {
  backgroundColor: 'lightgray',
  marginHorizontal:6,
  marginTop:1,
  padding: 10,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius:10,
},
inputText: {
  fontSize: 20,
  fontWeight: '600',
  color: '#434343',
},
timeContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: 100,
  padding: 10,
  backgroundColor: '#fff',
  borderRadius: 50
},

row: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
  borderBottomWidth: 1,
  borderColor: '#dbdbdb',
  marginTop:5,
},
iconContainer: {
  backgroundColor: '#b3b3b3',
  padding: 10,
  borderRadius: 25,
},
destinationText: {
  marginLeft: 10,
  fontWeight: '500',
  fontSize: 16,
},
map: {
  ...StyleSheet.absoluteFillObject,
},
});
export default styles;
