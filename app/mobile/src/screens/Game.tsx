import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'

type GameProps = NativeStackScreenProps<RootStackParamList, 'Game'>

const Game = () => {
  return (
    <View>
      <Text>Game page!!</Text>
    </View>
  )
}

const styles = StyleSheet.create({})

export default Game