import { View, ActivityIndicator, StyleSheet } from "react-native";

type LoadingProps = {
    color?: string;
    size?: "small" | "large" | number;
};

const Loading = ({ color, size }: LoadingProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        color={color} 
        size={size} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loading;