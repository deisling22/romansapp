import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

const STORAGE_KEY = 'speiseplan_onboarding_completed';

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private readonly visibleSubject = new BehaviorSubject<boolean>(!this.hasCompleted());
  readonly visible$ = this.visibleSubject.asObservable();
  private readonly completedSubject = new Subject<void>();
  /** Fires when the setup was finished, so open screens can reload what it changed. */
  readonly completed$ = this.completedSubject.asObservable();

  complete(): void {
    localStorage.setItem(STORAGE_KEY, 'true');
    this.visibleSubject.next(false);
    this.completedSubject.next();
  }

  restart(): void {
    this.visibleSubject.next(true);
  }

  private hasCompleted(): boolean {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }
}
