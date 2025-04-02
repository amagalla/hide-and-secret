import React, { useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserProfile } from '../store/context/UserProfileContext';
import { RootStackParamList } from '../App';

type GameProps = NativeStackScreenProps<RootStackParamList, 'Game'>;

const Game: React.FC<GameProps> = ({ navigation }) => {
  const { profile, isLoading } = useUserProfile();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('Authorization');
    navigation.replace('Login');
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('Authorization');
      if (!token || (!profile && !isLoading)) {
        navigation.replace('Login');
      }
    };

    checkAuth();
  }, [navigation, profile, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (!profile) {
    AsyncStorage.removeItem('Authorization');
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {profile.username}!</Text>
      <Text>ID: {profile.profile_id}</Text>
      <Text>Email: {profile.email}</Text>
      <Text>Google ID: {profile.google_id || 'Not linked'}</Text>
      <Text>Google Email: {profile.google_email || 'Not linked'}</Text>
      <Text>Score: {profile.score}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Game;