import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import BottomNavBar from '../../components/BottomNavBar';

const { width } = Dimensions.get('window');

const MyBookingsScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      const user = auth().currentUser;
      if (user?.uid) {
        const snapshot = await database()
          .ref(`/receipts/${user.uid}`)
          .orderByChild('paymentTimestamp')
          .once('value');
        
        const data = snapshot.val();
        if (data) {
          const bookingsList = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          // Sort by latest first
          bookingsList.sort((a, b) => 
            new Date(b.paymentTimestamp) - new Date(a.paymentTimestamp)
          );
          setBookings(bookingsList);
        } else {
          setBookings([]);
        }
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return '#2E7D32';
      case 'completed':
        return '#1976D2';
      case 'cancelled':
        return '#D32F2F';
      default:
        return '#666';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderBookingCard = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.bookingCard, { marginTop: index === 0 ? 0 : 12 }]}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('BookingDetail', { booking: item })}
    >
      {/* Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.busIconContainer}>
          <MaterialCommunityIcons name="bus" size={24} color="#2E7D32" />
        </View>
        <View style={styles.busInfo}>
          <Text style={styles.busNumber}>{item.busNumber}</Text>
          <Text style={styles.busName}>{item.busName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status?.toUpperCase() || 'CONFIRMED'}
          </Text>
        </View>
      </View>

      {/* Route Info */}
      <View style={styles.routeContainer}>
        <View style={styles.routePoint}>
          <View style={styles.routeDotGreen} />
          <View style={styles.routeTextContainer}>
            <Text style={styles.locationText}>{item.startLocation}</Text>
            <Text style={styles.timeText}>{item.departureTime}</Text>
          </View>
        </View>
        
        <View style={styles.routeLine}>
          <View style={styles.dottedLine} />
        </View>
        
        <View style={styles.routePoint}>
          <View style={styles.routeDotRed} />
          <View style={styles.routeTextContainer}>
            <Text style={styles.locationText}>{item.endLocation}</Text>
            <Text style={styles.timeText}>{item.arrivalTime}</Text>
          </View>
        </View>
      </View>

      {/* Card Footer */}
      <View style={styles.cardFooter}>
        <View style={styles.footerItem}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.footerText}>{formatDate(item.paymentTimestamp)}</Text>
        </View>
        <View style={styles.footerItem}>
          <MaterialCommunityIcons name="seat" size={16} color="#666" />
          <Text style={styles.footerText}>{item.selectedSeats}</Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>Rs. {item.totalPayment}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <MaterialCommunityIcons name="ticket-outline" size={60} color="#ccc" />
      </View>
      <Text style={styles.emptyTitle}>No Bookings Yet</Text>
      <Text style={styles.emptySubtitle}>Your booking history will appear here</Text>
      <TouchableOpacity 
        style={styles.bookNowButton}
        onPress={() => navigation.navigate('Destination')}
      >
        <LinearGradient
          colors={['#2E7D32', '#43A047']}
          style={styles.bookNowGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.bookNowText}>Book Now</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header
        title="My Bookings"
        subtitle={`${bookings.length} trips`}
        showBackButton={true}
      />

      {/* Booking List */}
      <FlatList
        data={bookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2E7D32']}
            tintColor="#2E7D32"
          />
        }
      />

      {/* Bottom Navigation */}
      <BottomNavBar activeTab="Tickets" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },

  // Header
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  headerRight: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  bookingCount: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },

  // List
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },

  // Booking Card
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  busIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  busInfo: {
    flex: 1,
    marginLeft: 12,
  },
  busNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  busName: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Route
  routeContainer: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeDotGreen: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2E7D32',
    marginTop: 4,
    marginRight: 12,
  },
  routeDotRed: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E91E63',
    marginTop: 4,
    marginRight: 12,
  },
  routeLine: {
    marginLeft: 4,
    paddingVertical: 4,
  },
  dottedLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E0E0E0',
    marginLeft: 4,
  },
  routeTextContainer: {
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },

  // Footer
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  priceContainer: {
    marginLeft: 'auto',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 25,
  },
  bookNowButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookNowGradient: {
    paddingHorizontal: 30,
    paddingVertical: 14,
  },
  bookNowText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

export default MyBookingsScreen;
