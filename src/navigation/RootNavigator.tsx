import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens//home/HomeScreen";
import { PostScreen } from "../screens/post/PostScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
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
        name="Post"
        component={PostScreen}
        options={{ title: "Post" }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
      <Stack.Screen
        name="Test"
        component={TestScreen}
        options={{ title: "Test" }}
      />
    </Stack.Navigator>
  );
}