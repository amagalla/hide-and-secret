import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../App';
import axios from 'axios';
import apiClient from '../../utils/apiClient';

type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login = ({ navigation }: LoginProps): React.JSX.Element => {
  const [login, setLogin] = useState({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (name: string, value: string) => {
    setLogin({
      ...login,
      [name]: value,
    });
  };

  const handleLogin = async () => {
    try {
      const resp = await apiClient.post('/profiles/login', login);
      if (!resp.data.has_username) {
        const data = resp.data.user;
        navigation.replace('Username');
      } else {
        await AsyncStorage.setItem('Authorization', resp.data.token);
        navigation.navigate('Game');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (axios.isAxiosError(err)) {
          const data = err.response?.data;
          setErrorMessage(data.message);
        }
      }
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Hide & Secret</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={login.email}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(val) => handleChange('email', val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={login.password}
          autoCapitalize="none"
          onChangeText={(val) => handleChange('password', val)}
          secureTextEntry
        />
        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => navigation.replace('Register')}>
          <Text style={styles.linkText}>Go to Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 16,
  },
  linkText: {
    color: '#007BFF',
    fontSize: 16,
  },
});

export default Login;
