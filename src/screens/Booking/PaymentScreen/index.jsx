import { View, Text, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import styles from './styles';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PaymentScreen = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState({});

  const handleCardNumberChange = (text) => {
    const cleaned = text.replace(/\s+/g, '');
    let formatted = cleaned.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formatted);
  };

  const handleExpiryDateChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    setExpiryDate(formatted);
  };

  const validateFields = () => {
    let newErrors = {};
    if (!cardHolderName) {newErrors.cardHolderName = 'Required';}
    if (!cardNumber) {newErrors.cardNumber = 'Required';}
    if (!expiryDate) {newErrors.expiryDate = 'Required';}
    if (!cvv) {newErrors.cvv = 'Required';}

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayPress = () => {
    if (validateFields()) {
      console.log('Payment process initiated');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.head}>
        <TouchableOpacity style={styles.backArrowContainer}>
          <Ionicons name={'arrow-back-outline'} color={'black'} size={30}/>
        </TouchableOpacity>
        <Text style={styles.title}>Card Information</Text>
      </View>
      <View style={styles.cardImages}>
        <Image style={styles.visa} source={require('../../../assets/visa.png')} />
        <Image style={styles.mastercard} source={require('../../../assets/mastercard.png')} />
        <Image style={styles.americanExpress} source={require('../../../assets/americanExpress.jpg')} />
        <Image style={styles.discover} source={require('../../../assets/discover.png')} />
      </View>

      <View style={styles.fieldContainer}>
        {errors.cardHolderName && <Text style={styles.errorText}>{errors.cardHolderName}</Text>}
        <Text style={styles.text}>Card holder name</Text>
        <TextInput
          style={[styles.textInput, errors.cardHolderName ? styles.errorBorder : null]}
          placeholder="Card holder name"
          placeholderTextColor={'lightgray'}
          value={cardHolderName}
          onChangeText={setCardHolderName}
        />
      </View>

      <View style={styles.fieldContainer}>
        {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
        <Text style={styles.text}>Card number</Text>
        <TextInput
          style={[styles.textInput, errors.cardNumber ? styles.errorBorder : null]}
          placeholder="xxxx xxxx xxxx xxxx"
          placeholderTextColor={'lightgray'}
          keyboardType={'number-pad'}
          value={cardNumber}
          onChangeText={handleCardNumberChange}
          maxLength={19}
        />
      </View>

      <View style={styles.fieldContainer}>
        {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}
        <Text style={styles.text}>Expiry date</Text>
        <TextInput
          style={[styles.textInput, errors.expiryDate ? styles.errorBorder : null]}
          placeholder="MM/YY"
          placeholderTextColor={'lightgray'}
          keyboardType={'number-pad'}
          value={expiryDate}
          onChangeText={handleExpiryDateChange}
          maxLength={5}
        />
      </View>

      <View style={styles.fieldContainer}>
        {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
        <Text style={styles.text}>CVV</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, errors.cvv ? styles.errorBorder : null]}
            placeholder="xxx"
            placeholderTextColor={'lightgray'}
            keyboardType={'number-pad'}
            value={cvv}
            onChangeText={setCvv}
            maxLength={3}
          />
          <Image style={styles.cvv} source={require('../../../assets/CVV.jpg')} />
        </View>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={handlePayPress}>
        <Text style={styles.pay}>Pay</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PaymentScreen;
