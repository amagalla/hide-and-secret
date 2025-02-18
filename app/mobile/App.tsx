import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

const App = (): React.JSX.Element => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Welcome to Hide and Secret!</Text>
      <Text style={styles.text}>This is a mobile application.</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});

export default App;