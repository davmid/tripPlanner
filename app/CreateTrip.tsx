import { supabase } from '@/api/supabaseClient';
import { useAppNavigation } from '@/hooks/useAppNavigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
    Alert,
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
    const [showPicker, setShowPicker] = useState<'start' | 'end' | null>(null);

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error || !session) {
                Alert.alert('You must be logged in to create a trip');
                navigation.navigate('Auth');
            }
        };
        checkSession();
    }, []);

    const handleCreateTrip = async () => {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) return;

        try {
            const payload = {
                trip_name: tripName.trim() || 'Unnamed Trip',
                user_id: user.id,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                background: null,
                budget: null,
                created_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('trips').insert([payload]);

            if (error) {
                Alert.alert('Insert failed', error.message);
            } else {
                navigation.navigate('Home');
            }
        } catch {
            Alert.alert('Unexpected error while creating trip.');
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 32,
        paddingTop: 32,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginBottom: 20,
    },
    dateBox: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        alignItems: 'center',
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 32,
    },
    cancel: {
        fontSize: 16,
        color: '#888',
    },
    create: {
        fontSize: 16,
        color: '#fb5607',
        fontWeight: 'bold',
    },
});
