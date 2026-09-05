import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/home/HomeScreen";
import PostTabScreen from "../screens/post/PostTabScreen";
import RecordingTabScreen from "../screens/recording/RecordingTabScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import type TabParamList from "./TabType";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";

const Tab = createBottomTabNavigator<TabParamList>();

function ProfileTabNavigator() {
  const [selectedTab, setSelectedTab] = useState("Post");

  return (
    <View style={{ flex: 1 }}>
      {/* タブ */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 50,
        }}
      >
        <Pressable onPress={() => setSelectedTab("Post")}>
          <Text style={{ fontSize: 20, color: selectedTab === "Post" ? "#4943fb" : "black" }}>
            投稿
          </Text>
        </Pressable>

        <Pressable onPress={() => setSelectedTab("Like")}>
          <Text style={{ fontSize: 20, color: selectedTab === "Like" ? "#4943fb" : "black" }}>
            いいね
          </Text>
        </Pressable>

        <Pressable onPress={() => setSelectedTab("Recording")}>
          <Text
            style={{ fontSize: 20, color: selectedTab === "Recording" ? "#4943fb" : "black" }}
          >
            記録
          </Text>
        </Pressable>
      </View>

      {/* タブの内容 */}
      <View style={{ flex: 1 }}>
        {selectedTab === "Post"}

        {selectedTab === "Like"}

        {selectedTab === "Recording"}
      </View>
    </View>
  );
}

export default ProfileTabNavigator;
