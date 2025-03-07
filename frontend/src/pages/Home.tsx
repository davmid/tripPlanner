import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { fetchUsers } from '../api';

export default function HomeScreen() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers().then(data => setUsers(data));
  }, []);

  return (
    <View>
      <Text>Lista użytkowników</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.name} ({item.email})</Text>}
      />
    </View>
  );
}
