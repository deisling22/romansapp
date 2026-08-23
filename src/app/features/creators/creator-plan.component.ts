import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CreatorApiService } from '../../core/creator-api.service';
import { MealPlanApiService } from '../../core/meal-plan-api.service';
import { CreatorDetail, CreatorPlan, Dish } from '../../core/models';
import { ShareService } from '../../core/share.service';

@Component({
  selector: 'app-creator-plan',
  templateUrl: './creator-plan.component.html',
  styleUrls: ['./creators.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CreatorPlanComponent implements OnInit {
  creator: CreatorDetail | null = null;
  plan: CreatorPlan | null = null;
  dishes: Dish[] = [];
  loading = true;
  copying = false;
  copied = false;
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
    const planId = Number(this.route.snapshot.paramMap.get('planId'));
    forkJoin({
      creator: this.creatorApi.getCreator(creatorId),
      dishes: this.creatorApi.getPlanDishes(creatorId, planId),
    }).subscribe({
      next: ({ creator, dishes }) => {
        this.creator = creator;
        this.plan = creator.plans.find((plan) => plan.id === planId) ?? null;
        this.dishes = dishes;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Der Creator-Plan konnte nicht geladen werden.';
        this.loading = false;
      },
    });
  }

  copyPlan(): void {
    if (!this.creator || !this.plan || this.copying || this.copied) {
      return;
    }
    this.copying = true;
    this.errorMessage = '';
    this.creatorApi.copyPlan(this.creator.id, this.plan.id).subscribe({
      next: () => {
        this.copying = false;
        this.copied = true;
      },
      error: () => {
        this.errorMessage = 'Der Plan konnte nicht kopiert werden.';
        this.copying = false;
      },
    });
  }

  async sharePlan(): Promise<void> {
    if (!this.creator || !this.plan) {
      return;
    }
    this.shareMessage = '';
    try {
      const result = await this.shareService.share(
        this.plan.name,
        `Entdecke den Speiseplan ${this.plan.name} von ${this.creator.name}.`,
      );
      if (result === 'copied') {
        this.shareMessage = 'Link zum Plan kopiert.';
      }
    } catch {
      this.errorMessage = 'Der Link konnte nicht geteilt werden.';
    }
  }
}