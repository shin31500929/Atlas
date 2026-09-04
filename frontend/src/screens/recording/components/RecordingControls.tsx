import { View, StyleSheet } from "react-native";
import Button from "../../../components/Button";
import { COLORS } from "../constants";

type RecordingControlsProps = {
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
};

function RecordingControls({
  isPaused,
  onPause,
  onResume,
  onStop,
}: RecordingControlsProps) {
  return (
    <View style={styles.container}>
      <Button
        text={isPaused ? "再開" : "一時停止"}
        iconName={isPaused ? "play" : "pause"}
        onPress={isPaused ? onResume : onPause}
        buttonColor={COLORS.white}
        textColor={COLORS.text}
        borderColor={COLORS.text}
        style={styles.button}
      />
      <Button
        text="記録終了"
        iconName="stop"
        onPress={onStop}
        buttonColor={COLORS.stop}
        textColor={COLORS.white}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
  },
  button: {
    flex: 1,
  },
});

export default RecordingControls;
