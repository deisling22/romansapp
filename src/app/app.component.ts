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
import { BackendStatusService } from './core/backend-status.service';
import { PurchaseInboxService } from './core/purchase-inbox.service';
import { resolveSharedImport } from './core/shared-import';

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
    readonly backendStatus: BackendStatusService,
    private readonly swUpdate: SwUpdate,
    // injected eagerly so its online-listener is registered as soon as the app starts
    private readonly shoppingListOutbox: ShoppingListOutboxService,
    private readonly recipeSync: RecipeSyncService,
    private readonly creatorNotifications: CreatorNotificationService,
    private readonly gamification: GamificationService,
    private readonly router: Router,
    private readonly purchaseInbox: PurchaseInboxService,
  ) {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
        .subscribe(() => (this.updateAvailable = true));
    }
    this.handleSharedLink();
  }

  /** Shared shopping text and existing recipe links use the same Web Share Target. */
  private handleSharedLink(): void {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('url') && !params.has('text') && !params.has('title')) {
      return;
    }
    const shared = resolveSharedImport(params);
    window.history.replaceState(null, '', window.location.pathname + window.location.hash);
    if (shared?.kind === 'purchase') {
      this.purchaseInbox.text.set(shared.text);
      void this.router.navigate(['/purchase-import']);
    } else if (shared?.kind === 'recipe') {
      void this.router.navigate(['/recipe-scan'], { queryParams: { url: shared.url } });
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

  get publicPollPage(): boolean {
    return this.router.url.startsWith('/vote/');
  }
}
