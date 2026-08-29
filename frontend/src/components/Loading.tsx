import { ActivityIndicator } from "react-native";

type LoadingProps = {
  color?: string;
  size?: "small" | "large" | number;
};

const Loading = ({ color, size }: LoadingProps) => {
  return <ActivityIndicator color={color} size={size} />;
};

export default Loading;