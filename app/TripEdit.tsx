import { supabase } from '@/api/supabaseClient';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import { RootStackParamList } from '@/types/RootStackParamList';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const fallbackImage = 'https://source.unsplash.com/random/800x600/?vacation';
type TripEditRouteProp = RouteProp<RootStackParamList, 'TripEdit'>;

interface Location {
  id: string;
  trip_id: string;
  title: string;
  date: string;
  image_url?: string;
  description?: string;
}

export default function TripEdit() {
  const navigation = useAppNavigation();
  const { tripId } = useRoute<TripEditRouteProp>().params;
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [background, setBackground] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);
  const route = useRoute();
  
  if (!tripId) {
    return <Text style={{ marginTop: 100, textAlign: 'center' }}>Invalid trip ID.</Text>;
  }
  useEffect(() => {
    const fetchTripData = async () => {
      const { data, error } = await supabase.from('trips').select('*').eq('id', tripId).single();
      if (data) {
        setTripName(data.trip_name);
        setStartDate(data.start_date);
        setEndDate(data.end_date);
        setBackground(data.background ?? fallbackImage);
      }
    };

    const fetchLocations = async () => {
      const { data } = await supabase.from('locations').select('*').eq('trip_id', tripId);
      if (data) setLocations(data);
    };

    fetchTripData();
    fetchLocations();
  }, [tripId]);

  const handleSave = async () => {
    await supabase.from('trips').update({ trip_name: tripName }).eq('id', tripId);
    navigation.goBack();
  };

  const groupedByDate = locations.reduce((acc: Record<string, Location[]>, loc) => {
    acc[loc.date] = acc[loc.date] ? [...acc[loc.date], loc] : [loc];
    return acc;
  }, {});

  const dateKeys = Object.keys(groupedByDate).sort();

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={{ uri: background }} style={styles.coverImage} />

        <View style={styles.headerCard}>
          <TextInput
            style={styles.tripNameInput}
            value={tripName}
            onChangeText={setTripName}
            placeholder="Trip name"
          />
          <Text style={styles.dateText}>{startDate} - {endDate}</Text>
        </View>

        <Text style={styles.sectionTitle}>Itinerary</Text>
        <ScrollView horizontal style={styles.dateScroll}>
          {dateKeys.map(date => (
            <View key={date} style={styles.dateChip}>
              <Text style={styles.dateChipText}>{date}</Text>
            </View>
          ))}
        </ScrollView>

        {dateKeys.map(date => (
          <View key={date}>
            <Text style={styles.dateLabel}>{date}</Text>
            {groupedByDate[date].map(place => (
              <View key={place.id} style={styles.placeCard}>
                <Text style={styles.placeTitle}>{place.title}</Text>
                {place.image_url && <Image source={{ uri: place.image_url }} style={styles.placeImage} />}
                <Text style={styles.placeDescription}>{place.description}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <View style={styles.footerButtons}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.footerBtnBack}>
          <Text style={styles.footerBtnText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave} style={styles.footerBtnSave}>
          <Text style={styles.footerBtnText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  coverImage: { width: '100%', height: 160 },
  headerCard: { backgroundColor: '#fff', padding: 16, marginTop: -40, marginHorizontal: 16, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 },
  tripNameInput: { fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  dateText: { fontSize: 14, color: '#666' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 24, marginLeft: 16 },
  dateScroll: { paddingVertical: 8, paddingHorizontal: 16 },
  dateChip: { backgroundColor: '#fb5607', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, marginRight: 8 },
  dateChipText: { color: 'white', fontWeight: '600' },
  dateLabel: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginLeft: 16 },
  placeCard: { backgroundColor: '#f2f2f2', padding: 12, marginHorizontal: 16, marginVertical: 8, borderRadius: 8 },
  placeTitle: { fontWeight: 'bold', fontSize: 16 },
  placeImage: { height: 100, borderRadius: 8, marginTop: 8 },
  placeDescription: { marginTop: 4, color: '#555' },
  footerButtons: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  footerBtnBack: { backgroundColor: '#ccc', padding: 12, borderRadius: 8, flex: 1, marginRight: 8 },
  footerBtnSave: { backgroundColor: '#fb5607', padding: 12, borderRadius: 8, flex: 1 },
  footerBtnText: { textAlign: 'center', color: '#fff', fontWeight: 'bold' },
});
