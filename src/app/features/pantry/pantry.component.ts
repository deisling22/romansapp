import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PantryApiService } from '../../core/pantry-api.service';
import { PantryItem } from '../../core/models';

@Component({
  selector: 'app-pantry',
  templateUrl: './pantry.component.html',
  styleUrls: ['./pantry.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PantryComponent implements OnInit {
  items: PantryItem[] = [];
  loading = true;
  errorMessage = '';
  deletingItemId: number | null = null;

  constructor(private readonly pantryApi: PantryApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.pantryApi.getItems().subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Der Vorratsschrank konnte nicht geladen werden.';
        this.loading = false;
      },
    });
  }

  remove(item: PantryItem): void {
    if (this.deletingItemId !== null) {
      return;
    }
    this.deletingItemId = item.id;
    this.pantryApi.deleteItem(item.id).subscribe({
      next: () => {
        this.items = this.items.filter((entry) => entry.id !== item.id);
        this.deletingItemId = null;
      },
      error: () => {
        this.errorMessage = 'Der Artikel konnte nicht entfernt werden.';
        this.deletingItemId = null;
      },
    });
  }
}
