import { TextInput } from "react-native-paper";
import { StyleProp, ViewStyle } from "react-native";

type InputProps = {
    value: string;
    onChangeText: (text: string) => void;

    activeOutlineColor?: string;
    outlineColor?: string;
    textColor?: string;

    placeholder?: string;
    placeholderTextColor?: string;
    backgroundColor?: string;

    style?: StyleProp<ViewStyle>;
    outlineStyle?: StyleProp<ViewStyle>;

};

const Input = ({
    value,
    onChangeText,
    activeOutlineColor,
    outlineColor,
    textColor,
    placeholder,
    placeholderTextColor,
    backgroundColor,
    style,
    outlineStyle,
}: InputProps) => (
    <TextInput
        mode="outlined"
        value={value}
        onChangeText={onChangeText}
        textColor={textColor}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        activeOutlineColor={activeOutlineColor}
        outlineColor={outlineColor}
        style={[
            {
                backgroundColor: backgroundColor,
            },
            style,
        ]}
        outlineStyle={outlineStyle}
    />
);

export default Input;