import { useState } from "react";
import { View, Text, Pressable, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar } from "react-native-paper";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type RootStackParamList from "../../navigation/type";
import ConfirmContent from "./components/ConfirmContent";
import { COLORS } from "./constants";
import { saveTrip } from "./storage/tripStorage";
import { updateRecordDetails } from "../../api/records";

type Props = NativeStackScreenProps<RootStackParamList, "Confirm">;

function normalizeTag(raw: string): string | null {
  const cleaned = raw.trim().replace(/^#+/, "").trim();
  return cleaned.length > 0 ? cleaned : null;
}

function ConfirmScreen({ navigation, route }: Props) {
  const { session, recordId } = route.params;
  const [saving, setSaving] = useState(false);
  const [story, setStory] = useState(session.story ?? "");
  const [tags, setTags] = useState<string[]>(session.tags ?? []);
  const [tagInput, setTagInput] = useState("");

  const handleEdit = () => {
    navigation.goBack();
  };

  const handleAddTag = () => {
    const tag = normalizeTag(tagInput);
    if (!tag) {
      setTagInput("");
      return;
    }
    setTags((current) =>
      current.some((item) => item.toLowerCase() === tag.toLowerCase())
        ? current
        : [...current, tag],
    );
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setTags((current) => current.filter((item) => item !== tag));
  };

  const handlePost = async () => {
    if (saving) {
      return;
    }

    // 入力中のタグも確定に含める
    const pendingTag = normalizeTag(tagInput);
    const finalTags =
      pendingTag &&
      !tags.some((item) => item.toLowerCase() === pendingTag.toLowerCase())
        ? [...tags, pendingTag]
        : tags;
    const finalStory = story.trim();

    const startLocation = session.startLocation ?? session.route[0];
    const goalLocation =
      session.goalLocation ?? session.route[session.route.length - 1];
    const startedAt = session.startedAt ?? new Date().toISOString();
    const endedAt = session.endedAt ?? new Date().toISOString();

    if (!startLocation || !goalLocation) {
      Alert.alert(
        "保存できません",
        "開始位置または目的地が不足しています。",
      );
      return;
    }

    setSaving(true);
    try {
      if (recordId) {
        try {
          await updateRecordDetails(recordId, {
            story: finalStory.length > 0 ? finalStory : null,
            tags: finalTags,
          });
        } catch (error) {
          console.error("ストーリー/タグ保存エラー:", error);
          Alert.alert(
            "バックエンドへの保存に失敗しました",
            "ローカルには保存します。",
          );
        }
      }

      await saveTrip({
        startLocation: {
          latitude: startLocation.latitude,
          longitude: startLocation.longitude,
        },
        goalLocation: {
          latitude: goalLocation.latitude,
          longitude: goalLocation.longitude,
        },
        startedAt,
        endedAt,
        distanceKm: session.distanceKm,
        maxSpeedKmh: session.maxSpeedKmh,
        elapsedMs: session.elapsedMs,
        route: session.route,
        story: finalStory.length > 0 ? finalStory : undefined,
        tags: finalTags,
      });

      Alert.alert(
        "保存しました",
        recordId
          ? "ストーリー・タグを含めてバックエンドと記録タブに保存しました。"
          : "記録タブに保存しました。",
        [
          {
            text: "OK",
            onPress: () => navigation.popToTop(),
          },
        ],
      );
    } catch {
      Alert.alert("保存に失敗しました", "もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.modalContainer}>
        <Appbar.Header style={styles.header} statusBarHeight={0}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="記録の確認" titleStyle={styles.title} />
          <Pressable onPress={handleEdit} style={styles.editButton} hitSlop={8}>
            <Text style={styles.editText}>編集</Text>
          </Pressable>
        </Appbar.Header>

        <ConfirmContent
          session={session}
          story={story}
          tags={tags}
          tagInput={tagInput}
          onChangeStory={setStory}
          onChangeTagInput={setTagInput}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onPost={handlePost}
          posting={saving}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.white,
    elevation: 0,
  },
  title: {
    fontWeight: "600",
    color: COLORS.text,
  },
  editButton: {
    paddingHorizontal: 16,
    justifyContent: "center",
    height: "100%",
  },
  editText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "600",
  },
});

export default ConfirmScreen;
