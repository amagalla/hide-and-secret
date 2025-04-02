import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Username from "./screens/Username";
import Game from "./screens/Game";
import { UserProfileProvider } from "./store/context/UserProfileContext";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Username: { profile_id: string };
  Game: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = (): React.JSX.Element => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Username" component={Username} />
          <Stack.Screen
            name="Game">
            {props => (
              <UserProfileProvider>
                <Game {...props} />
              </UserProfileProvider>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

export default App;