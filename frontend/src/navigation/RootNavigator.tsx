import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/auth/LoginScreen";
import PostScreen from "../screens/post/PostScreen";
import ConfirmScreen from "../screens/recording/ConfirmScreen";
import DestinationSetupScreen from "../screens/recording/DestinationSetupScreen";
import RecordingMapScreen from "../screens/recording/RecordingMapScreen";
import RecordingScreen from "../screens/recording/RecordingScreen";
import MainTabNavigator from "./MainTabNavigator";
import type RootStackParamList from "./type";

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="Post"
        component={PostScreen}
        options={{ title: "投稿" }}
      />
      <Stack.Screen
        name="DestinationSetup"
        component={DestinationSetupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Recording"
        component={RecordingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Confirm"
        component={ConfirmScreen}
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RecordingMap"
        component={RecordingMapScreen}
        options={{ title: "記録詳細" }}
      />
    </Stack.Navigator>
  );
}

export default RootNavigator;
