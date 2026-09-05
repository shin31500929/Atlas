import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import type { TripRecord } from './record.types';

/**
 * 記録の保存先。
 * process.cwd() は `npm run start:dev` を叩いたフォルダ = backend/ になるので、
 * 実体は backend/data/records.json。
 *
 * ※ 今はJSONファイル1枚だが、あとでDB（Prisma等）に置き換えるときは
 *   このファイルの中身だけ差し替えれば Service 側は触らなくて済む。
 */
const DATA_FILE = join(process.cwd(), 'data', 'records.json');

export const RECORDS_FILE_PATH = DATA_FILE;

/** ファイルから全記録を読み込む。ファイルが無い／壊れている場合は空配列。 */
export function loadRecords(): TripRecord[] {
  if (!existsSync(DATA_FILE)) {
    return [];
  }

  try {
    const raw = readFileSync(DATA_FILE, 'utf-8');
    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed) ? (parsed as TripRecord[]) : [];
  } catch {
    return [];
  }
}

/** 全記録をファイルに書き出す（毎回まるごと上書き）。 */
export function saveRecords(records: TripRecord[]): void {
  mkdirSync(dirname(DATA_FILE), { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
}
