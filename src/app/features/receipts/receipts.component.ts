import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HouseholdApiService } from '../../core/household-api.service';
import { Receipt } from '../../core/models';
import { RecipeOcrService } from '../recipe-scan/recipe-ocr.service';
import { parseReceiptText } from './receipt-parser';

function isoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** Receipts are household expenses; their sum feeds the cost card on the dashboard. */
@Component({
  selector: 'app-receipts',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, RouterLink, DecimalPipe, DatePipe],
  template: `
    <main class="screen">
      <header class="page-header">
        <p class="eyebrow">Kosten</p>
        <h1>Belege &amp; Ausgaben</h1>
        <p>Fotografiere deinen Kassenbon – Betrag, Datum und Markt werden auf dem Gerät erkannt und vor dem Speichern von dir geprüft.</p>
      </header>

      <section class="card">
        <div class="capture">
          <label class="capture-button">
            Beleg fotografieren
            <input type="file" accept="image/*" capture="environment" (change)="scan($event)" [disabled]="scanning()" />
          </label>
          <label class="capture-button secondary">
            Aus Mediathek
            <input type="file" accept="image/*" (change)="scan($event)" [disabled]="scanning()" />
          </label>
        </div>
        @if (scanning()) {
          <p class="status" role="status">Beleg wird gelesen ... {{ progress() }} %</p>
        }

        <form class="receipt-form" (ngSubmit)="save()">
          <label>
            <span>Betrag (€)</span>
            <input name="totalEur" type="number" min="0.01" max="100000" step="0.01" [(ngModel)]="totalEur" required data-testid="receipt-total" />
          </label>
          <label>
            <span>Datum</span>
            <input name="purchasedOn" type="date" [max]="today" [(ngModel)]="purchasedOn" required />
          </label>
          <label>
            <span>Markt (optional)</span>
            <input name="store" maxlength="80" [(ngModel)]="store" placeholder="z. B. REWE" />
          </label>
          <button type="submit" [disabled]="saving() || !totalEur || totalEur <= 0 || !purchasedOn">
            {{ saving() ? 'Wird gespeichert ...' : 'Ausgabe speichern' }}
          </button>
        </form>
        @if (error()) {
          <p class="field-error" role="alert">{{ error() }}</p>
        }
      </section>

      <section class="card">
        <h2>Diesen Monat <span class="sum" data-testid="receipts-month-sum">{{ monthSum() | number: '1.2-2' }} €</span></h2>
        <ul class="receipt-list">
          @for (receipt of receipts(); track receipt.id) {
            <li>
              <span class="date">{{ receipt.purchasedOn | date: 'dd.MM.' }}</span>
              <span class="store">{{ receipt.store || 'Einkauf' }}</span>
              <strong>{{ receipt.totalEur | number: '1.2-2' }} €</strong>
              <button type="button" class="remove" (click)="remove(receipt)" [attr.aria-label]="'Beleg vom ' + receipt.purchasedOn + ' löschen'">×</button>
            </li>
          } @empty {
            <li class="empty">Noch keine Ausgaben in diesem Monat.</li>
          }
        </ul>
        <p class="hint">Kosten pro Gericht oder Plan kannst du zusätzlich direkt beim Gericht bzw. Plan eintragen. <a routerLink="/settings">Kostenanzeige in den Einstellungen</a></p>
      </section>
    </main>
  `,
  styles: `
    .card { background: var(--surface, #fff); border-radius: 14px; padding: 16px; margin-bottom: 16px; display: grid; gap: 12px; }
    .capture { display: flex; gap: 8px; flex-wrap: wrap; }
    .capture-button { position: relative; padding: 10px 14px; border-radius: 10px; background: var(--tint); color: #fff; font-weight: 600; cursor: pointer; }
    .capture-button.secondary { background: var(--fill-strong); color: inherit; }
    .capture-button input { position: absolute; width: 1px; height: 1px; opacity: 0; overflow: hidden; }
    .receipt-form { display: grid; gap: 10px; }
    .receipt-form label { display: grid; gap: 4px; font-weight: 600; font-size: 0.85rem; }
    h2 { display: flex; justify-content: space-between; margin: 0; font-size: 1.1rem; }
    .receipt-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
    .receipt-list li { display: flex; align-items: center; gap: 10px; }
    .store { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .date, .hint, .empty { opacity: 0.7; font-size: 0.85rem; }
    .remove { background: none; border: 0; font-size: 1.3rem; cursor: pointer; color: inherit; padding: 0 4px; }
  `,
})
export class ReceiptsComponent implements OnInit {
  readonly today = isoDate(new Date());
  readonly receipts = signal<Receipt[]>([]);
  readonly monthSum = computed(() => this.receipts().reduce((sum, receipt) => sum + receipt.totalEur, 0));
  readonly scanning = signal(false);
  readonly progress = signal(0);
  readonly saving = signal(false);
  readonly error = signal('');

  totalEur: number | null = null;
  purchasedOn = this.today;
  store = '';

  constructor(
    private readonly api: HouseholdApiService,
    private readonly ocr: RecipeOcrService,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    const now = new Date();
    const from = isoDate(new Date(now.getFullYear(), now.getMonth(), 1));
    const to = isoDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
    this.api.getReceipts(from, to).subscribe({
      next: (receipts) => this.receipts.set(receipts),
      error: () => this.error.set('Die Belege konnten nicht geladen werden.'),
    });
  }

  async scan(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || !file.type.startsWith('image/')) {
      return;
    }
    this.scanning.set(true);
    this.progress.set(0);
    this.error.set('');
    try {
      const text = await this.ocr.recognizeText(file, 'standard', (update) =>
        this.progress.set(Math.round(update.progress * 100)),
      );
      const parsed = parseReceiptText(text);
      this.totalEur = parsed.totalEur;
      this.purchasedOn = parsed.purchasedOn ?? this.today;
      this.store = parsed.store ?? '';
      if (parsed.totalEur === null) {
        this.error.set('Kein Betrag erkannt – bitte trage ihn selbst ein.');
      }
    } catch {
      this.error.set('Die Texterkennung konnte nicht gestartet werden.');
    } finally {
      this.scanning.set(false);
    }
  }

  save(): void {
    if (!this.totalEur || this.totalEur <= 0 || !this.purchasedOn || this.saving()) {
      return;
    }
    this.saving.set(true);
    this.error.set('');
    this.api
      .createReceipt({ purchasedOn: this.purchasedOn, totalEur: this.totalEur, store: this.store.trim() || null })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.totalEur = null;
          this.store = '';
          this.purchasedOn = this.today;
          this.load();
        },
        error: () => {
          this.saving.set(false);
          this.error.set('Die Ausgabe konnte nicht gespeichert werden.');
        },
      });
  }

  remove(receipt: Receipt): void {
    if (receipt.id === undefined) {
      return;
    }
    const id = receipt.id;
    this.api.deleteReceipt(id).subscribe({
      next: () => this.receipts.update((list) => list.filter((entry) => entry.id !== id)),
      error: () => this.error.set('Der Beleg konnte nicht gelöscht werden.'),
    });
  }
}
