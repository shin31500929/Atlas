import type {
  LatLng,
  RecordingSession,
  TripRecord,
} from "../screens/recording/types";

type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Post: undefined;
  DestinationSetup: undefined;
  Recording:
    | {
        destination: LatLng;
        startLocation?: LatLng;
      }
    | undefined;
  Confirm: { session: RecordingSession; recordId?: string | null };
  /**
   * trip をそのまま渡すか、recordId だけ渡して画面側で取り直すかの2通り。
   * 記録タブからは trip、タイムラインの投稿からは recordId で開く。
   */
  RecordingMap: { trip?: TripRecord; recordId?: string } | undefined;
};

export default RootStackParamList;
