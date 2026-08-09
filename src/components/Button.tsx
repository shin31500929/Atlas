import * as React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const ButtonComponent = () => (
  <View style={{ flexDirection: "row", gap: 10 }}>
    <Button
      icon={({color}) => (
        <MaterialCommunityIcons
            name="pause"
            size={25}
            color={color} 
        />
      )}
      mode="contained"
      buttonColor="#EDF1F1"
      textColor="#283D36"
      contentStyle={{
        alignItems: "center",
      }}
      style={{
        borderColor: "#6B7974",
        borderWidth: 1,
      }}
      onPress={() => console.log("Pause")}
    >
      一時停止
    </Button>
    <Button
      icon={({color}) => (
        <MaterialCommunityIcons
            name="stop"
            size={25}
            color={color}
        />
      )}
      mode="contained"
      buttonColor="#FF4C4F"
      textColor="#FFFFFF"
      contentStyle={{
        alignItems: "center",
      }}
      onPress={() => console.log("Stop")}
    >
      記録終了
    </Button>
  </View>
);

export default ButtonComponent;
