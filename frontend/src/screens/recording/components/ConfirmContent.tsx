import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
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
  story: string;
  tags: string[];
  tagInput: string;
  onChangeStory: (value: string) => void;
  onChangeTagInput: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  onPost: () => void;
  /** 保存中 */
  posting?: boolean;
  /** 保存済み（連打で二重に記録が増えないようボタンを止める） */
  posted?: boolean;
};

function ConfirmContent({
  session,
  story,
  tags,
  tagInput,
  onChangeStory,
  onChangeTagInput,
  onAddTag,
  onRemoveTag,
  onPost,
  posting = false,
  posted = false,
}: ConfirmContentProps) {
  const locked = posting || posted;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ストーリー</Text>
          <TextInput
            value={story}
            onChangeText={onChangeStory}
            placeholder="今日の移動のひとことメモを書いてください"
            placeholderTextColor={COLORS.label}
            multiline
            style={styles.storyInput}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>タグ</Text>
          <View style={styles.tagInputRow}>
            <Text style={styles.hashPrefix}>#</Text>
            <TextInput
              value={tagInput}
              onChangeText={(text) =>
                onChangeTagInput(text.replace(/^#+/, ""))
              }
              placeholder="タグを入力（例: 箱根）"
              placeholderTextColor={COLORS.label}
              style={styles.tagInput}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={onAddTag}
              blurOnSubmit={false}
            />
            <Pressable
              onPress={onAddTag}
              style={styles.addTagButton}
              hitSlop={8}
            >
              <Text style={styles.addTagText}>追加</Text>
            </Pressable>
          </View>
          {tags.length > 0 ? (
            <View style={styles.tagsRow}>
              {tags.map((tag) => (
                <Pressable
                  key={tag}
                  onPress={() => onRemoveTag(tag)}
                  style={styles.tagChip}
                >
                  <Text style={styles.tagChipText}>#{tag}</Text>
                  <Text style={styles.tagRemove}>×</Text>
                </Pressable>
              ))}
            </View>
          ) : (
            <Text style={styles.tagHint}>
              入力して「追加」かキーボードの完了でタグを付けます
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          text={
            posted ? "保存しました" : posting ? "保存中..." : "記録を確定する"
          }
          onPress={locked ? () => {} : onPost}
          buttonColor={locked ? COLORS.border : COLORS.primary}
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
  storyInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  tagInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
  },
  hashPrefix: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
    marginRight: 2,
  },
  tagInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  addTagButton: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  addTagText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.gpsBadgeBg,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagChipText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
  },
  tagRemove: {
    fontSize: 14,
    color: COLORS.label,
  },
  tagHint: {
    fontSize: 12,
    color: COLORS.label,
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
