import { useAppNavigation } from '@/hooks/useAppNavigation';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabaseClient';

export default function ProfileScreen() {
    const navigation = useAppNavigation();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(''); // Default avatar
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (!user || error) return;
            setEmail(user.email ?? '');
            setFullName(user.user_metadata?.full_name ?? 'Traveler');

            await getProfile(user.id);
        };
        fetchUser();
    }, []);

    async function getProfile(userId: string) {
        try {
          setLoading(true);
          const { data, error, status } = await supabase
            .from('profiles')
            .select(' avatar_url')
            .eq('id', userId)
            .single();
    
          if (error && status !== 406) {
            throw error;
          }
    
          if (data) {
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

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Logout failed', error.message);
        } else {
            navigation.navigate('Auth');
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: avatarUrl || 'https://source.unsplash.com/random/100x100/?avatar' }}
                style={styles.avatar}
            />
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.email}>{email}</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Edit Profile</Text>
                <TouchableOpacity style={styles.option}>
                    <Text>Change Password</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.cancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ProfileUpdate')}>
                    <Text style={styles.editprofile}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logout}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    section: {
        width: '100%',
        marginBottom: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    option: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 20,
    },
    cancel: {
        fontSize: 16,
        color: '#888',
        paddingLeft: 8 
    },
    logout: {
        fontSize: 16,
        color: '#ff0000',
        paddingRight: 8
    },
    editprofile: {
        fontSize: 16,
        color: '#007bff',
        paddingRight: 8
    }
});
