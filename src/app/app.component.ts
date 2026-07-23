import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs/operators';
import { ConnectivityService } from './core/connectivity.service';
import { ShoppingListOutboxService } from './core/shopping-list-outbox.service';

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
    private readonly swUpdate: SwUpdate,
    // injected eagerly so its online-listener is registered as soon as the app starts
    private readonly shoppingListOutbox: ShoppingListOutboxService,
  ) {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
        .subscribe(() => (this.updateAvailable = true));
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


