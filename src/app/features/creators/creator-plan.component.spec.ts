import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';
import { CreatorApiService } from '../../core/creator-api.service';
import { MealPlanApiService } from '../../core/meal-plan-api.service';
import { ShareService } from '../../core/share.service';
import { MealPlan } from '../../core/models';
import { CreatorPlanComponent } from './creator-plan.component';

describe('CreatorPlanComponent copy actions', () => {
  it('offers copying before and after the dishes and keeps both buttons in sync', () => {
    const response = new Subject<MealPlan>();
    const api = jasmine.createSpyObj<CreatorApiService>('CreatorApiService', ['copyPlan', 'getCreator', 'getPlanDishes']);
    api.copyPlan.and.returnValue(response);
    api.getCreator.and.returnValue(of({
      id: 9, name: 'Giga Roman', handle: 'gigaroman', bio: '', avatarUrl: '',
      plans: [{ id: 1, name: 'Romans Plan', dishCount: 48, coverImageUrl: '' }],
    }));
    api.getPlanDishes.and.returnValue(of([]));
    TestBed.configureTestingModule({
      imports: [CreatorPlanComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ creatorId: '9', planId: '1' }) } } },
        { provide: CreatorApiService, useValue: api },
        { provide: MealPlanApiService, useValue: {} },
        { provide: ShareService, useValue: {} },
      ],
    });
    const fixture = TestBed.createComponent(CreatorPlanComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    const buttons = Array.from(element.querySelectorAll<HTMLButtonElement>('.copy-plan-button'));
    const grid = element.querySelector('.creator-dish-grid')!;
    expect(buttons.length).toBe(2);
    expect(buttons[0].compareDocumentPosition(grid) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(grid.compareDocumentPosition(buttons[1]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    buttons[0].click();
    fixture.detectChanges();
    expect(api.copyPlan).toHaveBeenCalledOnceWith(9, 1);
    for (const button of buttons) {
      expect(button.disabled).toBeTrue();
      expect(button.textContent).toContain('Wird kopiert');
    }

    response.next({ id: 2, name: 'Romans Plan', dishCount: 48 });
    response.complete();
    fixture.detectChanges();
    for (const button of buttons) {
      expect(button.disabled).toBeTrue();
      expect(button.textContent).toContain('Plan kopiert');
    }
    expect(element.querySelector('.copy-success')?.textContent).toContain('Der Plan ist jetzt bei deinen Plänen.');
  });
});
