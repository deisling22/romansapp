import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreatorApiService } from '../../core/creator-api.service';
import { MealPlanApiService } from '../../core/meal-plan-api.service';
import { CreatorDetail } from '../../core/models';
import { ShareService } from '../../core/share.service';
import { AuthService } from '../../core/auth.service';
import { NotificationService } from '../../core/notification.service';

@Component({
  selector: 'app-creator-profile',
  templateUrl: './creator-profile.component.html',
  styleUrls: ['./creators.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CreatorProfileComponent implements OnInit {
  creator: CreatorDetail | null = null;
  loading = true;
  errorMessage = '';
  shareMessage = '';
  subscribed = false;
  subscriptionLoading = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly creatorApi: CreatorApiService,
    readonly auth: AuthService,
    private readonly notifications: NotificationService,
    private readonly shareService: ShareService,
    readonly mealPlanApi: MealPlanApiService,
  ) {}

  ngOnInit(): void {
    const creatorId = Number(this.route.snapshot.paramMap.get('creatorId'));
    this.creatorApi.getCreator(creatorId).subscribe({
      next: (creator) => {
        this.creator = creator;
        this.loading = false;
        if (this.auth.getToken()) {
          this.loadSubscription(creator.id);
        }
      },
      error: () => {
        this.errorMessage = 'Das Creator-Profil konnte nicht geladen werden.';
        this.loading = false;
      },
    });
  }

  toggleSubscription(): void {
    if (!this.creator || this.subscriptionLoading) {
      return;
    }
    this.subscriptionLoading = true;
    const request = this.subscribed
      ? this.creatorApi.unsubscribe(this.creator.id)
      : this.creatorApi.subscribe(this.creator.id);
    request.subscribe({
      next: () => {
        this.subscribed = !this.subscribed;
        this.subscriptionLoading = false;
        this.notifications.show(
          this.subscribed
            ? `${this.creator!.name} wurde abonniert.`
            : `Abo von ${this.creator!.name} wurde beendet.`,
          'success',
        );
      },
      error: () => {
        this.errorMessage = 'Das Abonnement konnte nicht geändert werden.';
        this.subscriptionLoading = false;
      },
    });
  }

  private loadSubscription(creatorId: number): void {
    this.creatorApi.getSubscription(creatorId).subscribe({
      next: ({ subscribed }) => (this.subscribed = subscribed),
      error: () => (this.subscribed = false),
    });
  }

  async shareCreator(): Promise<void> {
    if (!this.creator) {
      return;
    }
    this.shareMessage = '';
    try {
      const result = await this.shareService.share(
        this.creator.name,
        `Entdecke die Speisepläne von ${this.creator.name}.`,
      );
      if (result === 'copied') {
        this.shareMessage = 'Link zum Creator-Profil kopiert.';
      }
    } catch {
      this.errorMessage = 'Der Link konnte nicht geteilt werden.';
    }
  }
}