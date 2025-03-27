import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ProfileScreen = () => {
  const [name, setName] = useState('John Doe');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSave = () => {
    // Add logic to save changes (e.g., API call or localStorage update)
    console.log('Saved name and password');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>New Password</Text>
      <TextInput style={styles.input} secureTextEntry value={password} onChangeText={setPassword} />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput style={styles.input} secureTextEntry value={newPassword} onChangeText={setNewPassword} />

      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginTop: 10, fontWeight: 'bold' },
  input: { borderBottomWidth: 1, paddingVertical: 5 },
});
