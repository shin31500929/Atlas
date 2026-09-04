import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useWindowDimensions } from "react-native";
import HomeScreen from "../screens/home/HomeScreen";
import PostTabScreen from "../screens/post/PostTabScreen";
import RecordingTabScreen from "../screens/recording/RecordingTabScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import type TabParamList from "./TabType";

const Tab = createBottomTabNavigator<TabParamList>();

function MainTabNavigator() {
  const dimensions = useWindowDimensions();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarPosition: dimensions.width >= 500 ? "left" : "bottom",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "タイムライン",
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={PostTabScreen}
        options={{
          title: "投稿",
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "add" : "add-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "プロフィール",
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Recording"
        component={RecordingTabScreen}
        options={{
          title: "記録",
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "navigate" : "navigate-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
