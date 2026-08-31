import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens//home/HomeScreen";
import PostScreen from "../screens/post/PostScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import TabType from "./TabType";

const Tab = createBottomTabNavigator<TabType>();

function MainTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        options={{ tabBarShowLabel: false }}
        component={HomeScreen}
      ></Tab.Screen>
      <Tab.Screen
        name="Post"
        options={{ tabBarShowLabel: false }}
        component={PostScreen}
      ></Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{ tabBarShowLabel: false }}
        component={ProfileScreen}
      ></Tab.Screen>
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
