import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens//home/HomeScreen";
import PostScreen from "../screens/post/PostScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
// import SearchScreen from "../screens/search/SearchScreen";
import { useWindowDimensions } from "react-native";
import TabType from "./TabType";

const Tab = createBottomTabNavigator<TabType>();

function MainTabNavigator() {
  const dimensions = useWindowDimensions();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarPosition: dimensions.width >= 768 ? "left" : "bottom",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
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
      {/* <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Post"
        component={PostScreen}
        options={{
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
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "person-circle-outline" : "person-circle"}
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
