import { useAppNavigation } from '@/hooks/useAppNavigation';
import { Button } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import { supabase } from '../lib/supabaseClient';

export default function ProfileScreen() {
    const navigation = useAppNavigation();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [tripCount, setTripCount] = useState(0);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (!user || error) return;
            setEmail(user.email ?? '');
            setFullName(user.user_metadata?.full_name ?? 'Traveler');
            await getProfile(user.id);
            await getTripCount(user.id);
        };
        fetchUser();
    }, []);

    async function getTripCount(userId: string) {
        try {
            setLoading(true);
            const { data, error, status, count } = await supabase
                .from('trips')
                .select('*', { count: 'exact' })
                .eq('user_id', userId);

            if (error && status !== 406) {
                throw error;
            }

            setTripCount(count ? parseInt(count.toString(), 10) : 0);
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

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

            setAvatarUrl(data.avatar_url || '');
            setUsername(data.username || '');
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
        <View style={styles.mainContainer}>
            {/* Poprawione wyrównanie przycisków */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={handleLogout}>
                    <Icon name="logout" size={30} color="#007bff" style={styles.logout} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ProfileUpdate')}>
                    <Icon name="edit" size={30} color="#007bff" style={styles.editprofile} />
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <Image
                    source={{ uri: avatarUrl || 'https://source.unsplash.com/random/100x100/?avatar' }}
                    style={styles.avatar}
                />
                <Text style={styles.name}>{fullName}</Text>
                <Text style={styles.email}>{email}</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About You</Text>
                    <View style={styles.option}>
                        <Text>Full Name: {fullName}</Text>
                        <Text>Username: {username}</Text>
                        <Text>Email: {email}</Text>
                        <Text>Trips Count: {tripCount}</Text>
                    </View>
                </View>

                <View style={styles.footerRow}>
                    <Button buttonStyle={styles.cancel} containerStyle={styles.buttonContainer} onPress={() => navigation.navigate('Home')}>
                        Go Back
                    </Button>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f9f7f3',
        paddingTop: 60,
    },
    topBar: {
        flexDirection: 'row', // Przyciski obok siebie
        justifyContent: 'space-between', // Rozdzielone na lewą i prawą stronę
        paddingHorizontal: 20, // Odstęp od krawędzi
        marginBottom: 20, // Odstęp od sekcji poniżej
    },
    container: {
        flex: 1,
        alignItems: 'center',
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
        backgroundColor: '#f75330',
        borderRadius: 5,
    },
    buttonContainer: {
        flex: 1,
        height: 50,
        width: '100%',
        marginVertical: 10,
        justifyContent: 'flex-end',
    },
    logout: {
        color: '#007bff',
        paddingRight: 8,
    },
    editprofile: {
        color: '#007bff',
        paddingRight: 8,
    }
});
