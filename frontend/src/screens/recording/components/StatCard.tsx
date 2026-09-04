import { View, Text, StyleSheet } from "react-native";
import Card from "../../../components/Card";
import { COLORS } from "../constants";

type StatCardProps = {
  label: string;
  value: string;
  unit?: string;
  flex?: number;
};

function StatCard({ label, value, unit, flex = 1 }: StatCardProps) {
  return (
    <Card style={[styles.card, { flex }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
      {unit ? <Text style={styles.unit}>{unit}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 96,
  },
  label: {
    fontSize: 12,
    color: COLORS.label,
    marginBottom: 6,
  },
  value: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.text,
    fontVariant: ["tabular-nums"],
  },
  unit: {
    fontSize: 12,
    color: COLORS.label,
    marginTop: 2,
  },
});

export default StatCard;
