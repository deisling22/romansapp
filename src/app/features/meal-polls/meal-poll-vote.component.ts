import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { firstValueFrom } from 'rxjs';
import { MealPollApiService, PollOption, PublicMealPoll } from '../../core/meal-poll-api.service';
import { MEAL_SLOT_LABELS } from '../../core/models';
import { toAbsoluteImageUrl } from '../../core/image-url';
import { pollError } from './poll-errors';

@Component({
  selector: 'app-meal-poll-vote',
  imports: [DatePipe, FormsModule, RouterLink, DragDropModule],
  templateUrl: './meal-poll-vote.component.html',
  styleUrl: './meal-polls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealPollVoteComponent implements OnInit {
  readonly poll = signal<PublicMealPoll | null>(null);
  readonly options = signal<PollOption[]>([]);
  readonly loading = signal(true);
  readonly busy = signal(false);
  readonly submitted = signal(false);
  readonly error = signal('');
  readonly slotLabels = MEAL_SLOT_LABELS;
  readonly imageUrl = toAbsoluteImageUrl;
  name = '';
  private id = '';

  constructor(private readonly api: MealPollApiService, private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      const poll = await firstValueFrom(this.api.getPublic(this.id));
      this.poll.set(poll);
      this.options.set([...poll.options]);
    } catch (error: unknown) {
      this.poll.set(null);
      this.error.set(pollError(error, 'Die Abfrage konnte nicht geladen werden. Bitte versuche es erneut.'));
    } finally {
      this.loading.set(false);
    }
  }

  drop(event: CdkDragDrop<PollOption[]>): void {
    this.move(event.previousIndex, event.currentIndex);
  }

  move(from: number, to: number): void {
    if (this.busy() || this.poll()?.closed || this.submitted() || from < 0 || from >= this.options().length || to < 0 || to >= this.options().length) {
      return;
    }
    const options = [...this.options()];
    moveItemInArray(options, from, to);
    this.options.set(options);
  }

  async submit(): Promise<void> {
    if (this.busy() || !this.poll() || this.poll()?.closed || this.submitted()) {
      return;
    }
    const name = this.name.trim();
    if (!name || name.length > 80) {
      this.error.set('Bitte gib deinen Namen an (höchstens 80 Zeichen).');
      return;
    }
    this.busy.set(true);
    this.error.set('');
    try {
      await firstValueFrom(this.api.vote(this.id, name, this.options().map((option) => option.entryId)));
      this.submitted.set(true);
    } catch (error: unknown) {
      this.error.set(pollError(error, 'Deine Stimme wurde nicht bestätigt. Du kannst sie mit demselben Namen erneut absenden; sie zählt nur einmal.'));
    } finally {
      this.busy.set(false);
    }
  }
}
