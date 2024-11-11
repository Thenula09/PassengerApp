import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  backArrowContainer: {
    backgroundColor: 'lightgray',
    height: 40,
    width: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily:'serif',
    marginBottom: 0,
    marginRight: 80,
  },
  seatLayout: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal:10,
    marginBottom: 10,
    marginTop:10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  seat: {
    width: 60,
    height: 40,
    margin: 3,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacer: {
    width: 70, // Space between columns
  },
  availableSeat: {
    backgroundColor: 'white',
    borderWidth: 2,
  },
  selectedSeat: {
    backgroundColor: 'green', // Updated selected seat color to blue

  },
  seatText: {
    color: 'black',
    fontWeight: 'bold',
  },
  rectangle:{
    borderWidth:2,
    width: 60,
    height: 40,
    borderRadius: 8,
    justifyContent:'center',
    alignItems:'center',
  },
  seatAvailable:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginBottom:10,
  },
  available:{
    fontSize:17,
    fontWeight:'bold',
    marginLeft:20,
  },
  continueButton: {
    borderWidth: 1,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    width: '90%',
    marginLeft:20,
  },
  continueText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default styles;
