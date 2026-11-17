import { HttpErrorResponse } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { of, throwError } from 'rxjs';
import { ManagedMealPoll, MealPollApiService } from '../../core/meal-poll-api.service';
import { ShareService } from '../../core/share.service';
import { MealPollsComponent } from './meal-polls.component';

describe('MealPollsComponent', () => {
  let api: jasmine.SpyObj<MealPollApiService>;
  let sharing: jasmine.SpyObj<ShareService>;
  let component: MealPollsComponent;
  let managed: ManagedMealPoll;
  beforeEach(() => {
    managed = {
      poll: {
        id: 'public-id', createdAt: '2026-11-17T10:00:00Z', expiresAt: '2026-11-22T10:00:00Z', closed: false,
        options: [{ entryId: 1, dishId: 11, name: 'Nudeln', imageUrl: '', mealSlot: 'DINNER' },
          { entryId: 2, dishId: 12, name: 'Suppe', imageUrl: '', mealSlot: 'DINNER' }],
      },
      voteCount: 1, results: [], votes: [{ name: 'Anna', ranking: [1, 2] }],
    };
    api = jasmine.createSpyObj('MealPollApiService', ['list', 'create', 'apply', 'close', 'delete']);
    sharing = jasmine.createSpyObj('ShareService', ['share']);
    api.list.and.returnValue(of([managed]));
    api.create.and.returnValue(of(managed));
    api.apply.and.returnValue(of({ ...managed, poll: { ...managed.poll, closed: true } }));
    component = new MealPollsComponent(api, sharing);
  });

  it('loads existing polls and limits the default top count to the number of options', async () => {
    await component.load();
    expect(component.selected()).toBe(managed);
    expect(component.count).toBe(2);
    expect(component.loading()).toBeFalse();
  });

  it('uses the public voting URL when sharing, not the creator page', async () => {
    sharing.share.and.resolveTo('shared');
    await component.share('public-id');
    expect(sharing.share).toHaveBeenCalledWith(
      'Familienabfrage', jasmine.any(String), jasmine.stringMatching(/#\/vote\/public-id$/));
    expect(component.voteUrl('public-id')).not.toContain('meal-polls');
    expect(decodeURIComponent(component.whatsappUrl('public-id'))).toContain('#/vote/public-id');
  });

  it('does not show a success message if sharing was cancelled', async () => {
    sharing.share.and.resolveTo('cancelled');
    await component.share('public-id');
    expect(component.message()).toBe('');
  });

  it('uses the public website for links shared from the native iPhone app', () => {
    spyOn(Capacitor, 'isNativePlatform').and.returnValue(true);
    expect(component.voteUrl('public-id')).toBe('https://deisling22.github.io/romansapp/#/vote/public-id');
  });

  it('applies exactly the selected top count and reflects the closed state', async () => {
    await component.load();
    component.count = 1;
    await component.change('apply');
    expect(api.apply).toHaveBeenCalledOnceWith('public-id', 1);
    expect(component.selected()?.poll.closed).toBeTrue();
    expect(component.message()).toContain('Top 1');
  });

  it('rejects invalid counts without making a request', async () => {
    await component.load();
    for (const count of [0, 3, 1.5, NaN]) {
      component.count = count;
      await component.change('apply');
    }
    expect(api.apply).not.toHaveBeenCalled();
  });

  it('keeps current results if applying fails and displays the reason', async () => {
    await component.load();
    api.apply.and.returnValue(throwError(() => new HttpErrorResponse({
      status: 409, error: { message: 'Das Gericht wurde entfernt.' },
    })));
    await component.change('apply');
    expect(component.error()).toBe('Das Gericht wurde entfernt.');
    expect(component.selected()?.poll.closed).toBeFalse();
    expect(component.busy()).toBeFalse();
  });
});
