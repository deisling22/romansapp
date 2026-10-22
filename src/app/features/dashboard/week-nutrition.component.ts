import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { WeekNutrition } from '../../core/models';

const WEEKDAY = new Intl.DateTimeFormat('de-DE', { weekday: 'short' });

@Component({
  selector: 'app-week-nutrition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe],
  template: `
    @let w = week();
    <section class="week" aria-labelledby="week-title" data-testid="week-nutrition">
      <h2 id="week-title">Diese Woche</h2>
      <div class="bars" role="img" [attr.aria-label]="chartLabel()">
        @if (goalLine() !== null) {
          <span class="goal" [style.bottom.%]="goalLine()"></span>
        }
        @for (bar of bars(); track bar.date) {
          <span class="bar" [class.today]="bar.today">
            <span class="fill" [style.height.%]="bar.height"></span>
            <small>{{ bar.label }}</small>
          </span>
        }
      </div>
      @if (w.trackedDays > 0) {
        <dl class="averages">
          <div>
            <dt>Ø Kalorien</dt>
            <dd>{{ w.averageCalories | number:'1.0-0' }} kcal
              @if (w.calorieGoal) { <small>{{ percent(w.averageCalories, w.calorieGoal) }} %</small> }
            </dd>
          </div>
          <div>
            <dt>Ø Protein</dt>
            <dd>{{ w.averageProtein | number:'1.0-0' }} g
              @if (w.proteinGoal) { <small>{{ percent(w.averageProtein, w.proteinGoal) }} %</small> }
            </dd>
          </div>
          <div><dt>Ø Kohlenhydrate</dt><dd>{{ w.averageCarbs | number:'1.0-0' }} g</dd></div>
          <div><dt>Ø Fett</dt><dd>{{ w.averageFat | number:'1.0-0' }} g</dd></div>
        </dl>
        <p class="hint">Durchschnitt über {{ w.trackedDays }} von 7 Tagen mit gekochten Gerichten.</p>
      } @else {
        <p class="hint">In den letzten 7 Tagen wurde noch nichts als gekocht markiert.</p>
      }
    </section>
  `,
  styles: `
    @use '../../../styles/ios';
    .week { @include ios.card; padding: 14px 16px; }
    h2 { margin: 0 0 12px; font: var(--text-headline); }
    .bars { position: relative; display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; height: 96px; padding-bottom: 18px; }
    .goal { position: absolute; left: 0; right: 0; border-top: 1px dashed var(--label-2); margin-bottom: 18px; }
    .bar { position: relative; display: flex; align-items: flex-end; justify-content: center; }
    .fill { width: 100%; max-width: 28px; min-height: 2px; border-radius: 4px 4px 0 0; background: var(--tint); opacity: .55; }
    .bar.today .fill { opacity: 1; }
    small { color: var(--label-2); font: var(--text-caption); }
    .bar small { position: absolute; bottom: -18px; }
    .averages { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 12px; margin: 12px 0 0; }
    .averages dt { color: var(--label-2); font: var(--text-footnote); }
    .averages dd { margin: 0; font: var(--text-subhead-strong); }
    .hint { margin: 8px 0 0; color: var(--label-2); font: var(--text-caption); }
  `,
})
export class WeekNutritionComponent {
  readonly week = input.required<WeekNutrition>();

  private readonly scale = computed(() => {
    const week = this.week();
    return Math.max(week.calorieGoal ?? 0, ...week.days.map((day) => day.calories), 1);
  });

  readonly goalLine = computed(() => {
    const goal = this.week().calorieGoal;
    return goal ? (goal / this.scale()) * 100 : null;
  });

  readonly bars = computed(() => {
    const days = this.week().days;
    return days.map((day, index) => {
      const [year, month, date] = day.date.split('-').map(Number);
      return {
        date: day.date,
        label: WEEKDAY.format(new Date(year, month - 1, date)).replace('.', ''),
        height: (day.calories / this.scale()) * 100,
        today: index === days.length - 1,
      };
    });
  });

  readonly chartLabel = computed(() =>
    'Kalorien der letzten 7 Tage: ' +
    this.week().days.map((day) => `${Math.round(day.calories)} kcal`).join(', '),
  );

  percent(value: number, goal: number): number {
    return Math.round((value / goal) * 100);
  }
}
