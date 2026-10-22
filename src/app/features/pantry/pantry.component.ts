import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PantryApiService } from '../../core/pantry-api.service';
import { PantryItem, UseSoon } from '../../core/models';
import { RouterLink } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { ExpiryInfo, expiryInfo } from './expiry';
import { toAbsoluteImageUrl } from '../../core/image-url';

@Component({
    selector: 'app-pantry',
    templateUrl: './pantry.component.html',
    styleUrls: ['./pantry.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [
        RouterLink,
        DecimalPipe,
        DatePipe,
    ],
})
export class PantryComponent implements OnInit {
  items: PantryItem[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';
  deletingItemId: number | null = null;
  savingExpiryId: number | null = null;
  useSoon: UseSoon | null = null;

  constructor(private readonly pantryApi: PantryApiService) {}

  expiry(item: PantryItem): ExpiryInfo | null {
    return expiryInfo(item.expiresOn);
  }

  imageUrl(path: string): string {
    return toAbsoluteImageUrl(path);
  }

  setExpiry(item: PantryItem, value: string): void {
    const expiresOn = value || null;
    if (expiresOn === (item.expiresOn ?? null)) {
      return;
    }
    this.savingExpiryId = item.id;
    this.successMessage = '';
    this.pantryApi.updateExpiry(item.id, expiresOn).subscribe({
      next: (updated) => {
        this.items = this.items
          .map((entry) => (entry.id === updated.id ? updated : entry))
          .sort((a, b) => (a.expiresOn ?? '9999').localeCompare(b.expiresOn ?? '9999'));
        this.savingExpiryId = null;
        this.loadUseSoon();
      },
      error: () => {
        this.errorMessage = 'Das Ablaufdatum konnte nicht gespeichert werden.';
        this.savingExpiryId = null;
      },
    });
  }

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
    this.loadUseSoon();
  }

  private loadUseSoon(): void {
    this.pantryApi.getUseSoon().subscribe({
      next: (useSoon) => (this.useSoon = useSoon),
      error: () => (this.useSoon = null),
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
        this.loadUseSoon();
      },
      error: () => {
        this.errorMessage = 'Der Artikel konnte nicht entfernt werden.';
        this.deletingItemId = null;
      },
    });
  }
}
