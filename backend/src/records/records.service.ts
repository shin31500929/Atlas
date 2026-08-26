import { Injectable } from '@nestjs/common';

@Injectable()
export class RecordsService {
  private records = [
    {
      id: '1',
      title: '東京散策',
      startedAt: '2026-08-26T10:00:00.000Z',
      endedAt: null,
      createdAt: '2026-08-26T10:00:00.000Z',
    },
  ];

  findAll() {
    return this.records;
  }

  create(data: { title: string; startedAt: string }) {
    const record = {
      id: String(this.records.length + 1),
      title: data.title,
      startedAt: data.startedAt,
      endedAt: null,
      createdAt: new Date().toISOString(),
    };

    this.records.push(record);

    return record;
  }
}
