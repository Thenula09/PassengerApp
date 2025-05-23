import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  backArrowContainer: {
    marginRight: 20,
    mariginLeft: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginHorizontal:15,
    color: 'green',
  },
  seatLayout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    paddingVertical: 20,
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  seat: {
    width: 40,
    height: 40,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
  },
  availableSeat: {
    backgroundColor: 'white',
  },
  unavailableSeat: {
    backgroundColor: 'gray',
  },
  selectedSeat: {
    backgroundColor: 'green',
  },
  seatText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  spacer: {
    width: 40,
    height: 40,
  },
  seatAvailable: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 70,
    marginBottom: -20,
    marginLeft: 80,
  },
  box1: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    marginRight: 5,
  },
  box2: {
    width: 20,
    height: 20,
    backgroundColor: 'gray',
    borderWidth: 1,
    marginRight: 5,
  },
  available: {
    marginRight: 20,
  },
  unavailable: {
    marginRight: 20,
  },
  continueButton: {
    borderWidth: 1,
    height: 50,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    backgroundColor: 'black',
    width: '100%',
    marginHorizontal: 2,
    marginVertical: -15,
  },
  continueText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});
