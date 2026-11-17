import { Injectable } from '@angular/core';

const PREFIX = 'speiseplan_snapshot_';

/**
 * Last successful server answers per screen. Screens paint the snapshot immediately and refresh in the
 * background, so a sleeping backend (free tier: up to a minute) does not leave the user with a spinner.
 */
@Injectable({ providedIn: 'root' })
export class SnapshotCacheService {
  read<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  write<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // Storage full or blocked: the app simply works without snapshots
    }
  }

  /** Snapshots belong to one household; drop them when the signed-in user changes. */
  clear(): void {
    try {
      Object.keys(localStorage)
        .filter((key) => key.startsWith(PREFIX))
        .forEach((key) => localStorage.removeItem(key));
    } catch {
      // nothing to clear
    }
  }
}
