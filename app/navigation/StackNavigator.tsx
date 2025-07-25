import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../HomeScreen';

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
