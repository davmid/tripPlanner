import { useAppNavigation } from '@/hooks/useAppNavigation'; // Twoja hook do nawigacji
import { Session } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
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
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          style={styles.input}
          value={loading ? 'Loading...' : session?.user?.email || ''}
          editable={false}
          placeholder="Email"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username || ''}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          style={styles.input}
          placeholder="Image URL"
          value={avatarUrl || ''}
          onChangeText={setAvatarUrl}
        />
      </View>

      {/* Podgląd obrazu */}
      {avatarUrl ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: avatarUrl }} style={styles.image} />
        </View>
      ) : (
        <View style={styles.imageContainer}>
          <Text>No image available</Text>
        </View>
      )}

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateProfile({ username, avatar_url: avatarUrl })}
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Cancel" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  imageContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 8,
  },
});
