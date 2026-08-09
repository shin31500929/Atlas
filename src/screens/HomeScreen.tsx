import { View, Text, Button } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type {RootStackParamList} from "../navigation/type";

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
      <Button title="Go to Test" onPress={() => navigation.navigate("Test")} />
    </View>
  );
}