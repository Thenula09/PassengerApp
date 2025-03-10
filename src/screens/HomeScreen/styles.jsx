import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'white'
  },
  homeMap: {
    height: 530,
    backgroundColor: 'lightblue',
    marginBottom: 1,
    marginHorizontal: 5,
  },
  message: {
    backgroundColor:'black',
    borderRadius: 10,
    marginTop: 5,
    padding: 15,
    marginHorizontal:5,
  },
  title: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    padding: 10,
    fontWeight: 'bold',
  },
  field: {
    color: 'white',
    paddingVertical: 9,
  },
  learnMore: {
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  learnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  // Search Box Style
  inputBox: {
    backgroundColor: '#007BFF',
    marginHorizontal: 6,
    marginTop:5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    height:50,
  },
  inputText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 50,
  },

  // Bottom Navigation
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'gray',
    marginTop:20,
  },
  navButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: 'black',
    fontWeight:'bold',
    marginTop: 5,
  },
});

export default styles;
