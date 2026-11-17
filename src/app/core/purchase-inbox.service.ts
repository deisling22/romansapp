import { Injectable, signal } from '@angular/core';

/** In-memory handoff; shared shopping data is not kept in URLs or local storage. */
@Injectable({ providedIn: 'root' })
export class PurchaseInboxService {
  readonly text = signal('');

  take(): string {
    const text = this.text();
    this.text.set('');
    return text;
  }
}
