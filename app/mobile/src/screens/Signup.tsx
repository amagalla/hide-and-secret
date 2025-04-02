import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../App';
import axios from 'axios';
import apiClient from '../../utils/apiClient';

type SignupProps = NativeStackScreenProps<RootStackParamList, 'Signup'>;

const Signup = ({ navigation }: SignupProps): React.JSX.Element => {
  const [register, setRegister] = useState({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [animationDone, setAnimationDone] = useState(false);

  const handleChange = (name: string, value: string) => {
    setRegister({
      ...register,
      [name]: value,
    });
  };

  const handleRegister = async () => {
    try {
      const resp = await apiClient.post('/profiles/register', register);
        navigation.replace('Username', { profile_id: resp.data.profile_id });
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (axios.isAxiosError(err)) {
          const data = err.response?.data;
          setErrorMessage(data.message);
        }
      }
    }
  };

  const title = "Your Adventure Awaits";
  const animatedValues = useRef(title.split('').map(() => ({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(-20),
  }))).current;

  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = animatedValues.map((animatedValue, index) => {
      return Animated.sequence([
        Animated.timing(animatedValue.opacity, {
          toValue: 1,
          duration: 50,
          delay: index * 50,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(animatedValue.translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
      ]);
    });

    Animated.stagger(50, animations).start(() => {
      setAnimationDone(true);
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    });
  }, [animatedValues, contentOpacity]);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          {title.split('').map((char, index) => (
            <Animated.Text
              key={`${char}-${index}`}
              style={[
                styles.title,
                {
                  opacity: animatedValues[index].opacity,
                  transform: [{ translateY: animatedValues[index].translateY }],
                },
              ]}
            >
              {char}
            </Animated.Text>
          ))}
        </View>
        {animationDone && (
          <Animated.View style={[styles.contentContainer, { opacity: contentOpacity }]}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={register.email}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(val) => handleChange('email', val)}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={register.password}
              autoCapitalize="none"
              onChangeText={(val) => handleChange('password', val)}
              secureTextEntry
            />
            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.link} onPress={() => navigation.replace('Login')}>
              <Text style={styles.linkText}>Back to Login</Text>
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
  titleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
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
  },
  linkText: {
    color: '#007BFF',
    fontSize: 16,
  },
});

export default Signup;