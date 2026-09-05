import { useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Appbar,
  Button as PaperButton,
  Dialog,
  Portal,
  Text as PaperText,
} from "react-native-paper";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type RootStackParamList from "../../navigation/type";
import ConfirmContent from "./components/ConfirmContent";
import { COLORS } from "./constants";
import { saveTrip } from "./storage/tripStorage";
import { updateRecordDetails } from "../../api/records";

type Props = NativeStackScreenProps<RootStackParamList, "Confirm">;

/**
 * 結果の知らせ方について:
 * React Native の Alert は Web (react-native-web) では実装がなく、呼んでも何も起きない。
 * Alert の OK に画面遷移をぶら下げると、Web では「ボタンを押しても無反応」になる。
 * react-native-paper の Dialog は iOS / Android / Web すべてで動くのでこちらを使う。
 */
type DialogState = {
  title: string;
  message: string;
  /** OK を押したときに記録タブ（ホーム）まで戻るか */
  goHomeOnClose: boolean;
};

function normalizeTag(raw: string): string | null {
  const cleaned = raw.trim().replace(/^#+/, "").trim();
  return cleaned.length > 0 ? cleaned : null;
}

function ConfirmScreen({ navigation, route }: Props) {
  const { session, recordId } = route.params;
  const [saving, setSaving] = useState(false);
  const [posted, setPosted] = useState(false);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [story, setStory] = useState(session.story ?? "");
  const [tags, setTags] = useState<string[]>(session.tags ?? []);
  const [tagInput, setTagInput] = useState("");

  // 確定に成功したあと、連打で同じ記録が何件も増えるのを防ぐ
  const submittedRef = useRef(false);

  const handleEdit = () => {
    navigation.goBack();
  };

  const closeDialog = () => {
    const goHome = dialog?.goHomeOnClose ?? false;
    setDialog(null);

    if (goHome) {
      navigation.popToTop();
    }
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
    if (saving || submittedRef.current) {
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
      setDialog({
        title: "保存できません",
        message: "開始位置または目的地が不足しています。",
        goHomeOnClose: false,
      });
      return;
    }

    setSaving(true);

    // バックエンドへの story/タグ保存が失敗しても、記録タブへの保存は続ける
    let backendFailed = false;

    try {
      if (recordId) {
        try {
          await updateRecordDetails(recordId, {
            story: finalStory.length > 0 ? finalStory : null,
            tags: finalTags,
          });
        } catch (error) {
          backendFailed = true;
          console.error("ストーリー/タグ保存エラー:", error);
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

      submittedRef.current = true;
      setPosted(true);
      setDialog({
        title: "記録に保存しました",
        message: backendFailed
          ? "記録タブに保存しました。（ストーリー・タグのサーバー保存には失敗しました）"
          : recordId
            ? "ストーリー・タグを含めてバックエンドと記録タブに保存しました。"
            : "記録タブに保存しました。",
        goHomeOnClose: true,
      });
    } catch (error) {
      console.error("記録の保存エラー:", error);
      setDialog({
        title: "保存に失敗しました",
        message: "もう一度お試しください。",
        goHomeOnClose: false,
      });
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
          posted={posted}
        />
      </View>

      <Portal>
        <Dialog visible={dialog !== null} onDismiss={closeDialog}>
          <Dialog.Title>{dialog?.title ?? ""}</Dialog.Title>
          <Dialog.Content>
            <PaperText variant="bodyMedium">{dialog?.message ?? ""}</PaperText>
          </Dialog.Content>
          <Dialog.Actions>
            <PaperButton onPress={closeDialog}>OK</PaperButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
