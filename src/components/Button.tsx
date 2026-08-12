import * as React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type ButtonComponentProps = {
  text: string;
  iconName?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  onPress: () => void;
  buttonColor: string;
  textColor: string;
  borderColor?: string;
  width?: number;
  height?: number;
  textAlign?: "left" | "center" | "right";
};

const ButtonComponent = ({
  text,
  iconName,
  onPress,
  buttonColor,
  textColor,
  borderColor,
  width,
  height,
  textAlign = "center",
}: ButtonComponentProps) => (
  <View style={{ flexDirection: "row", gap: 10 }}>
    <Button
      icon={
        iconName 
          ? ({color}) => (
            <MaterialCommunityIcons
              name={iconName}
              size={25}
              color={color} 
            />
          )
          : undefined
      }
      mode="contained"
      buttonColor={buttonColor}
      textColor={textColor}
      contentStyle={{
        justifyContent: 
        textAlign === "left" 
        ? "flex-start" 
        : textAlign === "right" 
        ? "flex-end" 
        : "center",
      }}
      style={{
        width,
        height,
        ...(borderColor 
          ? {
            borderColor,
            borderWidth: 1 
          } 
        : {}),
      }}
      onPress={onPress}
    >
      {text}
    </Button>
  </View>
);

export default ButtonComponent;
