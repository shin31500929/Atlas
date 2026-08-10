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
    <ButtonComponent
      text="文字を入力"
      iconName="pause"
      buttonColor="#EDF1F1"
      textColor="#283D36"
      borderColor="#6B7974"//枠線なしの場合はこの行を消してね
      onPress={() => console.log("文字を入力ボタンを押した")}
    />
    </View>
  );
}
