import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PantryApiService } from '../../core/pantry-api.service';
import { PurchaseInboxService } from '../../core/purchase-inbox.service';
import { ITEM_UNITS } from '../../core/quick-add';
import { PurchaseDocumentService } from './purchase-document.service';
import { parsePurchaseText, PurchaseItem } from './purchase-parser';

@Component({
  selector: 'app-purchase-import',
  imports: [FormsModule, RouterLink],
  templateUrl: './purchase-import.component.html',
  styleUrl: './purchase-import.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PurchaseImportComponent implements OnInit {
  readonly units = [...ITEM_UNITS, 'Dose', 'Glas', 'Bund', 'Becher', 'Flasche'];
  readonly busy = signal(false);
  readonly saving = signal(false);
  readonly status = signal('');
  readonly error = signal('');
  readonly success = signal('');
  text = '';
  items: PurchaseItem[] = [];

  constructor(
    private readonly documents: PurchaseDocumentService,
    private readonly pantry: PantryApiService,
    private readonly inbox: PurchaseInboxService,
  ) {}

  ngOnInit(): void {
    const shared = this.inbox.take();
    if (shared) {
      this.text = shared;
      this.parse('list');
    }
  }

  parse(source: 'receipt' | 'list' = 'list'): void {
    if (this.busy() || this.saving()) {
      return;
    }
    this.success.set('');
    this.error.set('');
    if (this.text.length > 100_000) {
      this.error.set('Der Text ist zu lang. Bitte importiere den Einkauf in kleineren Teilen.');
      return;
    }
    this.items = parsePurchaseText(this.text, source);
    if (!this.items.length) {
      this.error.set('Keine Artikel erkannt. Ergänze oder korrigiere den Text, oder füge Artikel manuell hinzu.');
    }
  }

  async selectFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (file) {
      await this.readFile(file);
    }
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  async drop(event: DragEvent): Promise<void> {
    event.preventDefault();
    if (this.busy() || this.saving() || !event.dataTransfer) {
      return;
    }
    if (event.dataTransfer.files.length > 1) {
      this.error.set('Bitte importiere jeweils nur eine Datei.');
      return;
    }
    const file = event.dataTransfer.files[0];
    if (file) {
      await this.readFile(file);
    } else {
      this.text = event.dataTransfer.getData('text/plain');
      this.parse();
    }
  }

  private async readFile(file: File): Promise<void> {
    if (this.busy() || this.saving()) {
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.success.set('');
    this.status.set('Datei wird gelesen …');
    try {
      const text = await this.documents.read(file, (message) => this.status.set(message));
      this.text = text;
      this.busy.set(false);
      this.parse(file.type === 'text/plain' || /\.txt$/i.test(file.name) ? 'list' : 'receipt');
    } catch (error: unknown) {
      console.error('Purchase document import failed', error);
      this.error.set(error instanceof Error
        ? `Datei konnte nicht gelesen werden: ${error.message}`
        : 'Datei konnte nicht gelesen werden. Bitte versuche eine andere Datei.');
    } finally {
      this.busy.set(false);
      this.status.set('');
    }
  }

  addItem(): void {
    this.items = [...this.items, { ingredientName: '', quantity: 1, unit: 'Stk.', selected: true }];
    this.success.set('');
  }

  async save(): Promise<void> {
    if (this.busy() || this.saving()) {
      return;
    }
    const selected = this.items.filter((item) => item.selected);
    if (!selected.length || selected.some((item) =>
      !item.ingredientName.trim() || item.ingredientName.trim().length > 120 ||
      !Number.isFinite(item.quantity) || item.quantity <= 0 || !this.units.includes(item.unit))) {
      this.error.set('Bitte wähle mindestens einen Artikel und prüfe Namen, positive Mengen und Einheiten.');
      return;
    }
    this.saving.set(true);
    this.error.set('');
    try {
      await firstValueFrom(this.pantry.addBatch(selected.map((item) => ({
        ingredientName: item.ingredientName.trim(), quantity: item.quantity, unit: item.unit,
      }))));
      this.items = [];
      this.text = '';
      this.success.set(`${selected.length} Artikel wurden in den Vorratsschrank übernommen.`);
    } catch (error: unknown) {
      console.error('Purchase pantry import failed', error);
      this.error.set('Der Import wurde nicht bestätigt. Bitte prüfe vor einem erneuten Versuch den Vorrat, um doppelte Einträge zu vermeiden.');
    } finally {
      this.saving.set(false);
    }
  }
}
