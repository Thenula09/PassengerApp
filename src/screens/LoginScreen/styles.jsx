import { StyleSheet } from 'react-native';
import { COLORS } from '../../theme';

const styles = StyleSheet.create({
container:{
    flex:1,
    padding:16,
    backgroundColor: COLORS.background,
},
backArrowContainer:{
    height:50,
    width:50,
    justifyContent:'center',
    alignItems:'center',
    marginTop: 10,
},
welcomeMsg:{
    justifyContent:'center',
    margin:15,
    paddingTop:40,
    marginBottom: 20,
},
welcomeText:{
    fontSize:32,
    fontWeight:'bold',
    color: COLORS.primary,
    letterSpacing: 0.5,
},
    p:{
        fontSize:16,
        color: COLORS.text,
        marginTop: 8,
    },
form:{
    marginVertical:130,
},
inputContainer:{
    flexDirection:'row',
    paddingHorizontal:18,
    alignItems:'center',
    height: 55,
    backgroundColor: COLORS.card,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
},
textInput:{
    flex:1,
    fontSize:16,
    paddingHorizontal:12,
    color:'#333',
},
textInputContainer:{
    marginTop:20,
    paddingHorizontal: 10,
},
forgotPasswordText:{
    textAlign:'right',
    color:'#2E7D32',
    fontWeight:'600',
    marginVertical:15,
    fontSize:15,
    paddingHorizontal: 10,
},
loginButton:{
    height:55,
    borderRadius:25,
    alignItems:'center',
    justifyContent:'center',
    marginTop:25,
    marginHorizontal: 10,
    backgroundColor: '#4CAF50',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
},
buttonLoginText:{
    fontSize:18,
    fontWeight:'bold',
    color:'white',
    letterSpacing: 0.5,
},
continueText:{
    textAlign:'center',
    padding:10,
    marginTop:10,
    fontSize:18,
},
googleButton:{
    borderWidth:1,
    height:50,
    borderRadius:25,
    alignItems:'center',
    justifyContent:'center',
    marginTop:10,
    backgroundColor:'white',
    flexDirection:'row',
    gap:10,
},
buttonGoogleText:{
    fontSize:20,
    fontWeight:'bold',
    color:'black',
},
googleLogo:{
    width:21,
    height:21,
},
bottomText:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginTop:20,
    gap:8,
    paddingHorizontal: 10,
},
doNotAccountText:{
    fontSize:15,
    fontWeight:'500',
    color:'#555',
},
bottomSignUp:{
    fontSize:15,
    fontWeight:'bold',
    color:'#1B5E20',
},
eyeIconContainer:{
    paddingLeft:5,
    padding: 8,
},

});

export default styles;
