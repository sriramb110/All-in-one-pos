import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.home1}>
        <Text style={styles.text}>Hi 1</Text>
      </View>
      <View style={styles.home2}>
        <Text style={styles.text}>Hi 2</Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf1f1',
  },
  home1: {
    flex: 1,
    backgroundColor: '#d62e2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  home2: {
    flex: 0.1,
    backgroundColor: '#2e86de',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
