import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { AuthContext } from '../AuthContext';

// Import Screens
import HomeScreen from '../(tabs)/HomeScreen';
import CreateTrip from '../(tabs)/CreateTrip';
// import ChooseImage from '../screens/ChooseImage';
// import TripScreen from '../screens/TripScreen';
// import NewActivity from '../screens/NewActivity';
// import DefineActivity from '../screens/DefineActivity';
// import TripPlanScreen from '../screens/TripPlanScreen';
// import MapScreen from '../screens/MapScreen';
// import AiAssistant from '../screens/AiAssistant';
// import LoginScreen from '../screens/LoginScreen';
// import RegisterScreen from '../screens/RegisterScreen';

// Typy na props dla nawigacji
type RootStackParamList = {
  Home: undefined;
  Plan: undefined;
  Create: undefined;
  Choose: undefined;
  Trip: undefined;
  Activity: undefined;
  Define: undefined;
  Map: undefined;
  Ai: undefined;
  Login: undefined;
  Register: undefined;
};

const StackNavigator: React.FC = () => {
    const Stack = createNativeStackNavigator(); // Typowanie stacka nawigacji
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Typowanie stanu autentykacji
//   const { token } = useContext(AuthContext); // Pobranie tokena z kontekstu

  // Sprawdzanie tokenu po załadowaniu aplikacji
//   useEffect(() => {
//     const checkAuth = async () => {
//       const storedToken = await AsyncStorage.getItem('authToken');
//       if (storedToken) {
//         setIsAuthenticated(true);
//       }
//     };
//     checkAuth();
//   }, []);

//   const AuthStack = () => (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="Login"
//         component={LoginScreen}
//         options={{ headerShown: false }}
//       />
//       <Stack.Screen
//         name="Register"
//         component={RegisterScreen}
//         options={{ headerShown: false }}
//       />
//     </Stack.Navigator>
//   );

  const MainStack = () => (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="Plan"
        component={TripPlanScreen}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="Create"
        component={CreateTrip}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="Choose"
        component={ChooseImage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Trip"
        component={TripScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Activity"
        component={NewActivity}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Define"
        component={DefineActivity}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Ai"
        component={AiAssistant}
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );

  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
