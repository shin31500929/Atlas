import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/HomeScreen";
import { TestScreen } from "../screens/TestScreen";
import type { RootStackParamList } from "./type";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Atlas" }}
      />

      <Stack.Screen
        name="Test"
        component={TestScreen}
        options={{ title: "Test" }}
      />
    </Stack.Navigator>
  );
}