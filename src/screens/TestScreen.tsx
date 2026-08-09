import ButtonComponent from "../components/Button";
import { View, Text } from "react-native";

export function TestScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Test</Text>
    {/*componentsのテスト*/}
    <ButtonComponent/>
    </View>
  );
}
