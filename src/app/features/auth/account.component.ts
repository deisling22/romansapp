import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService, AuthenticatedUser } from '../../core/auth.service';
import { GamificationProgress, GamificationService } from '../../core/gamification.service';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AccountComponent implements OnInit {
  user: AuthenticatedUser | null = null;
  progress: GamificationProgress | null = null;
  savingFrame = false;

  get selectedTitleName(): string {
    return this.progress?.titles.find((title) => title.id === this.progress?.selectedTitle)?.name ?? '';
  }

  constructor(
    private readonly authService: AuthService,
    private readonly gamification: GamificationService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Angular defaults components to OnPush-style change detection now, so a plain
    // property assignment inside an async subscribe callback needs an explicit
    // markForCheck() to make the view actually reflect the new value.
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.cdr.markForCheck();
      },
      error: () => {
        this.user = null;
        this.cdr.markForCheck();
      },
    });
    this.gamification.getProgress().subscribe({
      next: (progress) => {
        this.progress = progress;
        this.cdr.markForCheck();
      },
    });
  }

  selectFrame(frameId: string): void {
    if (!this.progress || this.savingFrame) return;
    this.savingFrame = true;
    const current = this.progress;
    const weeklyTarget = current.weeklyGoals.find((goal) => goal.id === 'WEEKLY_COOK')?.target ?? 4;
    this.saveCosmetics(frameId, current.selectedTitle, weeklyTarget);
  }

  selectTitle(titleId: string): void {
    if (!this.progress || this.savingFrame) return;
    const weeklyTarget = this.progress.weeklyGoals.find((goal) => goal.id === 'WEEKLY_COOK')?.target ?? 4;
    this.saveCosmetics(this.progress.selectedFrame, titleId, weeklyTarget);
  }

  private saveCosmetics(frameId: string, titleId: string, weeklyTarget: number): void {
    if (!this.progress) return;
    this.savingFrame = true;
    this.gamification.updateSettings(frameId, titleId, weeklyTarget, this.progress.householdGoal.target).subscribe({
      next: (progress) => {
        this.progress = progress;
        this.savingFrame = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.savingFrame = false;
        this.cdr.markForCheck();
      },
    });
  }
}