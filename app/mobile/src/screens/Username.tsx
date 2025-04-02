import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import apiClient from '../../utils/apiClient';

type UsernameProps = NativeStackScreenProps<RootStackParamList, 'Username'>;

const Username = ({ navigation, route }: UsernameProps): React.JSX.Element => {
  const { profile_id } = route.params || {};
  const [usernameData, setUsernameData] = useState({
    username: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [animationDone, setAnimationDone] = useState(false);

  const handleChange = (name: string, value: string) => {
    setUsernameData({
      ...usernameData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      const resp = await apiClient.patch(`/profiles/${profile_id}/username`, usernameData);
      await AsyncStorage.setItem('Authorization', resp.data.token);
      navigation.navigate('Game');
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (axios.isAxiosError(err)) {
          const data = err.response?.data;
          setErrorMessage(data.message);
        }
      }
    }
  };

  const title = "Create a Username";
  const animatedValues = useRef(title.split('').map(() => ({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(-50),
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
        Animated.spring(animatedValue.translateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 5,
          tension: 40,
        }),
      ]);
    });

    Animated.stagger(30, animations).start(() => {
      setAnimationDone(true);
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 500,
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
              placeholder="Username"
              value={usernameData.username}
              autoCapitalize="none"
              onChangeText={(val) => handleChange('username', val)}
            />
            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit Username</Text>
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

export default Username;