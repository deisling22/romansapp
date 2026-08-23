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
  successMessage = '';
  deletingItemId: number | null = null;

  constructor(private readonly pantryApi: PantryApiService) {}

  purchaseAgeLabel(purchasedAt: string): string {
    const purchased = new Date(purchasedAt);
    const today = new Date();
    purchased.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const days = Math.max(0, Math.round((today.getTime() - purchased.getTime()) / 86_400_000));
    if (days === 0) {
      return 'Heute gekauft';
    }
    if (days === 1) {
      return 'Gestern gekauft';
    }
    return `Vor ${days} Tagen gekauft`;
  }

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
    this.successMessage = '';
    this.pantryApi.deleteItem(item.id).subscribe({
      next: () => {
        this.items = this.items.filter((entry) => entry.id !== item.id);
        this.successMessage = `${item.ingredientName} wurde aus dem Vorrat entfernt.`;
        this.deletingItemId = null;
      },
      error: () => {
        this.errorMessage = 'Der Artikel konnte nicht entfernt werden.';
        this.deletingItemId = null;
      },
    });
  }
}
