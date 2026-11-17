import { Component, DestroyRef, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, debounceTime, startWith, switchMap, tap } from 'rxjs';
import { DishApiService } from '../../core/dish-api.service';
import { DishCatalogEntry } from '../../core/models';
import { AuthService, AuthenticatedUser } from '../../core/auth.service';
import { SnapshotCacheService } from '../../core/snapshot-cache.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StarRatingComponent } from '../../shared/star-rating.component';

const CATALOG_SNAPSHOT = 'dishes';

@Component({
    selector: 'app-dish-catalog',
    templateUrl: './dish-catalog.component.html',
    styleUrls: ['./dish-catalog.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, RouterLink, StarRatingComponent]
})
export class DishCatalogComponent implements OnInit {
  dishes: DishCatalogEntry[] = [];
  search = '';
  tag = '';
  favoritesOnly = false;
  currentUser: AuthenticatedUser | null = null;
  loading = true;
  errorMessage = '';
  /** Set when the catalog was opened from a plan to pick a dish for it. */
  readonly targetPlanId = Number(inject(ActivatedRoute).snapshot.queryParamMap.get('plan')) || null;
  private readonly filterChanges = new Subject<void>();
  private readonly destroyRef = inject(DestroyRef);
  private readonly snapshots = inject(SnapshotCacheService);

  constructor(readonly dishApi: DishApiService, private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => (this.currentUser = user),
      error: () => (this.currentUser = null),
    });
    // The unfiltered catalog from the last visit is shown at once.
    const snapshot = this.snapshots.read<DishCatalogEntry[]>(CATALOG_SNAPSHOT);
    if (snapshot?.length) {
      this.dishes = snapshot;
      this.loading = false;
    }
    // Typing fires one request after a short pause; switchMap drops stale responses.
    this.filterChanges
      .pipe(
        debounceTime(250),
        startWith(undefined),
        switchMap(() => {
          const unfiltered = !this.search.trim() && !this.tag.trim() && !this.favoritesOnly;
          this.loading = this.dishes.length === 0 || !unfiltered;
          return this.dishApi.search(this.search.trim(), this.tag.trim(), this.favoritesOnly).pipe(
            tap((dishes) => {
              if (unfiltered) {
                this.snapshots.write(CATALOG_SNAPSHOT, dishes);
              }
            }),
            catchError(() => {
              this.errorMessage = 'Die Gerichte konnten nicht geladen werden.';
              this.loading = false;
              return EMPTY;
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((dishes) => {
        this.dishes = dishes;
        this.errorMessage = '';
        this.loading = false;
      });
  }

  onFilterChange(): void {
    this.filterChanges.next();
  }
}
