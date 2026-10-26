import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, Subject } from 'rxjs';
import { GamificationService } from '../../core/gamification.service';
import { MealPlanApiService } from '../../core/meal-plan-api.service';
import { MealPlan } from '../../core/models';
import { RecipeSyncService } from '../../core/recipe-sync.service';
import { ScheduleApiService } from '../../core/schedule-api.service';
import { PlanListComponent } from './plan-list.component';

describe('PlanListComponent activation', () => {
  const first: MealPlan = { id: 1, name: 'Diese Woche', dishCount: 3, active: false };
  const second: MealPlan = { id: 2, name: 'Schnelle Küche', dishCount: 2, active: false };
  let schedule: jasmine.SpyObj<ScheduleApiService>;
  let response: Subject<MealPlan>;

  beforeEach(() => {
    response = new Subject<MealPlan>();
    schedule = jasmine.createSpyObj<ScheduleApiService>('ScheduleApiService', ['updatePlanSettings']);
    schedule.updatePlanSettings.and.returnValue(response);
    TestBed.configureTestingModule({
      imports: [PlanListComponent],
      providers: [
        provideRouter([]),
        { provide: MealPlanApiService, useValue: { getPlans: () => of([first, second]) } },
        { provide: RecipeSyncService, useValue: { listPlans: () => Promise.resolve([]) } },
        { provide: GamificationService, useValue: {} },
        { provide: ScheduleApiService, useValue: schedule },
      ],
    });
  });

  it('responds immediately, suppresses repeat clicks and keeps other plans usable', () => {
    const fixture = TestBed.createComponent(PlanListComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const buttons = element.querySelectorAll<HTMLButtonElement>('.active-toggle');
    const row = element.querySelector('.plan-row');
    for (let i = 0; i < 10; i++) {
      buttons[0].click();
    }
    fixture.detectChanges();

    expect(schedule.updatePlanSettings).toHaveBeenCalledOnceWith(1, { active: true });
    expect(buttons[0].disabled).toBeTrue();
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1].disabled).toBeFalse();
    expect(element.querySelector('[role="status"]')?.textContent).toContain('Wird gespeichert');
    expect(element.querySelector('.plan-row')).toBe(row);

    response.next({ ...first, active: true });
    fixture.detectChanges();
    expect(buttons[0].disabled).toBeFalse();
    expect(element.querySelector('[role="status"]')).toBeNull();
    expect(element.querySelector('.plan-row')).toBe(row);
  });

  it('allows independent plans to save concurrently', () => {
    const fixture = TestBed.createComponent(PlanListComponent);
    fixture.detectChanges();
    fixture.componentInstance.toggleActive(first, new Event('click'));
    fixture.componentInstance.toggleActive(second, new Event('click'));
    expect(schedule.updatePlanSettings.calls.allArgs()).toEqual([
      [1, { active: true }], [2, { active: true }],
    ]);
  });

  it('rolls back a failed activation and clears the error on retry', () => {
    const fixture = TestBed.createComponent(PlanListComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.toggleActive(first, new Event('click'));
    response.error(new Error('Server unavailable'));
    expect(component.plans[0].active).toBeFalse();
    expect(component.savingPlanIds.size).toBe(0);
    expect(component.errorMessage).toContain('nicht aktiviert');

    schedule.updatePlanSettings.and.returnValue(of({ ...first, active: true }));
    component.toggleActive(component.plans[0], new Event('click'));
    expect(component.errorMessage).toBe('');
    expect(component.plans[0].active).toBeTrue();
  });

  it('reports a failed pause correctly', () => {
    const fixture = TestBed.createComponent(PlanListComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    component.plans = [{ ...first, active: true }];
    component.toggleActive(component.plans[0], new Event('click'));
    response.error(new Error('Server unavailable'));
    expect(component.plans[0].active).toBeTrue();
    expect(component.errorMessage).toContain('nicht pausiert');
  });
});
