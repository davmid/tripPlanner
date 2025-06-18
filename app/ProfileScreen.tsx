import { supabase } from '@/api/supabaseClient';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
    const navigation = useAppNavigation();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (!user || error) return;
            setEmail(user.email ?? '');
            setFullName(user.user_metadata?.full_name ?? 'Traveler');
        };
        fetchUser();
    }, []);

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
                source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
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
});
