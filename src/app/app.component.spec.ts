import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SwUpdate } from '@angular/service-worker';
import { EMPTY, of } from 'rxjs';
import { ConnectivityService } from './core/connectivity.service';
import { ShoppingListOutboxService } from './core/shopping-list-outbox.service';
import { AppComponent } from './app.component';
import { RecipeSyncService } from './core/recipe-sync.service';
import { CreatorNotificationService } from './core/creator-notification.service';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [AppComponent],
    providers: [
      { provide: ConnectivityService, useValue: { online$: of(true), isOnline: true } },
      { provide: SwUpdate, useValue: { isEnabled: false, versionUpdates: EMPTY } },
      { provide: ShoppingListOutboxService, useValue: {} },
      { provide: RecipeSyncService, useValue: {} },
      { provide: CreatorNotificationService, useValue: {} },
    ],
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

