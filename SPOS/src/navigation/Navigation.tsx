import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Alert, Button, StyleSheet } from 'react-native';
import Login from '../screens/Login';
import Home from '../screens/Home';
import { RootStackParamList } from './types'; 

interface NavigationProps {}

const Navigation = (props: NavigationProps) => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerRight: () => (
            <Button title="Info" onPress={() => Alert.alert('This is a button!')} />
          ),
        }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  container: {},
});
