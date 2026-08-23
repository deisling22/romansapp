import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, CanDeactivateFn } from '@angular/router';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { ShoppingListApiService } from '../../core/shopping-list-api.service';
import { ShoppingListItem } from '../../core/models';
import { ConnectivityService } from '../../core/connectivity.service';
import { ShoppingListOutboxService } from '../../core/shopping-list-outbox.service';

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ShoppingListComponent implements OnInit {
  planId = 0;
  hasPlanContext = false;
  items: ShoppingListItem[] = [];
  loading = true;
  generating = false;
  errorMessage = '';
  newIngredientName = '';
  newQuantity = 1;
  newUnit = 'Stk.';
  adding = false;
  deletingItemId: number | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly shoppingListApi: ShoppingListApiService,
    readonly connectivity: ConnectivityService,
    private readonly outbox: ShoppingListOutboxService,
  ) {}

  ngOnInit(): void {
    const planId = this.route.snapshot.paramMap.get('planId');
    this.hasPlanContext = planId !== null;
    this.planId = Number(planId);
    this.load();
  }

  get openItems(): ShoppingListItem[] {
    return this.items.filter((item) => !item.checked);
  }

  get checkedItems(): ShoppingListItem[] {
    return this.items.filter((item) => item.checked);
  }

  load(): void {
    this.loading = true;
    const request = this.hasPlanContext
      ? this.shoppingListApi.getItems(this.planId)
      : this.shoppingListApi.getAllItems();
    request.subscribe({
      next: (items) => {
        this.items = items;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Die Einkaufsliste konnte nicht geladen werden.';
        this.loading = false;
      },
    });
  }

  addItem(): void {
    const name = this.newIngredientName.trim();
    const unit = this.newUnit.trim();
    if (!name || !unit || this.newQuantity <= 0 || this.adding) {
      return;
    }
    this.adding = true;
    this.shoppingListApi.addItem(name, this.newQuantity, unit).subscribe({
      next: (item) => {
        this.items = [...this.items, item];
        this.newIngredientName = '';
        this.newQuantity = 1;
        this.adding = false;
      },
      error: () => {
        this.errorMessage = 'Der Artikel konnte nicht hinzugefügt werden.';
        this.adding = false;
      },
    });
  }

  generate(): void {
    if (this.generating) {
      return;
    }
    this.generating = true;
    this.shoppingListApi.generate(this.planId).subscribe({
      next: (items) => {
        this.items = items;
        this.generating = false;
      },
      error: () => {
        this.errorMessage = 'Die Einkaufsliste konnte nicht erstellt werden.';
        this.generating = false;
      },
    });
  }

  toggle(item: ShoppingListItem): void {
    const checked = !item.checked;
    item.checked = checked;

    if (!this.connectivity.isOnline) {
      void this.outbox.queue(item.id, checked);
      return;
    }

    this.shoppingListApi.updateItem(item.id, checked).subscribe({
      error: () => {
        void this.outbox.queue(item.id, checked);
      },
    });
  }

  remove(item: ShoppingListItem): void {
    if (this.deletingItemId !== null) {
      return;
    }
    this.deletingItemId = item.id;
    this.shoppingListApi.deleteItem(item.id).subscribe({
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

  prepareForExit(): Observable<boolean> {
    const checkedItems = this.checkedItems;
    if (checkedItems.length === 0 || !this.connectivity.isOnline) {
      return of(true);
    }

    return forkJoin(checkedItems.map((item) => this.shoppingListApi.updateItem(item.id, true))).pipe(
      switchMap(() => this.shoppingListApi.checkout()),
      map(() => true),
      catchError(() => {
        this.errorMessage = 'Die gekauften Artikel konnten noch nicht in den Vorrat übernommen werden.';
        return of(false);
      }),
    );
  }
}

export const pendingCartCheckoutGuard: CanDeactivateFn<ShoppingListComponent> = (component) =>
  component.prepareForExit();

