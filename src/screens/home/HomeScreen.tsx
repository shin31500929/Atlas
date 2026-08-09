import { View, Text, Button } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type {RootStackParamList} from "../../navigation/type";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Atlas</Text>
      <Button title="Go to Post" onPress={() => navigation.navigate("Post")} />
      <Button title="Go to Profile" onPress={() => navigation.navigate("Profile")} />
      <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
      <Button title="Go to Recording" onPress={() => navigation.navigate("Recording")} />
      <Button title="Go to Confirm" onPress={() => navigation.navigate("Confirm")} />
      <Button title="Go to RecordingMap" onPress={() => navigation.navigate("RecordingMap")} />
      <Button title="Go to Test" onPress={() => navigation.navigate("Test")} />
    </View>
  );
}