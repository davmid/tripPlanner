import { useAppNavigation } from '@/hooks/useAppNavigation';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [modalVisible, setModalVisible] = useState(false);

  const fallbackImage = 'https://source.unsplash.com/random/800x600/?vacation';

  async function getProfile(userId: string) {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', userId)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      setAvatarUrl(data.avatar_url || '');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

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
      await getProfile(user.id);

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

  // Tworzymy listę lat od 2000 do 2025
  const yearList = [];
  for (let i = 2010; i <= 2025; i++) {
    yearList.push(i);
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.welcome}>Hi, {userName}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={28} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{ uri: avatarUrl || 'https://source.unsplash.com/random/100x100/?avatar' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>
      
        <TouchableOpacity
          onPress={() => setModalVisible(true)}>
          <Text style={styles.header}>My Trips 
          <Text style={styles.subheader}> {selectedYear}</Text>
          </Text>
        </TouchableOpacity>


      {/* Modal z listą lat */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Select <Text  style={styles.modalHeader2}>Year</Text></Text>
            {yearList.map((year) => (
              <TouchableOpacity 
                key={year}
                style={styles.yearOption}
                onPress={() => {
                  setSelectedYear(year);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.yearText}>{year}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <FlatList
        data={trips.filter(trip => new Date(trip.start_date).getFullYear() === selectedYear)} // Filtrujemy wycieczki na podstawie wybranego roku
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
  button: { backgroundColor: '#fb5607', padding: 10, borderRadius: 5, alignSelf: 'center', marginBottom: 20 },
  buttonText: { color: '#fff', fontSize: 16 },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { width: 300, backgroundColor: 'white', padding: 20, borderRadius: 10 },
  modalHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#fb5607' },
  modalHeader2: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  yearOption: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  yearText: { fontSize: 18, textAlign: 'center' },
  card: { height: 150, overflow: 'hidden', marginBottom: 16, justifyContent: 'flex-end' },
  overlay: { backgroundColor: 'rgba(0,0,0,0.35)', padding: 16 },
  date: { color: '#fff', fontSize: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: '600' },
  addTripText: { fontSize: 16, fontWeight: '500', paddingTop: 32, alignSelf: 'center', color: '#000', marginBottom: 10 },
  buttonAddTrip: { backgroundColor: '#fb5607', width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 10, marginBottom: 32},
  buttonAddTripText: { color: '#fff', fontWeight: '500', fontSize: 32},
  avatar: { width: 40, height: 40, borderRadius: 20, marginLeft: 16 },
});
