import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
container:{
   flex:1,
   padding:20,
  
},
welcomeImage:{
   width:400,
   height:200,
   marginVertical:20,
   marginHorizontal:-25,
},
text:{
   marginVertical:80,
   padding:10
},
title:{
   //fontFamily:'serif',
   fontWeight:'bold',
   fontSize:50,
   color:'black',
   marginLeft:30
},
description:{
    fontWeight:'bold',
    fontSize:20,
    color:'black',
    marginLeft:-5

},
tiImg:{
  flexDirection:'row',
  justifyContent:'center',
  alignItems:'center',
  marginHorizontal:10,
  marginRight:80,
  
},
img:{
  fontSize:45,
  marginBottom:12,
  marginLeft:10,
  color:'white'
},
/*buttonContainer:{
flexDirection:'row',
marginTop:20,
borderWidth:2,
width:'80%',
height:60,
borderRadius:100,
},*/
loginButtonWrapper:{
   height:50,
   width:'100%',
   borderRadius:5,
   alignItems:'center',
   justifyContent:'center',
   marginTop:75,
   //backgroundColor: 'rgba(245, 240, 240, 0.3)',
   backgroundColor:'black'
},
signUpButtonWrapper:{
   height:50,
   width:'100%',
   borderRadius:5,
   alignItems:'center',
   justifyContent:'center',
   marginVertical:10,
   backgroundColor: 'rgba(69, 66, 66, 0.3)',
},
loginText:{
   fontSize:20,
   fontWeight:'bold',
   color:'white',
},
signUpText:{
   fontSize:20,
    fontWeight:'bold',
    color:'white',
},
});
export default styles;
