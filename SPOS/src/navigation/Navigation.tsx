import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { RootStackParamList } from './types';
import Login from '../screens/Login';
import Home from '../screens/Home';

interface NavigationProps { }

const Navigation = (props: NavigationProps) => {

    const Stack = createNativeStackNavigator<RootStackParamList>()
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
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
    container: {}
});
