import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ConnectivityService } from './core/connectivity.service';
import { ShoppingListOutboxService } from './core/shopping-list-outbox.service';
import { NotificationService } from './core/notification.service';
import { RecipeSyncService } from './core/recipe-sync.service';
import { CreatorNotificationService } from './core/creator-notification.service';
import { GamificationService } from './core/gamification.service';
import { OnboardingService } from './core/onboarding.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent {
  updateAvailable = false;
  menuOpen = false;

  constructor(
    readonly connectivity: ConnectivityService,
    readonly notifications: NotificationService,
    readonly onboarding: OnboardingService,
    private readonly swUpdate: SwUpdate,
    // injected eagerly so its online-listener is registered as soon as the app starts
    private readonly shoppingListOutbox: ShoppingListOutboxService,
    private readonly recipeSync: RecipeSyncService,
    private readonly creatorNotifications: CreatorNotificationService,
    private readonly gamification: GamificationService,
    private readonly router: Router,
  ) {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
        .subscribe(() => (this.updateAvailable = true));
    }
    this.handleSharedLink();
  }

  /** Web Share Target (manifest): shared recipe links arrive as ?url= / ?text= on the start URL. */
  private handleSharedLink(): void {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('url') && !params.has('text')) {
      return;
    }
    const candidates = [params.get('url'), params.get('text'), params.get('title')].filter(Boolean).join(' ');
    const sharedUrl = /https?:\/\/\S+/.exec(candidates)?.[0];
    window.history.replaceState(null, '', window.location.pathname + window.location.hash);
    if (sharedUrl) {
      void this.router.navigate(['/recipe-scan'], { queryParams: { url: sharedUrl } });
    }
  }

  reloadForUpdate(): void {
    window.location.reload();
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}


