import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import api from '../../apis_interface/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../../apis_interface/services';
import Toast from 'react-native-toast-message';

const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }
  
    try {
      const res = await loginUser(email, password);
      const { token } = res.data;
  
      if (token) {
        await AsyncStorage.setItem('jsonwebtoken', token);
        Toast.show({
          type: 'success',
          text1: 'Login successfully',
          visibilityTime: 2000,
        });
        navigation.navigate('Home'); 
      } else {
        Alert.alert('Login Failed', 'Invalid token received.');
      }
  
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed. Please try again.';
      Toast.show({
        type: 'error',
        text1: message,
        visibilityTime: 2000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to POS</Text>
      <Text style={styles.title2}>Create your business intelligently.</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
  },
  title2: {
    fontSize: 20,
    fontWeight: 'black',
    marginBottom: 30,
    textAlign: 'center',
  },
});
