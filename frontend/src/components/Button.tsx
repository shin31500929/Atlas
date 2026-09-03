import * as React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Button } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

type ButtonComponentProps = {
  text: string;
  iconName?: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  onPress: () => void;
  buttonColor: string;
  textColor: string;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
};

const ButtonComponent = ({
  text,
  iconName,
  onPress,
  buttonColor,
  textColor,
  borderColor,
  style,
}: ButtonComponentProps) => (
  <View style={[{ flexDirection: "row" }, style]}>
    <Button
      icon={
        iconName
          ? ({ color }) => (
              <MaterialCommunityIcons name={iconName} size={22} color={color} />
            )
          : undefined
      }
      mode="contained"
      buttonColor={buttonColor}
      textColor={textColor}
      contentStyle={{
        height: 52,
        alignItems: "center",
        justifyContent: "center",
      }}
      labelStyle={{
        fontSize: 16,
        fontWeight: "600",
        marginVertical: 0,
      }}
      style={[
        {
          flex: 1,
          borderRadius: 28,
          ...(borderColor
            ? {
                borderColor,
                borderWidth: 1.5,
              }
            : {}),
        },
      ]}
      onPress={onPress}
    >
      {text}
    </Button>
  </View>
);

export default ButtonComponent;
