import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const AddMeetingScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');

  const handleAddMeeting = () => {
    // Save meeting to storage or backend
    console.log({ title, description, time });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Meeting Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

      <Text style={styles.label}>Time</Text>
      <TextInput style={styles.input} value={time} onChangeText={setTime} placeholder="e.g. 14:00" />

      <Button title="Add Meeting" onPress={handleAddMeeting} />
    </View>
  );
};

export default AddMeetingScreen;

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginTop: 10, fontWeight: 'bold' },
  input: { borderBottomWidth: 1, paddingVertical: 5, marginBottom: 10 },
});
