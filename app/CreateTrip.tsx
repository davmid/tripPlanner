import DateTimePicker from '@react-native-community/datetimepicker';
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

import { format } from 'date-fns';

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

    const addLocation = () => {
        setLocations([...locations, { city: '', country: '', from: new Date(), to: new Date() }]);
    };

    const updateLocation = (index: number, field: keyof Location, value: any) => {
        const updated = [...locations];
        updated[index][field] = value;
        setLocations(updated);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <View style={styles.headerRow}>
                <TouchableOpacity><Text style={styles.cancel}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity><Text style={styles.create}>Create</Text></TouchableOpacity>
            </View>

            <Text style={styles.title}>Trip name</Text>
            <TextInput
                value={tripName}
                onChangeText={setTripName}
                placeholder="Enter trip name"
                style={styles.input}
            />

            <Text style={styles.sectionTitle}>Itinerary</Text>

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

            {locations.map((loc, i) => (
                <View key={i} style={styles.locationBlock}>
                    <TextInput
                        placeholder="City"
                        style={styles.inputSmall}
                        value={loc.city}
                        onChangeText={(text) => updateLocation(i, 'city', text)}
                    />
                    <TextInput
                        placeholder="Country"
                        style={styles.inputSmall}
                        value={loc.country}
                        onChangeText={(text) => updateLocation(i, 'country', text)}
                    />
                    <View style={styles.dateRow}>
                        <TouchableOpacity style={styles.dateBox} onPress={() => setShowPicker({ field: 'from', index: i })}>
                            <Text>From</Text>
                            <Text>{format(loc.from, 'dd MMM yyyy')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dateBox} onPress={() => setShowPicker({ field: 'to', index: i })}>
                            <Text>To</Text>
                            <Text>{format(loc.to, 'dd MMM yyyy')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}

            <TouchableOpacity onPress={addLocation} style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Location</Text>
            </TouchableOpacity>

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
        marginBottom: 20,
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
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 20,
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