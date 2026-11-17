import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Capacitor } from '@capacitor/core';
import { environment } from '../../../environments/environment';
import { ManagedMealPoll, MealPollApiService } from '../../core/meal-poll-api.service';
import { MEAL_SLOT_LABELS } from '../../core/models';
import { ShareService } from '../../core/share.service';
import { toAbsoluteImageUrl } from '../../core/image-url';
import { pollError } from './poll-errors';

@Component({
  selector: 'app-meal-polls',
  imports: [DatePipe, DecimalPipe, FormsModule, RouterLink],
  templateUrl: './meal-polls.component.html',
  styleUrl: './meal-polls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealPollsComponent implements OnInit {
  readonly polls = signal<ManagedMealPoll[]>([]);
  readonly selected = signal<ManagedMealPoll | null>(null);
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly message = signal('');
  readonly slotLabels = MEAL_SLOT_LABELS;
  count = 3;
  readonly imageUrl = toAbsoluteImageUrl;

  constructor(private readonly api: MealPollApiService, private readonly shareService: ShareService) {}

  ngOnInit(): void {
    void this.load();
  }

  async load(): Promise<void> {
    if (this.busy()) {
      return;
    }
    this.loading.set(true);
    this.error.set('');
    try {
      const polls = await firstValueFrom(this.api.list());
      const id = this.selected()?.poll.id;
      this.polls.set(polls);
      this.select(polls.find((poll) => poll.poll.id === id) ?? polls[0] ?? null);
    } catch (error: unknown) {
      this.error.set(pollError(error, 'Deine Abfragen konnten nicht geladen werden.'));
    } finally {
      this.loading.set(false);
    }
  }

  select(poll: ManagedMealPoll | null): void {
    this.selected.set(poll);
    this.count = Math.min(3, poll?.poll.options.length ?? 3);
    this.message.set('');
  }

  async create(): Promise<void> {
    if (this.busy() || this.loading()) {
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.message.set('');
    try {
      const created = await firstValueFrom(this.api.create());
      this.polls.update((polls) => [created, ...polls]);
      this.select(created);
      this.message.set('Abfrage erstellt. Teile jetzt den Abstimmungslink mit deiner Familie.');
    } catch (error: unknown) {
      this.error.set(pollError(error, 'Die Abfrage konnte nicht erstellt werden. Bitte aktualisiere die Liste vor einem erneuten Versuch.'));
    } finally {
      this.busy.set(false);
    }
  }

  voteUrl(id: string): string {
    const url = new URL(Capacitor.isNativePlatform() ? environment.publicAppUrl : document.baseURI);
    url.search = '';
    url.hash = `/vote/${encodeURIComponent(id)}`;
    return url.href;
  }

  whatsappUrl(id: string): string {
    return `https://wa.me/?text=${encodeURIComponent(`Was wollen wir essen? Ordne die Gerichte nach deinem Geschmack und stimme mit deinem Namen ab: ${this.voteUrl(id)}`)}`;
  }

  async share(id: string, copyOnly = false): Promise<void> {
    this.error.set('');
    this.message.set('');
    try {
      if (copyOnly) {
        await navigator.clipboard.writeText(this.voteUrl(id));
        this.message.set('Abstimmungslink kopiert.');
      } else {
        const result = await this.shareService.share('Familienabfrage', 'Was wollen wir essen? Stimme mit deiner Rangliste ab.', this.voteUrl(id));
        if (result !== 'cancelled') {
          this.message.set(result === 'copied' ? 'Abstimmungslink kopiert.' : 'Abstimmungslink geteilt.');
        }
      }
    } catch (error: unknown) {
      console.error('Poll link sharing failed', error);
      this.error.set('Der Link konnte nicht geteilt werden. Du kannst ihn aus dem Linkfeld kopieren.');
    }
  }

  async change(action: 'close' | 'apply' | 'delete'): Promise<void> {
    const current = this.selected();
    if (!current || this.busy() || this.loading()) {
      return;
    }
    if (action === 'apply' && (!Number.isInteger(this.count) || this.count < 1 || this.count > current.poll.options.length)) {
      this.error.set('Bitte wähle eine gültige Anzahl an Top-Gerichten.');
      return;
    }
    if (action === 'delete' && !confirm('Diese Abfrage mit allen Stimmen endgültig löschen?')) {
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.message.set('');
    try {
      const id = current.poll.id;
      if (action === 'delete') {
        await firstValueFrom(this.api.delete(id));
        this.polls.update((polls) => polls.filter((poll) => poll.poll.id !== id));
        this.select(this.polls()[0] ?? null);
        this.message.set('Abfrage gelöscht.');
      } else {
        const updated = await firstValueFrom(action === 'apply' ? this.api.apply(id, this.count) : this.api.close(id));
        this.polls.update((polls) => polls.map((poll) => poll.poll.id === id ? updated : poll));
        this.selected.set(updated);
        this.message.set(action === 'apply'
          ? `Top ${this.count} sind jetzt innerhalb ihrer Mahlzeit als Nächstes geplant. Die übrigen Gerichte rücken nach hinten.`
          : 'Abfrage beendet. Es sind keine weiteren Stimmen möglich.');
      }
    } catch (error: unknown) {
      this.error.set(pollError(error, 'Die Änderung wurde nicht bestätigt. Bitte aktualisiere die Ergebnisse, bevor du es erneut versuchst.'));
    } finally {
      this.busy.set(false);
    }
  }

  optionName(poll: ManagedMealPoll, id: number): string {
    return poll.poll.options.find((option) => option.entryId === id)?.name ?? String(id);
  }
}
