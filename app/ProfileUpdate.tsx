import { useAppNavigation } from '@/hooks/useAppNavigation'; // Twoja hook do nawigacji
import { Button } from '@rneui/themed';
import { Session } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { supabase } from '../lib/supabaseClient'; // Twoja konfiguracja Supabase

export default function Account() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null); // Przechowujemy sesję
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const navigation = useAppNavigation();

  // Sprawdzamy sesję po załadowaniu komponentu
  useEffect(() => {
    const fetchUser = async () => {
      let activeSession = session;

      if (!activeSession) {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.log('Error fetching session:', error.message);
          return;
        }

        activeSession = session;
      }

      if (activeSession?.user) {
        console.log('Session:', activeSession); // Sprawdzamy sesję
        setSession(activeSession);
        await getProfile(activeSession.user.id);
      } else {
        console.log('No session found');
      }
    };

    fetchUser();
  }, [session]);

  async function getProfile(userId: string) {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', userId)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url || '');
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: string;
    avatar_url: string;
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session?.user.id,
        username,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>Edit <Text style={styles.title2}>Profile</Text></Text>

      {/* Form inputs */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username || ''}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Avatar Image URL"
          value={avatarUrl || ''}
          onChangeText={setAvatarUrl}
        />
      </View>

      {/* Avatar Preview */}
      {avatarUrl ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        </View>
      ) : (
        <View style={styles.imageContainer}>
          <Text style={styles.imageText}>No image available</Text>
        </View>
      )}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={() => navigation.goBack()}
          buttonStyle={styles.cancelButton}
        />
        <Button
          title={loading ? 'Loading ...' : 'Update Profile'}
          onPress={async () => {
            await updateProfile({ username, avatar_url: avatarUrl });
            navigation.navigate('Profile');
          }}
          disabled={loading}
          buttonStyle={styles.updateButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 60,
    backgroundColor: '#f9f7f3',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fb5607',
  },
  title2: {
    color: '#000',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageText: {
    fontSize: 16,
    color: '#aaa',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#f75330',
  },
});
