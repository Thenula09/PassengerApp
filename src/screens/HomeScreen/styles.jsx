import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex:1,
    backdropFilter: 'blur(10px)',
  },
  homeMap: {
    height: 530,
    backgroundColor: 'lightblue',
    marginBottom: 1,
    marginHorizontal: 5,
  },
  message: {
    backgroundColor:'rgba(255, 255, 255, 0.2)',
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
    backgroundColor: 'rgba(245, 240, 240, 0.3)',
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
    borderTopColor: 'white',
    marginTop:20,
  },
  navButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: 'white',
    marginTop: 5,
  },
});

export default styles;
