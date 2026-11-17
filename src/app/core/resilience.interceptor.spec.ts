import { HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { fakeAsync, tick } from '@angular/core/testing';
import { map, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResilienceInterceptor } from './resilience.interceptor';

describe('ResilienceInterceptor cold starts', () => {
  for (const method of ['GET', 'PUT']) {
    it(`allows a ${method} response after a 67-second server wake-up`, fakeAsync(() => {
      const handler = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);
      handler.handle.and.returnValue(timer(67_000).pipe(map(() => new HttpResponse({ status: 200 }))));
      const next = jasmine.createSpy('next');
      const error = jasmine.createSpy('error');
      new ResilienceInterceptor().intercept(
        new HttpRequest(method, `${environment.apiUrl}/plans/1/settings`, null), handler,
      ).subscribe({ next, error });

      tick(66_999);
      expect(next).not.toHaveBeenCalled();
      expect(error).not.toHaveBeenCalled();
      tick(1);
      expect(next).toHaveBeenCalledTimes(1);
      expect(error).not.toHaveBeenCalled();
    }));
  }

  it('does not repeat a write that timed out after 90 seconds', fakeAsync(() => {
    const handler = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);
    handler.handle.and.returnValue(timer(100_000).pipe(map(() => new HttpResponse({ status: 200 }))));
    const error = jasmine.createSpy('error');
    new ResilienceInterceptor().intercept(
      new HttpRequest('PUT', `${environment.apiUrl}/plans/1/settings`, null), handler,
    ).subscribe({ error });
    tick(90_000);
    expect(error).toHaveBeenCalledTimes(1);
    expect(error.calls.mostRecent().args[0].name).toBe('TimeoutError');
    expect(handler.handle).toHaveBeenCalledTimes(1);
  }));

  it('keeps asking for a read while the server wakes up and delivers the late answer', fakeAsync(() => {
    const handler = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);
    let attempt = 0;
    handler.handle.and.callFake(() =>
      timer(++attempt < 3 ? 100_000 : 20_000).pipe(map(() => new HttpResponse({ status: 200 }))));
    const next = jasmine.createSpy('next');
    const error = jasmine.createSpy('error');
    new ResilienceInterceptor().intercept(
      new HttpRequest('GET', `${environment.apiUrl}/plans`), handler,
    ).subscribe({ next, error });

    tick(90_000 + 1_000 + 90_000 + 2_000 + 19_999);
    expect(next).not.toHaveBeenCalled();
    tick(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(error).not.toHaveBeenCalled();
    expect(handler.handle).toHaveBeenCalledTimes(3);
  }));

  it('gives up on a read after four attempts', fakeAsync(() => {
    const handler = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);
    handler.handle.and.callFake(() => timer(100_000).pipe(map(() => new HttpResponse({ status: 200 }))));
    const error = jasmine.createSpy('error');
    new ResilienceInterceptor().intercept(
      new HttpRequest('GET', `${environment.apiUrl}/plans`), handler,
    ).subscribe({ error });

    tick(4 * 90_000 + 1_000 + 2_000 + 3_000);
    expect(error).toHaveBeenCalledTimes(1);
    expect(handler.handle).toHaveBeenCalledTimes(4);
  }));
});
