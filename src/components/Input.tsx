import { TextInput } from "react-native-paper";

type InputProps = {
    value: string;
    onChangeText: (text: string) => void;

    activeOutlineColor?: string;
    outlineColor?: string;
    textColor?: string;

    placeholder?: string;
    placeholderTextColor?: string;
    backgroundColor?: string;

    width?: number;
    height?: number;
    borderRadius?: number;

    borderVisible?: boolean;
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
    width,
    height,
    borderRadius,
    borderVisible = true,
}: InputProps) => (
    <TextInput
        mode="outlined"
        value={value}
        onChangeText={onChangeText}
        activeOutlineColor={
            borderVisible ? activeOutlineColor : "transparent"}
        outlineColor={
            borderVisible ? outlineColor : "transparent"}
        textColor={textColor}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        style={{
            width: width,
            height: height,
            backgroundColor: backgroundColor,
        }}
        outlineStyle={{
            borderRadius,
        }}
    />
);

export default Input;