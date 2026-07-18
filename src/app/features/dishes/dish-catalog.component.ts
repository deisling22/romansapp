import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DishApiService } from '../../core/dish-api.service';
import { DishCatalogEntry } from '../../core/models';

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
  loading = true;
  errorMessage = '';

  constructor(readonly dishApi: DishApiService) {}

  ngOnInit(): void {
    this.load();
  }

  onFilterChange(): void {
    this.load();
  }

  private load(): void {
    this.loading = true;
    this.dishApi.search(this.search.trim(), this.tag.trim()).subscribe({
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
