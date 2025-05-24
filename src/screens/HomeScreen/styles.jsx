import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex:1,
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
    backgroundColor: 'rgba(26, 12, 12, 0.51)',
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
   position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
   backgroundColor: 'rgba(17, 16, 16, 0.35)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    //elevation: 15,
  },
  navButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  navText: {
     fontSize: 11,
    color: '#ffffff',
    fontWeight: '600',
    marginTop: 0,
  },
   activeTab: {
    backgroundColor: '#28a745',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
});

export default styles;
