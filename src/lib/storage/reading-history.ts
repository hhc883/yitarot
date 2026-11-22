'use client';

export interface SavedReading {
  id: string;
  type: 'tarot' | 'liuyao' | 'bazi';
  title: string;
  question?: string;
  timestamp: string;
  summary: string;
  fullContent: string;
  cards?: Array<{ name: string; position: string; isReversed: boolean }>;
  hexagram?: { primary: string; transformed?: string };
  chatHistory?: Array<{ role: 'user' | 'assistant'; text: string; timestamp?: string }>;
}

const STORAGE_KEY = 'yitarot:saved_readings';
const MAX_SAVED = 30;

/** 读取本地保存的所有测算与对话历史 */
export function getSavedReadings(): SavedReading[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

/** 保存或更新一条测算会话记录 */
export function saveReading(
  reading: Omit<SavedReading, 'id' | 'timestamp'> & { id?: string }
): SavedReading {
  if (typeof window === 'undefined') {
    return {
      ...reading,
      id: reading.id || String(Date.now()),
      timestamp: new Date().toISOString()
    };
  }

  try {
    const list = getSavedReadings();
    const existingIdx = reading.id ? list.findIndex(r => r.id === reading.id) : -1;

    const entry: SavedReading = {
      ...reading,
      id: reading.id || `reading_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: existingIdx >= 0 ? list[existingIdx].timestamp : new Date().toISOString()
    };

    let updated: SavedReading[];
    if (existingIdx >= 0) {
      updated = [...list];
      updated[existingIdx] = entry;
    } else {
      updated = [entry, ...list].slice(0, MAX_SAVED);
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return entry;
  } catch {
    return {
      ...reading,
      id: reading.id || String(Date.now()),
      timestamp: new Date().toISOString()
    };
  }
}

/** 删除单条历史记录 */
export function deleteSavedReading(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getSavedReadings().filter(r => r.id !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

/** 清空所有历史记录 */
export function clearAllSavedReadings(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
