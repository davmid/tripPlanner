import { useAppNavigation } from '@/hooks/useAppNavigation';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import React, { useState } from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type Location = {
    city: string;
    country: string;
    from: Date;
    to: Date;
};

export default function CreateTrip() {
    const [tripName, setTripName] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState<{ field: string; index?: number } | null>(null);
    const [locations, setLocations] = useState<Location[]>([
        { city: '', country: '', from: new Date(), to: new Date() },
    ]);
    const navigation = useAppNavigation();

    const updateLocation = (index: number, field: keyof Location, value: any) => {
        const updated = [...locations];
        updated[index][field] = value;
        setLocations(updated);
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
                <TouchableOpacity style={styles.dateBox} onPress={() => setShowPicker({ field: 'start' })}>
                    <Text>Starts</Text>
                    <Text>{format(startDate, 'dd MMM yyyy')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dateBox} onPress={() => setShowPicker({ field: 'end' })}>
                    <Text>Ends</Text>
                    <Text>{format(endDate, 'dd MMM yyyy')}</Text>
                </TouchableOpacity>
            </View>

            {showPicker && (
                <DateTimePicker
                    value={(() => {
                        if (showPicker.field === 'start') return startDate;
                        if (showPicker.field === 'end') return endDate;
                        if (showPicker.index !== undefined) return locations[showPicker.index][showPicker.field as keyof Location] as Date;
                        return new Date();
                    })()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(e, date) => {
                        if (!date) return;
                        if (showPicker.field === 'start') setStartDate(date);
                        else if (showPicker.field === 'end') setEndDate(date);
                        else if (showPicker.index !== undefined) {
                            updateLocation(showPicker.index, showPicker.field as keyof Location, date);
                        }
                        setShowPicker(null);
                    }}
                />
            )}

            <View style={styles.headerRow}>
                <TouchableOpacity><Text style={styles.cancel} onPress={() => navigation.navigate('Home')}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.create}>Create</Text></TouchableOpacity>
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
    headerRow: {
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
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
    locationBlock: {
        marginBottom: 20,
        backgroundColor: '#f4f4f4',
        padding: 10,
        borderRadius: 8,
    },
    inputSmall: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        marginBottom: 10,
    },
    addButton: {
        backgroundColor: '#fb5607',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});