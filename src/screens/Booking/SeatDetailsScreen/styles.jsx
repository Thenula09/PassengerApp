import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
container:{
    flex:1,
    backgroundColor:'white',
    marginVertical:10,
},
backArrowContainer:{
    height:40,
    width:40,
    justifyContent:'center',
    alignItems:'center',
    marginHorizontal:10,
},
head:{
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 1,
},
form:{
    margin:10,
    height:'100%',
    padding:10,

},
title:{
    fontSize:30,
    fontWeight:'bold',
    textAlign:'center',
    fontFamily:'serif',
    marginRight:100,

},
text:{
   marginVertical:7,
   fontWeight:'bold',
   marginHorizontal:10,
   fontSize:17,

},
button:{
    borderWidth:1,
    height:50,
    borderRadius:25,
    alignItems:'center',
    justifyContent:'center',
    marginTop:30,
    backgroundColor:'black',
    width:'100%',
    marginHorizontal:2,

},
buttonText:{
    fontSize:20,
    fontWeight:'bold',
    color:'white',
},
textInput:{
    borderWidth:1,
    backgroundColor:'white',
    color:'gray',
    borderRadius:25,
    paddingHorizontal:10,
    height:50,
},
errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});
export default styles;
