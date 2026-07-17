import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConnectivityService {
  private readonly onlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  readonly online$: Observable<boolean> = this.onlineSubject.asObservable();

  constructor(private readonly zone: NgZone) {
    window.addEventListener('online', () => this.zone.run(() => this.onlineSubject.next(true)));
    window.addEventListener('offline', () => this.zone.run(() => this.onlineSubject.next(false)));
  }

  get isOnline(): boolean {
    return this.onlineSubject.value;
  }
}
