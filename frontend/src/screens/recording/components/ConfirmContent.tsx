import { View, Text, ScrollView, StyleSheet } from "react-native";
import Button from "../../../components/Button";
import StatCard from "./StatCard";
import RecordingMap from "./RecordingMap";
import { COLORS } from "../constants";
import type { RecordingSession } from "../types";
import {
  formatDistance,
  formatElapsedTime,
  formatSpeed,
} from "../utils";

type ConfirmContentProps = {
  session: RecordingSession;
  onPost: () => void;
  posting?: boolean;
};

function ConfirmContent({ session, onPost, posting = false }: ConfirmContentProps) {
  const tags = session.tags ?? [];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <RecordingMap
          route={session.route}
          goalLocation={session.goalLocation}
        />

        <View style={styles.statsRow}>
          <StatCard
            label="移動距離"
            value={formatDistance(session.distanceKm)}
            unit="km"
          />
          <StatCard
            label="最高速度"
            value={formatSpeed(session.maxSpeedKmh)}
            unit="km/h"
          />
          <StatCard
            label="移動時間"
            value={formatElapsedTime(session.elapsedMs)}
          />
        </View>

        {session.story ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ストーリー</Text>
            <Text style={styles.storyText}>{session.story}</Text>
          </View>
        ) : null}

        {tags.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>タグ</Text>
            <View style={styles.tagsRow}>
              {tags.map((tag) => (
                <Text key={tag} style={styles.tag}>
                  #{tag}
                </Text>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          text={posting ? "保存中..." : "この内容で投稿する"}
          onPress={onPost}
          buttonColor={COLORS.primary}
          textColor={COLORS.white}
          style={styles.postButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 20,
    paddingBottom: 24,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  storyText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.text,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    fontSize: 14,
    color: COLORS.primary,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  postButton: {
    width: "100%",
  },
});

export default ConfirmContent;
