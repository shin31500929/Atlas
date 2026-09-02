import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RecordingMap from "../screens/recording/components/RecordingMap";
import ConfirmScreen from "../screens/recording/ConfirmScreen";
import RecordingScreen from "../screens/recording/RecordingScreen";
import TestScreen from "../screens/TestScreen";
import MainTabNavigator from "./MainTabNavigator";
import type RootStackParamList from "./type";

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="Confirm"
        component={ConfirmScreen}
        options={{ title: "Confirm" }}
      />
      <Stack.Screen
        name="Recording"
        component={RecordingScreen}
        options={{ title: "Recording" }}
      />
      <Stack.Screen
        name="RecordingMap"
        component={RecordingMap}
        options={{ title: "Recording Map" }}
      />
      <Stack.Screen
        name="Test"
        component={TestScreen}
        options={{ title: "Test" }}
      />
    </Stack.Navigator>
  );
}

export default RootNavigator;
