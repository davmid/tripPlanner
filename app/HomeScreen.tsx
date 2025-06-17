import { useAppNavigation } from '@/hooks/useAppNavigation';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Trip = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  image: any;
};

const mockTrips: Trip[] = [
  {
    id: '1',
    title: 'Mysore',
    startDate: '22 October 2024',
    endDate: '24 October 2024',
    image: require('@/assets/images/beach1.jpg'),
  },
  {
    id: '2',
    title: 'Chikmagalur',
    startDate: '06 November 2024',
    endDate: '09 November 2024',
    image: require('@/assets/images/beach2.jpg'),
  },
  {
    id: '3',
    title: 'Coorg',
    startDate: '01 November 2024',
    endDate: '05 November 2024',
    image: require('@/assets/images/forest1.jpg'),
  },
];

export default function HomeScreen() {
  const today = new Date();
  const year = today.getFullYear();
  const navigation = useAppNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>My Trips</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => {/* handle settings */ }}>
            <Ionicons name="settings-outline" size={28} paddingRight= {8} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-circle-outline" size={32} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.subheader}>{year}</Text>
      <FlatList
        data={mockTrips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <ImageBackground source={item.image} style={styles.card}>
              <View style={styles.overlay}>
                <Text style={styles.date}>{item.startDate} - {item.endDate}</Text>
                <Text style={styles.title}>{item.title}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <View>
            <Text style={styles.addTripText}>Add new Trip...</Text>
            <TouchableOpacity style={styles.buttonAddTrip} onPress={() => navigation.navigate('Create')}>
              <Text style={styles.buttonAddTripText}>+</Text>
            </TouchableOpacity>
          </View>
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#f9f7f3',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  icon: {
    color: `#000`,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    paddingLeft: 16,
  },
  subheader: {
    fontSize: 18,
    color: '#fb5607',
    marginBottom: 20,
    paddingLeft: 16,
  },
  card: {
    height: 150,
    overflow: 'hidden',
    marginBottom: 15,
    justifyContent: 'flex-end',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    padding: 10,
  },
  date: {
    color: '#fff',
    fontSize: 12,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  addTripText: {
    fontSize: 16,
    fontWeight: '500',
    paddingTop: 32,
    justifyContent: `center`,
    alignItems: `center`,
    alignSelf: `center`,
    color: '#000',
    marginBottom: 10,
  },
  buttonAddTrip: {
    backgroundColor: '#fb5607',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: `center`,
    alignItems: `center`,
    alignSelf: `center`,
    marginTop: 10,
  },
  buttonAddTripText: {
    color: `#fff`,
    fontWeight: `500`,
    fontSize: 32,
  }
});
