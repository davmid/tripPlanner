import { useAppNavigation } from '@/hooks/useAppNavigation';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabaseClient';

interface Trip {
  id: string;
  trip_name: string;
  start_date: string;
  end_date: string;
  background?: string;
}

export default function HomeScreen() {
  const navigation = useAppNavigation();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);

  const fallbackImage = 'https://source.unsplash.com/random/800x600/?vacation';



  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!session || error) navigation.navigate('Auth');
    };
    checkSession();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        console.error('No user or error:', error);
        return;
      }

      console.log('User ID:', user.id);

      setUserEmail(user.email ?? '');
      setUserName(user.user_metadata?.full_name ?? '');

      const { data, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id);

      if (tripError) {
        console.error('Trip fetch error:', tripError.message);
      } else {
        console.log('Trips:', data);
        setTrips(data);
      }
    };
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.welcome}>Hi, {userName}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={28} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="person-circle-outline" size={32} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.header}>My Trips <Text style={styles.subheader}>{new Date().getFullYear()}</Text></Text>

      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('TripEdit', { tripId: item.id })}>
            <ImageBackground
              source={{ uri: item.background || fallbackImage }}
              style={styles.card}
            >
              <View style={styles.overlay}>
                <Text style={styles.date}>{item.start_date} - {item.end_date}</Text>
                <Text style={styles.title}>{item.trip_name}</Text>
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
  container: { flex: 1, paddingTop: 60, backgroundColor: '#f9f7f3' },
  welcome: { fontSize: 32, paddingLeft: 16, fontWeight: 'bold', color: '#fb5607' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerIcons: { flexDirection: 'row', alignItems: 'center', paddingRight: 16 },
  icon: { color: '#000' },
  header: { fontSize: 20, fontWeight: 'bold', color: '#000', paddingTop: 32, alignSelf: 'center', marginBottom: 32 },
  subheader: { fontSize: 20, color: '#fb5607', fontWeight: 'bold' },
  card: { height: 150, overflow: 'hidden', marginBottom: 16, justifyContent: 'flex-end' },
  overlay: { backgroundColor: 'rgba(0,0,0,0.35)', padding: 16 },
  date: { color: '#fff', fontSize: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: '600' },
  addTripText: { fontSize: 16, fontWeight: '500', paddingTop: 32, alignSelf: 'center', color: '#000', marginBottom: 10 },
  buttonAddTrip: { backgroundColor: '#fb5607', width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10, marginBottom: 32},
  buttonAddTripText: { color: '#fff', fontWeight: '500', fontSize: 32},
});
