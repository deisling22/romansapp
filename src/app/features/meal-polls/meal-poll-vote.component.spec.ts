import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { MealPollApiService, PublicMealPoll } from '../../core/meal-poll-api.service';
import { MealPollVoteComponent } from './meal-poll-vote.component';

const poll: PublicMealPoll = {
  id: 'public-id', createdAt: '2026-11-17T10:00:00Z', expiresAt: '2026-11-22T10:00:00Z', closed: false,
  options: [
    { entryId: 1, dishId: 11, name: 'Nudeln', imageUrl: '', mealSlot: 'DINNER' },
    { entryId: 2, dishId: 12, name: 'Suppe', imageUrl: '', mealSlot: 'DINNER' },
    { entryId: 3, dishId: 13, name: 'Salat', imageUrl: '', mealSlot: 'LUNCH' },
  ],
};

describe('MealPollVoteComponent', () => {
  let api: jasmine.SpyObj<MealPollApiService>;
  let component: MealPollVoteComponent;
  beforeEach(async () => {
    api = jasmine.createSpyObj('MealPollApiService', ['getPublic', 'vote']);
    api.getPublic.and.returnValue(of(structuredClone(poll)));
    api.vote.and.returnValue(of(undefined));
    TestBed.configureTestingModule({
      providers: [
        { provide: MealPollApiService, useValue: api },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: poll.id }) } } },
      ],
    });
    component = new MealPollVoteComponent(api, TestBed.inject(ActivatedRoute));
    component.ngOnInit();
    await Promise.resolve();
  });

  it('loads without authentication and submits the full current ranking with the name', async () => {
    component.move(2, 0);
    component.name = ' Anna ';
    await component.submit();
    expect(api.vote).toHaveBeenCalledOnceWith('public-id', 'Anna', [3, 1, 2]);
    expect(component.submitted()).toBeTrue();
    expect(poll.options.map((option) => option.entryId)).toEqual([1, 2, 3]);
  });

  it('requires a name and prevents duplicate submission while sending', async () => {
    await component.submit();
    expect(component.error()).toContain('Namen');
    expect(api.vote).not.toHaveBeenCalled();
    const response = new Subject<void>();
    api.vote.and.returnValue(response);
    component.name = 'Anna';
    const pending = component.submit();
    await component.submit();
    component.move(2, 0);
    expect(component.options().map((option) => option.entryId)).toEqual([1, 2, 3]);
    expect(api.vote).toHaveBeenCalledTimes(1);
    response.next();
    response.complete();
    await pending;
    await component.submit();
    expect(api.vote).toHaveBeenCalledTimes(1);
  });

  it('does not allow voting or reordering a closed poll', async () => {
    component.poll.set({ ...poll, closed: true });
    component.name = 'Anna';
    component.move(2, 0);
    await component.submit();
    expect(component.options()[0].entryId).toBe(1);
    expect(api.vote).not.toHaveBeenCalled();
  });

  it('preserves the ranking and name on failed submission and allows retry', async () => {
    api.vote.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
    component.name = 'Anna';
    component.move(1, 0);
    await component.submit();
    expect(component.submitted()).toBeFalse();
    expect(component.error()).toContain('abgelaufen');
    expect(component.name).toBe('Anna');
    expect(component.options()[0].entryId).toBe(2);
    api.vote.and.returnValue(of(undefined));
    await component.submit();
    expect(component.submitted()).toBeTrue();
  });

  it('shows the server message if the creator closed the poll while it was open', async () => {
    api.vote.and.returnValue(throwError(() => new HttpErrorResponse({
      status: 409, error: { message: 'Diese Abfrage wurde bereits beendet.' },
    })));
    component.name = 'Anna';
    await component.submit();
    expect(component.error()).toBe('Diese Abfrage wurde bereits beendet.');
  });
});
