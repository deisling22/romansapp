import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { DishApiService } from '../../core/dish-api.service';
import { GamificationService } from '../../core/gamification.service';
import { DishDetail } from '../../core/models';
import { PantryApiService } from '../../core/pantry-api.service';
import { ShareService } from '../../core/share.service';
import { ShoppingListApiService } from '../../core/shopping-list-api.service';
import { DishDetailComponent } from './dish-detail.component';

describe('DishDetailComponent nutrition display', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DishDetailComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: {} },
        { provide: DishApiService, useValue: { imageUrl: (url: string) => url } },
        { provide: PantryApiService, useValue: {} },
        { provide: ShoppingListApiService, useValue: {} },
        { provide: ShareService, useValue: {} },
        { provide: GamificationService, useValue: {} },
      ],
    });
    spyOn(DishDetailComponent.prototype, 'ngOnInit');
  });

  for (const [calories, protein, expectedCalories, expectedProtein] of [
    [460.62749999999994, 9.86225, 461, 10],
    [460.01, 9.01, 461, 10],
    [460, 9, 460, 9],
    [0, 0, 0, 0],
  ]) {
    it(`displays ${calories} kcal and ${protein} g protein as rounded-up integers`, () => {
      const fixture = TestBed.createComponent(DishDetailComponent);
      const dish: DishDetail = {
        id: 101, name: 'Salat', imageUrl: '', description: null, prepMinutes: null,
        servings: 4, tags: [], caloriesPerServing: calories, proteinPerServing: protein,
        carbsGrams: null, fatGrams: null, vitaminAMcg: null, vitaminCMg: null,
        vitaminDMcg: null, vitaminKMcg: null, vitaminB12Mcg: null, folateMcg: null,
        galleryImageUrls: [], steps: [], ingredients: [], averageRating: null,
        ratingCount: 0, myRating: null, favorite: false, advancePrepNote: null,
      };
      fixture.componentInstance.dish = dish;
      fixture.componentInstance.loading = false;
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;
      const labels = Array.from(element.querySelectorAll('.meta-row span'), (span) => span.textContent?.trim());
      expect(labels).toContain(`${expectedCalories} kcal / Portion`);
      expect(labels).toContain(`${expectedProtein} g Protein / Portion`);
      expect(dish.caloriesPerServing).toBe(calories);
      expect(dish.proteinPerServing).toBe(protein);
    });
  }
});
