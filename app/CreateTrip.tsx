import { supabase } from '@/api/supabaseClient';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import { decode } from 'base64-arraybuffer';
import { format } from 'date-fns';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CreateTrip() {
  const navigation = useAppNavigation();
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [backgrounds, setBackgrounds] = useState<string[]>([]);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        Alert.alert('You must be logged in to create a trip');
        navigation.navigate('Auth');
      }
    };

    const loadImages = async () => {
      const { data, error } = await supabase.storage.from('trip.categories').list('', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' },
      });

      if (error || !data) {
        console.log('No images found in bucket');
        return;
      }

      const urls = data.map(file => {
        const { publicUrl } = supabase.storage.from('trip.categories').getPublicUrl(file.name).data;
        return publicUrl;
      }).filter(Boolean);

      setBackgrounds(urls);
    };

    checkSession();
    loadImages();
  }, []);

  const handleImagePickAndUpload = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (result.canceled || !result.assets?.[0]?.base64) return;

    const image = result.assets[0];
    const fileName = `${Date.now()}.jpg`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('trip.categories')
      .upload(filePath, decode(image.base64), {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      return;
    }

    const { data } = supabase.storage.from('trip.categories').getPublicUrl(filePath);
    if (data?.publicUrl) {
      setSelectedBackground(data.publicUrl);
      setBackgrounds(prev => [...prev, data.publicUrl]);
    }
  };

  const handleCreateTrip = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return;

    const fallbackUrl = 'https://source.unsplash.com/random/800x600/?vacation';
    const backgroundToUse = selectedBackground && selectedBackground.length > 0 ? selectedBackground : fallbackUrl;

    const payload = {
      trip_name: tripName.trim() || 'Unnamed Trip',
      user_id: user.id,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      background: backgroundToUse,
      budget: null,
      created_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase.from('trips').insert([payload]);

    if (insertError) {
      Alert.alert('Insert failed', insertError.message);
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Trip name</Text>
      <TextInput
        value={tripName}
        onChangeText={setTripName}
        placeholder="Enter trip name"
        style={styles.input}
      />

      <View style={styles.dateRow}>
        <TouchableOpacity style={styles.dateBox} onPress={() => setShowPicker('start')}>
          <Text>Starts</Text>
          <Text>{format(startDate, 'dd MMM yyyy')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dateBox} onPress={() => setShowPicker('end')}>
          <Text>Ends</Text>
          <Text>{format(endDate, 'dd MMM yyyy')}</Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={showPicker === 'start' ? startDate : endDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              showPicker === 'start' ? setStartDate(selectedDate) : setEndDate(selectedDate);
            }
            setShowPicker(null);
          }}
        />
      )}

      <Text style={styles.sectionTitle}>Pick Background</Text>
      <ScrollView horizontal style={{ marginBottom: 16 }}>
        {backgrounds.map((url) => (
          <TouchableOpacity key={url} onPress={() => setSelectedBackground(url)}>
            <Image
              source={{ uri: url }}
              style={[styles.image, selectedBackground === url && styles.selectedImage]}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={handleImagePickAndUpload}>
        <Text style={styles.upload}>Upload Custom Background</Text>
      </TouchableOpacity>

      <View style={styles.footerButtons}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.cancel}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCreateTrip}>
          <Text style={styles.create}>Create</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 32, paddingTop: 32 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 16 },
  dateRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 20 },
  dateBox: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, alignItems: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8,  paddingLeft: 8 },
  image: { width: 80, height: 80, marginRight: 10, borderRadius: 8 },
  selectedImage: { borderWidth: 2, borderColor: '#fb5607' },
  upload: { color: '#fb5607', textAlign: 'center', marginBottom: 16 },
  footerButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 32 },
  cancel: { fontSize: 16, color: '#888', paddingLeft: 8 },
  create: { fontSize: 16, color: '#fb5607', fontWeight: 'bold', paddingRight: 8 },
});