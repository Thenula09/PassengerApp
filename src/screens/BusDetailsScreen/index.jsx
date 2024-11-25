import { View, Text, Dimensions,TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './styles';
import {useRoute} from '@react-navigation/native';
import RouteMap from '../../components/RouteMap';
import {useNavigation} from '@react-navigation/native';

const BusDetailsScreen = (props) =>{
  const navigation = useNavigation();
  const route = useRoute();
  const {originPlace, destinationPlace} = route.params;

  const gotoLayout = () => {
    navigation.navigate('Bus Layout');
  };

  return (
    <View style={{display: 'flex', justifyContent: 'space-between'}}>
    <View style={{height: Dimensions.get('window').height - 400}}>
      <RouteMap origin={originPlace} destination={destinationPlace} />
    </View>
    <Text style={styles.availableBuses}>Available Buses</Text>
      <TouchableOpacity style={styles.confirmButton} onPress={gotoLayout}>
         <Text style={styles.confirm}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BusDetailsScreen;
