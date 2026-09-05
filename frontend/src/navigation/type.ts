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
  RecordingMap: { trip?: TripRecord } | undefined;
};

export default RootStackParamList;
