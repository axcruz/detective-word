// App.js

import React, { useEffect, useState } from "react";
import { View, useColorScheme } from "react-native";
import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { decode, encode } from "base-64";
if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

import LogInScreen from "./screens/LogInScreen";
import RegistrationScreen from "./screens/RegistrationScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";

import InvestigationsScreen from "./screens/InvestigationsScreen";
import LeadsScreen from "./screens/LeadsScreen";
import PuzzleScreen from "./screens/PuzzleScreen";
import GameResultScreen from "./screens/GameResultScreen";

import { auth } from "./firebase/config";

const Stack = createStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [theme, setTheme] = useState(useColorScheme());
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    auth.onAuthStateChanged(() => {
      setCurrentUser(auth.currentUser);
      if (initializing) setInitializing(false);
    });
  }, []);

  if (initializing) return null;

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer theme={theme === "dark" ? DarkTheme : DefaultTheme}>
        {currentUser ? (
          <Stack.Navigator
            screenOptions={{
              headerBackTitleVisible: false,
            }}
          >
            <Stack.Screen
              name="Investigations"
              component={InvestigationsScreen}
              options={{ title: "Investigations" }}
            />
            <Stack.Screen
              name="Leads"
              component={LeadsScreen}
              options={{ title: "Leads" }}
            />
            <Stack.Screen
              name="Puzzle"
              component={PuzzleScreen}
              options={{ title: "Puzzle", gestureEnabled: false}}
            />
            <Stack.Screen
              name="GameResult"
              component={GameResultScreen}
              options={{ title: "", gestureEnabled: false,  headerLeft: ()=> null}}
            />

          </Stack.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="Log in" component={LogInScreen} />
            <Stack.Screen name="Registration" component={RegistrationScreen} />
            <Stack.Screen
              name="Reset Password"
              component={ResetPasswordScreen}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
    </View>
  );
};

export default App;
