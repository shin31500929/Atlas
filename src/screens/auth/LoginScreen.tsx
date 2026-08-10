import { View, Text, Button } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type RootStackParamList from "../../navigation/type";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

function LoginScreen({ navigation }: Props) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Login</Text>
    
    </View>
  );
}

export default LoginScreen;