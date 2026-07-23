import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  items: ShoppingListItem[] = [];
  loading = true;
  generating = false;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly shoppingListApi: ShoppingListApiService,
    readonly connectivity: ConnectivityService,
    private readonly outbox: ShoppingListOutboxService,
  ) {}

  ngOnInit(): void {
    this.planId = Number(this.route.snapshot.paramMap.get('planId'));
    this.load();
  }

  load(): void {
    this.loading = true;
    this.shoppingListApi.getItems(this.planId).subscribe({
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
}

