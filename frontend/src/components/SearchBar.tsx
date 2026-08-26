import { TextInput } from "react-native-paper";
import { StyleProp, TextStyle, ViewStyle } from "react-native";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;

  placeholder?: string;
  placeholderTextColor?: string;
  textColor?: string;
  backgroundColor?: string;

  activeOutlineColor?: string;

  style?: StyleProp<TextStyle | ViewStyle>;
};

const SearchBar = ({
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  textColor="#283d36",
  backgroundColor,
  activeOutlineColor="#6b7974",
  style,
}: SearchBarProps) => (
  <TextInput
    mode="outlined"
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor={placeholderTextColor}
    textColor={textColor}
    activeOutlineColor={activeOutlineColor}
    style={[
      {
        backgroundColor: backgroundColor,
      },
      style,
    ]}
  />
);

export default SearchBar;