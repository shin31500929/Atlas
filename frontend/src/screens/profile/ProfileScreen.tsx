import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { View, Text, Button } from "react-native";
import type TabParamList from "../../navigation/TabType";

type Props = BottomTabScreenProps<TabParamList, "Profile">;

function ProfileScreen({ navigation }: Props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Profile</Text>
    </View>
  );
}

export default ProfileScreen;
