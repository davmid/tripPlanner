import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';


const DAYS_IN_WEEK = 7;

const getWeekDays = (): dayjs.Dayjs[] => {
  return Array.from({ length: DAYS_IN_WEEK }, (_, i) =>
    dayjs().startOf('week').add(i + 1, 'day') // Mon–Sun
  );
};

export default function TabOneScreen(): JSX.Element {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(
    dayjs().day()
  );
  const router = useRouter();

  const days = getWeekDays();

  const handleDayPress = (index: number) => {
    setSelectedDayIndex(selectedDayIndex === index + 1 ? null : index + 1);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Your Week</Text>
        {days.map((date, index) => {
          const isSelected = selectedDayIndex === index + 1;
          return (
            <Pressable
              key={date.toString()}
              style={[
                styles.dayCard,
                isSelected && styles.selectedCard,
              ]}
              onPress={() => handleDayPress(index)}
            >
              <Text style={styles.dayName}>{date.format('dddd')}</Text>
              <Text style={styles.dayDate}>{date.format('DD.MM.YYYY')}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-meeting')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  dayCard: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedCard: {
    backgroundColor: '#e6eeff',
    borderColor: '#4a90e2',
  },
  dayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  dayDate: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 32,
    color: 'white',
    lineHeight: 32,
  },
});
