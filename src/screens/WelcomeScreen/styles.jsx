import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
container:{
flex:1,
backgroundColor:'white',
alignItems:'center',
},
welcomeImage:{
width:300,
height:300,
marginVertical:100,
},
title:{
fontFamily:'serif',
marginVertical:40,
fontWeight:'bold',
fontSize:30,
color:'black',
textAlign:'center',
paddingHorizontal:10,
},
description:{
    fontWeight:'bold',
    fontSize:30,
    color:'gray',
},
buttonContainer:{
flexDirection:'row',
marginTop:20,
borderWidth:2,
width:'80%',
height:60,
borderRadius:100,
},
loginButtonWrapper:{
justifyContent:'center',
alignItems:'center',
width:'60%',
backgroundColor:'black',
borderRadius:100,
},
signUpButtonWrapper:{
    justifyContent:'center',
    alignItems:'center',
    width:'40%',
   
},
loginText:{
color:'white',
fontWeight:'bold',
},
signUpText:{
color:'black',
fontWeight:'bold',
},
});
export default styles;
