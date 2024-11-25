import { StyleSheet} from 'react-native';
const styles = StyleSheet.create({
container:{
    flex:1,
    backgroundColor:'white',
    padding:10,
    },
head:{
    flexDirection:'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 10,
    marginRight:20,
    },
backArrowContainer:{
    height:40,
    width:40,
    justifyContent:'center',
    alignItems:'center',
    marginRight:10,
    marginHorizontal:-10,
    },
title:{
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily:'serif',
    textAlign:'center',
    marginRight:30,
    },
cardImages:{
    flexDirection:'row',
    justifyContent:'center',
    marginVertical:10,

},
visa:{
    width:60,
    height:40,
    marginHorizontal:5,
    borderWidth:1,
},
mastercard:{
    width:60,
    height:40,
    marginHorizontal:5,
    borderWidth:1,
},
americanExpress:{
    width:60,
    height:40,
    marginHorizontal:5,
    borderWidth:1,
},
discover:{
    width:60,
    height:40,
    marginHorizontal:5,
    borderWidth:1,
},
text:{
    marginVertical:10,
    fontWeight:'bold',
    fontSize:17,
    paddingTop:10,
    paddingHorizontal:10,
},
payButton:{
    borderWidth:1,
    height:50,
    borderRadius:25,
    alignItems:'center',
    justifyContent:'center',
    marginTop:50,
    backgroundColor:'black',
},
pay:{
    fontSize:20,
    fontWeight:'bold',
    color:'white',
},
textInput:{
    borderWidth:1,
    backgroundColor:'white',
    borderRadius:25,
    height:50,
    fontSize:15,
    color:'gray',
    paddingHorizontal:10,
},
inputContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 10,
},
cvv:{
    width: 50,
    height: 40,
    marginRight:10,
},
input:{
    flex: 1,
    height: 50,
},
fieldContainer: {
    marginVertical:5,
  },
  errorText: {
    color: 'red',
    marginEnd:10,
    marginLeft: 10,
  },
  errorBorder: {
    borderColor: 'red',
  },
});
export default styles;
