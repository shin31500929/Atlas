import { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type RootStackParamList from '../../navigation/type';
import {
  createRecord,
  endRecord,
  getRecords,
} from '../../api/records';

type Props = NativeStackScreenProps<RootStackParamList, 'Recording'>;

type RecordData = {
  id: string;
  title: string;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;
};

function RecordingScreen({ navigation }: Props) {
  const [title] = useState('東京散策');
  const [records, setRecords] = useState<RecordData[]>([]);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(
    null,
  );

  // 記録一覧を取得
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getRecords();

        console.log('records:', data);

        setRecords(data);
      } catch (error) {
        console.error('記録取得エラー:', error);
      }
    };

    fetchRecords();
  }, []);

  // 記録開始
  const handleStartRecording = async () => {
    try {
      const startedAt = new Date().toISOString();

      const newRecord = await createRecord(title, startedAt);

      console.log('記録作成成功:', newRecord);

      setCurrentRecordId(newRecord.id);

      const data = await getRecords();
      setRecords(data);
    } catch (error) {
      console.error('記録作成エラー:', error);
    }
  };

  // 記録終了
  const handleEndRecording = async () => {
    if (!currentRecordId) {
      return;
    }

    try {
      const endedRecord = await endRecord(currentRecordId);

      console.log('記録終了成功:', endedRecord);

      setCurrentRecordId(null);

      const data = await getRecords();
      setRecords(data);
    } catch (error) {
      console.error('記録終了エラー:', error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <Text>Recording</Text>

      <Text>{title}</Text>

      {currentRecordId === null ? (
        <Button
          title="記録開始"
          onPress={handleStartRecording}
        />
      ) : (
        <Button
          title="記録終了"
          onPress={handleEndRecording}
        />
      )}

      <Text>記録一覧</Text>

      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>タイトル: {item.title}</Text>
            <Text>開始: {item.startedAt}</Text>
            <Text>
              終了: {item.endedAt ?? '記録中'}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

export default RecordingScreen;