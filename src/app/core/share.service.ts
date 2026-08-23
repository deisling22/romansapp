import { Injectable } from '@angular/core';

export type ShareResult = 'shared' | 'copied' | 'cancelled';

@Injectable({ providedIn: 'root' })
export class ShareService {
  async share(title: string, text: string): Promise<ShareResult> {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return 'shared';
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return 'cancelled';
        }
      }
    }

    await navigator.clipboard.writeText(url);
    return 'copied';
  }
}