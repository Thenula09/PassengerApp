import React from 'react';
import { View, Text, TouchableOpacity, Pressable, StatusBar, StyleSheet, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const HEADER_HEIGHT_WITH_SEARCH = Platform.OS === 'ios' ? 180 : 170;
const HEADER_HEIGHT_WITHOUT_SEARCH = Platform.OS === 'ios' ? 120 : 110;
const HEADER_PADDING_TOP = Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10;
const HEADER_PADDING_HORIZONTAL = 20;
const HEADER_PADDING_BOTTOM = 20;
const HEADER_BORDER_RADIUS = 30;

const Header = ({
  title = '',
  subtitle = '',
  showBackButton = false,
  showNotification = false,
  showSearch = false,
  onSearchPress,
  searchPlaceholder = 'Search destinations...',
  rightComponent = null,
}) => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSearch = () => {
    if (onSearchPress) {
      onSearchPress();
    } else {
      navigation.navigate('Destination');
    }
  };

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <LinearGradient
        colors={['#1B5E20', '#2E7D32', '#388E3C']}
        style={[
          styles.header,
          { minHeight: showSearch ? HEADER_HEIGHT_WITH_SEARCH : HEADER_HEIGHT_WITHOUT_SEARCH }
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          {showBackButton ? (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          ) : null}
          
          <View style={[styles.titleContainer, showBackButton && styles.titleWithBack]}>
            <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
            {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}
          </View>

          {showNotification ? (
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={26} color="white" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          ) : rightComponent ? (
            rightComponent
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>

        {showSearch && (
          <Pressable style={styles.searchBox} onPress={handleSearch}>
            <Ionicons name="search" size={22} color="#4CAF50" />
            <Text style={styles.searchText}>{searchPlaceholder}</Text>
            <AntDesign name="arrowright" size={20} color="#4CAF50" />
          </Pressable>
        )}
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: HEADER_PADDING_TOP,
    paddingBottom: HEADER_PADDING_BOTTOM,
    paddingHorizontal: HEADER_PADDING_HORIZONTAL,
    borderBottomLeftRadius: HEADER_BORDER_RADIUS,
    borderBottomRightRadius: HEADER_BORDER_RADIUS,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 45,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  titleWithBack: {
    marginLeft: 15,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  subtitleText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF5252',
    borderWidth: 2,
    borderColor: 'white',
  },
  placeholder: {
    width: 44,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 15,
    marginTop: 20,
    height: 52,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#666',
  },
});

export default Header;
