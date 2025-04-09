import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Navigation from './src/navigation/Navigation';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

interface AppProps {}

const App = (props: AppProps) => {
  return (
    <NavigationContainer>
      <Navigation/>
      <Toast />
    </NavigationContainer>
    
  );
};

export default App;

const styles = StyleSheet.create({
  container: {}
});
