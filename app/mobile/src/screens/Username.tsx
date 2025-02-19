import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'

type UsernameProps = NativeStackScreenProps<RootStackParamList, 'Username'>

const Username = ({ navigation }: UsernameProps): React.JSX.Element => {
  return (
    <View>
      <Text>Username Screen</Text>
      <Button
      title="Go to Game"
      onPress={() => navigation.navigate('Game')}
      />
    </View>
  )
}

const styles = StyleSheet.create({})

export default Username