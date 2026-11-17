import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const SLOW_AFTER_MS = 5_000;

/**
 * Tells the user when the backend is waking up. The free instance sleeps after inactivity and needs
 * minutes for the first answer; without a hint the app just looks broken.
 */
@Injectable({ providedIn: 'root' })
export class BackendStatusService {
  private readonly wakingSubject = new BehaviorSubject<boolean>(false);
  /** True while at least one request has been waiting unusually long. */
  readonly waking$ = this.wakingSubject.asObservable();
  private slowRequests = 0;

  /** Call when a request starts; invoke the returned function when it ends. */
  track(): () => void {
    let slow = false;
    const timer = setTimeout(() => {
      slow = true;
      this.slowRequests++;
      this.wakingSubject.next(true);
    }, SLOW_AFTER_MS);
    return () => {
      clearTimeout(timer);
      if (slow) {
        slow = false;
        this.slowRequests--;
        this.wakingSubject.next(this.slowRequests > 0);
      }
    };
  }
}
