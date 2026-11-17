import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { CreatorApiService } from '../../core/creator-api.service';
import { MealPlanApiService } from '../../core/meal-plan-api.service';
import { Profile } from '../../core/models';
import { OnboardingService } from '../../core/onboarding.service';
import { ProfileApiService } from '../../core/profile-api.service';
import { RecommendationApiService } from '../../core/recommendation-api.service';
import { ScheduleApiService } from '../../core/schedule-api.service';

interface StarterPlan {
  key: string;
  name: string;
  detail: string;
  planId: number;
  /** Set for public plans, which are copied into the household first. */
  creatorId?: number;
}

const SHOPPING_OPTIONS = [
  { value: 1, label: '1×' },
  { value: 2, label: '2×' },
  { value: 3, label: '3×' },
  { value: 4, label: '4×' },
  { value: 7, label: 'täglich' },
];

/**
 * First start: three short questions instead of a feature tour. Their answers fill "Heute" right away:
 * portions (household), shopping window (trips per week), suggestions (taste) and the first active plan.
 */
@Component({
    selector: 'app-onboarding-tour',
    templateUrl: './onboarding-tour.component.html',
    styleUrls: ['./onboarding-tour.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
})
export class OnboardingTourComponent implements OnInit {
  readonly stepCount = 3;
  readonly shoppingOptions = SHOPPING_OPTIONS;

  stepIndex = 0;
  householdSize = 2;
  shoppingTripsPerWeek = 2;
  availableTags: string[] = [];
  likedTags = new Set<string>();
  tagsLoading = true;
  starterPlans: StarterPlan[] = [];
  plansLoading = true;
  selectedPlanKey: string | null = null;
  saving = false;
  errorMessage = '';

  private profile: Profile | null = null;

  constructor(
    readonly onboarding: OnboardingService,
    private readonly profileApi: ProfileApiService,
    private readonly recommendationApi: RecommendationApiService,
    private readonly mealPlanApi: MealPlanApiService,
    private readonly creatorApi: CreatorApiService,
    private readonly scheduleApi: ScheduleApiService,
  ) {}

  ngOnInit(): void {
    this.profileApi.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.householdSize = Math.max(1, profile.householdSize);
        this.shoppingTripsPerWeek = profile.shoppingTripsPerWeek;
      },
      error: () => undefined,
    });
    this.recommendationApi.getTaste().subscribe({
      next: (taste) => {
        this.availableTags = taste.availableTags;
        this.likedTags = new Set(taste.likedTags);
        this.tagsLoading = false;
      },
      error: () => (this.tagsLoading = false),
    });
    forkJoin({
      own: this.mealPlanApi.getPlans().pipe(catchError(() => of([]))),
      recommended: this.recommendationApi.getRecommendations().pipe(
        map((recommendations) => recommendations.plans),
        catchError(() => of([])),
      ),
    }).subscribe(({ own, recommended }) => {
      this.starterPlans = [
        ...own.filter((plan) => plan.dishCount > 0).map((plan) => ({
          key: `own-${plan.id}`,
          name: plan.name,
          detail: `${plan.dishCount} Gerichte · dein Plan`,
          planId: plan.id,
        })),
        ...recommended.map((plan) => ({
          key: `creator-${plan.id}`,
          name: plan.name,
          detail: `${plan.dishCount} Gerichte · von @${plan.creatorHandle}`,
          planId: plan.id,
          creatorId: plan.creatorId,
        })),
      ];
      this.selectedPlanKey = `own-${own.find((plan) => plan.active)?.id}`;
      if (!this.starterPlans.some((plan) => plan.key === this.selectedPlanKey)) {
        this.selectedPlanKey = this.starterPlans[0]?.key ?? null;
      }
      this.plansLoading = false;
    });
  }

  get isLastStep(): boolean {
    return this.stepIndex === this.stepCount - 1;
  }

  changeHousehold(delta: number): void {
    this.householdSize = Math.max(1, Math.min(12, this.householdSize + delta));
  }

  toggleTag(tag: string): void {
    if (!this.likedTags.delete(tag)) {
      this.likedTags.add(tag);
    }
  }

  back(): void {
    this.stepIndex = Math.max(0, this.stepIndex - 1);
  }

  next(): void {
    if (!this.isLastStep) {
      this.stepIndex++;
      return;
    }
    this.finish();
  }

  skip(): void {
    this.onboarding.complete();
  }

  private finish(): void {
    if (this.saving) {
      return;
    }
    this.saving = true;
    this.errorMessage = '';
    const steps: Observable<unknown>[] = [this.recommendationApi.setLikedTags([...this.likedTags])];
    if (this.profile) {
      steps.push(this.profileApi.updateProfile({
        ...this.profile,
        householdSize: this.householdSize,
        shoppingTripsPerWeek: this.shoppingTripsPerWeek,
      }));
    }
    const starter = this.starterPlans.find((plan) => plan.key === this.selectedPlanKey);
    if (starter) {
      const planId$ = starter.creatorId
        ? this.creatorApi.copyPlan(starter.creatorId, starter.planId).pipe(map((plan) => plan.id))
        : of(starter.planId);
      steps.push(planId$.pipe(switchMap((planId) => this.scheduleApi.updatePlanSettings(planId, { active: true }))));
    }
    forkJoin(steps).subscribe({
      next: () => {
        this.saving = false;
        this.onboarding.complete();
      },
      error: () => {
        this.saving = false;
        this.errorMessage = 'Das konnte nicht gespeichert werden. Versuche es erneut oder überspringe die Einrichtung.';
      },
    });
  }
}
