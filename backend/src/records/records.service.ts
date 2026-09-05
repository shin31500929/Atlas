import { Injectable } from '@nestjs/common';

type RecordData = {
  id: string;
  title: string;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;
  story: string | null;
  tags: string[];
};

type LocationData = {
  id: string;
  recordId: string;
  latitude: number;
  longitude: number;
  recordedAt: string;
};

@Injectable()
export class RecordsService {
  private records: RecordData[] = [
    {
      id: '1',
      title: '東京散策',
      startedAt: '2026-08-26T10:00:00.000Z',
      endedAt: null,
      createdAt: '2026-08-26T10:00:00.000Z',
      story: null,
      tags: [],
    },
  ];

  private locations: LocationData[] = [];

  findAll() {
    return this.records;
  }

  create(data: { title: string; startedAt: string }) {
    console.log('CREATE RECORD:', data);

    const record: RecordData = {
      id: String(this.records.length + 1),
      title: data.title,
      startedAt: data.startedAt,
      endedAt: null,
      createdAt: new Date().toISOString(),
      story: null,
      tags: [],
    };

    this.records.push(record);

    return record;
  }

  end(id: string) {
    console.log('END RECORD:', id);

    const record = this.records.find((record) => record.id === id);

    if (!record) {
      return null;
    }

    record.endedAt = new Date().toISOString();

    return record;
  }

  updateDetails(
    id: string,
    data: {
      story?: string | null;
      tags?: string[];
    },
  ) {
    console.log('UPDATE RECORD DETAILS:', id, data);

    const record = this.records.find((record) => record.id === id);

    if (!record) {
      return null;
    }

    if (data.story !== undefined) {
      record.story = data.story;
    }

    if (data.tags !== undefined) {
      record.tags = data.tags;
    }

    return record;
  }

  addLocation(
    recordId: string,
    data: {
      latitude: number;
      longitude: number;
      recordedAt: string;
    },
  ) {
    console.log('ADD LOCATION:', recordId, data);

    const record = this.records.find((record) => record.id === recordId);

    if (!record) {
      return null;
    }

    const location: LocationData = {
      id: String(this.locations.length + 1),
      recordId,
      latitude: data.latitude,
      longitude: data.longitude,
      recordedAt: data.recordedAt,
    };

    this.locations.push(location);

    return location;
  }

  findLocations(recordId: string) {
    return this.locations.filter((location) => location.recordId === recordId);
  }
}
