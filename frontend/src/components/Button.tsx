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
};

const ButtonComponent = ({
  text,
  iconName,
  onPress,
  buttonColor,
  textColor,
  borderColor
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
        alignItems: "center",
      }}
      style={{
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
