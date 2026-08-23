import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
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

  constructor(readonly dishApi: DishApiService, private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => (this.currentUser = user),
      error: () => (this.currentUser = null),
    });
    this.load();
  }

  onFilterChange(): void {
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.dishApi.search(this.search.trim(), this.tag.trim(), this.favoritesOnly).subscribe({
      next: (dishes) => {
        this.dishes = dishes;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Die Gerichte konnten nicht geladen werden.';
        this.loading = false;
      },
    });
  }
}
