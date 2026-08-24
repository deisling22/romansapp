import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'speiseplan_onboarding_completed';

@Injectable({ providedIn: 'root' })
export class OnboardingService {
  private readonly visibleSubject = new BehaviorSubject<boolean>(!this.hasCompleted());
  readonly visible$ = this.visibleSubject.asObservable();

  complete(): void {
    localStorage.setItem(STORAGE_KEY, 'true');
    this.visibleSubject.next(false);
  }

  restart(): void {
    this.visibleSubject.next(true);
  }

  private hasCompleted(): boolean {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }
}
