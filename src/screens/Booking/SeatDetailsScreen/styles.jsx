import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
  },
  backArrowContainer: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 1,
  },
  form: {
    margin: 10,
    height: '100%',
    padding: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 150,
    color: 'green',
  },
  text: {
    marginVertical: 7,
    fontWeight: 'bold',
    marginHorizontal: 10,
    fontSize: 17,
  },
  payButton: {
    borderWidth: 3,
    borderRadius: 5, // Reduced border radius to 5
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    backgroundColor: 'black', // Black button background
  },
  pay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5, // Reduced border radius to 5
    backgroundColor: 'white',
    color: 'gray',
    paddingHorizontal: 10,
    height: 50,
  },
  errorInput: {
    borderColor: 'red',
    borderRadius: 5, // Reduced border radius to 5
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});

export default styles;
