import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CreatorApiService } from '../../core/creator-api.service';
import { MealPlanApiService } from '../../core/meal-plan-api.service';
import { CreatorDetail } from '../../core/models';
import { ShareService } from '../../core/share.service';

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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly creatorApi: CreatorApiService,
    private readonly shareService: ShareService,
    readonly mealPlanApi: MealPlanApiService,
  ) {}

  ngOnInit(): void {
    const creatorId = Number(this.route.snapshot.paramMap.get('creatorId'));
    this.creatorApi.getCreator(creatorId).subscribe({
      next: (creator) => {
        this.creator = creator;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Das Creator-Profil konnte nicht geladen werden.';
        this.loading = false;
      },
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