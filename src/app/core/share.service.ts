import { Injectable } from '@angular/core';

export type ShareResult = 'shared' | 'copied' | 'cancelled';

@Injectable({ providedIn: 'root' })
export class ShareService {
  async share(title: string, text: string, url = window.location.href): Promise<ShareResult> {
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