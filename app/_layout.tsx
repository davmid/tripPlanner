import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import CreateTrip from './CreateTrip';
import HomeScreen from './HomeScreen';

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Create" component={CreateTrip} options={{ title: `Create Trip` }} />
    </Stack.Navigator>
  );
}
