import { View, Text, Button } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type  RootStackParamList from "../../navigation/type";

type Props = NativeStackScreenProps<RootStackParamList, "Recording">;

function RecordingScreen({ navigation }: Props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Recording</Text>
    
    </View>
  );
}

export default RecordingScreen;