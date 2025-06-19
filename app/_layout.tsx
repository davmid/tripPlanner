import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AuthScreen from './AuthScreen';
import CreateTrip from './CreateTrip';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import ProfileUpdate from './ProfileUpdate';
import TripEdit from './TripEdit';

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <Stack.Navigator id={undefined}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Create" component={CreateTrip} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
      <Stack.Screen name="TripEdit" component={TripEdit} options={{ headerShown: false }} />
      <Stack.Screen name="ProfileUpdate" component={ProfileUpdate} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
