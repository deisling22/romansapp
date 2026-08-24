import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { GamificationEventType, QueuedGamificationEvent, offlineDatabase } from './offline-db';

export interface ProfileFrame {
  id: string;
  name: string;
  requiredLevel: number;
  unlocked: boolean;
}

export interface ProfileTitle {
  id: string;
  name: string;
  requiredLevel: number;
  unlocked: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  tier: 'LOCKED' | 'BRONZE' | 'SILVER' | 'GOLD';
  progress: number;
  target: number;
  unlocked: boolean;
}

export interface GamificationGoal {
  id: string;
  name: string;
  progress: number;
  target: number;
  bonusXp: number;
  completed: boolean;
}

export interface GamificationProgress {
  xp: number;
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  currentStreak: number;
  bestStreak: number;
  streakShieldAvailable: boolean;
  cookedDishes: number;
  uniqueDishes: number;
  completedPlans: number;
  selectedFrame: string;
  selectedTitle: string;
  frames: ProfileFrame[];
  titles: ProfileTitle[];
  achievements: Achievement[];
  dailyGoals: GamificationGoal[];
  weeklyGoals: GamificationGoal[];
  seasonalChallenge: GamificationGoal;
  creatorChallenge: GamificationGoal;
  householdGoal: GamificationGoal;
}

@Injectable({ providedIn: 'root' })
export class GamificationService {
  private syncing = false;

  constructor(
    private readonly http: HttpClient,
    private readonly auth: AuthService,
  ) {
    window.addEventListener('online', () => void this.sync());
    void this.sync();
  }

  getProgress(): Observable<GamificationProgress> {
    return this.http.get<GamificationProgress>(`${environment.apiUrl}/gamification`);
  }

  updateSettings(selectedFrame: string, selectedTitle: string, weeklyCookTarget: number, householdWeeklyTarget: number) {
    return this.http.put<GamificationProgress>(`${environment.apiUrl}/gamification/settings`, {
      selectedFrame,
      selectedTitle,
      weeklyCookTarget,
      householdWeeklyTarget,
    });
  }

  async record(type: GamificationEventType, referenceId?: string, eventId = crypto.randomUUID()): Promise<void> {
    if (!this.auth.getToken()) {
      return;
    }
    const event: QueuedGamificationEvent = {
      eventId,
      type,
      referenceId,
      occurredAt: new Date().toISOString(),
    };
    await offlineDatabase.gamificationOutbox.put(event);
    await this.sync();
  }

  async sync(): Promise<void> {
    if (this.syncing || !navigator.onLine || !this.auth.getToken()) {
      return;
    }
    this.syncing = true;
    try {
      const events = await offlineDatabase.gamificationOutbox.toArray();
      if (!events.length) {
        return;
      }
      await firstValueFrom(this.http.post(`${environment.apiUrl}/gamification/events`, { events }));
      await offlineDatabase.gamificationOutbox.bulkDelete(events.map((event) => event.eventId));
    } catch {
      // Events remain queued until the next successful online sync.
    } finally {
      this.syncing = false;
    }
  }
}