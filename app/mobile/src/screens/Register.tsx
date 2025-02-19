import { Button, StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'

type RegisterProps = NativeStackScreenProps<RootStackParamList, 'Register'>

const Register = ({ navigation }: RegisterProps): React.JSX.Element => {
  return (
    <SafeAreaProvider>
    <View>
      <Text>Register</Text>
      <Button
        title="Go to Login"
        onPress={() => navigation.replace('Login')}
        />
    </View>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({})

export default Register