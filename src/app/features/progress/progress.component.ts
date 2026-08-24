import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GamificationProgress, GamificationService } from '../../core/gamification.service';

@Component({
  selector: 'app-progress',
  standalone: false,
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ProgressComponent implements OnInit {
  progress: GamificationProgress | null = null;
  loading = true;
  errorMessage = '';

  constructor(private readonly gamification: GamificationService) {}

  ngOnInit(): void {
    this.gamification.getProgress().subscribe({
      next: (progress) => {
        this.progress = progress;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Dein Fortschritt konnte nicht geladen werden.';
        this.loading = false;
      },
    });
  }

  percent(value: number, target: number): number {
    return target <= 0 ? 0 : Math.min(100, Math.round(value / target * 100));
  }
}