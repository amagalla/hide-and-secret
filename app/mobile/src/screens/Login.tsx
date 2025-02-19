import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Animated, Easing } from 'react-native';
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
  const [titleAnimationDone, setTitleAnimationDone] = useState(false);

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
        navigation.replace('Username', { id: data.id });
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

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start(() => {
      setTitleAnimationDone(true);
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.linear,
      }).start();
    });
  }, [titleOpacity, contentOpacity]);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
          Hide & Secret
        </Animated.Text>
        {titleAnimationDone && (
          <Animated.View style={[styles.contentContainer, { opacity: contentOpacity }]}>
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
            <TouchableOpacity style={styles.link} onPress={() => navigation.replace('Signup')}>
              <Text style={styles.linkText}>Signup</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
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
  contentContainer: {
    width: '100%',
    alignItems: 'center',
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
    alignItems: 'center',
  },
  linkText: {
    color: '#007BFF',
    fontSize: 16,
  },
});

export default Login;
