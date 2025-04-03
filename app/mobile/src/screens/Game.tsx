import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserProfile } from '../store/context/UserProfileContext';
import { RootStackParamList } from '../App';
import MapView, { Marker } from 'react-native-maps';

type GameProps = NativeStackScreenProps<RootStackParamList, 'Game'>;

const Game: React.FC<GameProps> = ({ navigation }) => {
  const { profile, isLoading } = useUserProfile();

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
      <View style={styles.loadingContainer}>
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
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      {/* Example Marker */}
      <Marker
        coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
        title="Example Location"
        description="This is a marker description"
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
});

export default Game;