import { StyleSheet} from 'react-native';
const styles = StyleSheet.create({
container:{
    flex:1,
    padding:10,
    },
header:{
     flexDirection:'row',
     alignItems:'center',
     marginVertical:10,
     paddingHorizontal:10,
},
profileText:{
     fontSize:30,
     fontWeight:'bold',
    color:'green',
     marginLeft:80,
},
imageContainer:{
     alignItems:'center',
     marginTop:20,

},
image:{
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
},
editIcon:{
    backgroundColor:'black',
    padding:10,
    borderRadius:25,
    marginTop:-40,
    marginLeft:100,
},
inputContainer:{
     borderWidth:1,
    borderColor:'black',
    borderRadius:5,
    height:50,
    flexDirection:'row',
    paddingHorizontal:20,
    alignItems:'center',
    marginBottom:15,
},
textInput:{
    flex:1,
    fontSize:20,
    paddingHorizontal:20,
    color:'black',
},
form:{
    marginBottom:10,
    padding:10,
},
textLabel:{
    fontSize:17,
    fontWeight:'bold',
    marginHorizontal:10,
    paddingVertical:5,
},
loginButton:{
     height:50,
    borderRadius:5,
    alignItems:'center',
    justifyContent:'center',
    marginTop:10,
    backgroundColor: 'black',
},
buttonLoginText:{
    fontSize:20,
    fontWeight:'bold',
    color:'white',
},
});

export default styles;
