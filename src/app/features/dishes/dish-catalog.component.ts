import { Component, DestroyRef, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, debounceTime, startWith, switchMap } from 'rxjs';
import { DishApiService } from '../../core/dish-api.service';
import { DishCatalogEntry } from '../../core/models';
import { AuthService, AuthenticatedUser } from '../../core/auth.service';

@Component({
    selector: 'app-dish-catalog',
    templateUrl: './dish-catalog.component.html',
    styleUrls: ['./dish-catalog.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DishCatalogComponent implements OnInit {
  dishes: DishCatalogEntry[] = [];
  search = '';
  tag = '';
  favoritesOnly = false;
  currentUser: AuthenticatedUser | null = null;
  loading = true;
  errorMessage = '';
  private readonly filterChanges = new Subject<void>();
  private readonly destroyRef = inject(DestroyRef);

  constructor(readonly dishApi: DishApiService, private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => (this.currentUser = user),
      error: () => (this.currentUser = null),
    });
    // Typing fires one request after a short pause; switchMap drops stale responses.
    this.filterChanges
      .pipe(
        debounceTime(250),
        startWith(undefined),
        switchMap(() => {
          this.loading = true;
          return this.dishApi.search(this.search.trim(), this.tag.trim(), this.favoritesOnly).pipe(
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
