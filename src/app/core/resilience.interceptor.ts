import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, finalize, retry, share, throwError, timeout, timer } from 'rxjs';
import { environment } from '../../environments/environment';

// Render's free instance can take over a minute to wake after inactivity.
const REQUEST_TIMEOUT_MS = 90_000;
const MAX_RETRIES = 2;

/**
 * Shields the backend from bursts: identical GETs that are still in flight share one request,
 * and requests rejected because the server is busy (503) or hit a parallel change (409) are
 * retried with backoff. Uploads are left alone because they can legitimately take longer.
 */
@Injectable()
export class ResilienceInterceptor implements HttpInterceptor {
  private readonly inFlight = new Map<string, Observable<HttpEvent<unknown>>>();

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith(environment.apiUrl) || request.body instanceof FormData) {
      return next.handle(request);
    }
    const guarded = next.handle(request).pipe(
      timeout(REQUEST_TIMEOUT_MS),
      retry({ count: MAX_RETRIES, delay: (error, attempt) => this.retryDelay(error, attempt) }),
    );
    if (request.method !== 'GET') {
      return guarded;
    }
    const key = request.urlWithParams;
    const existing = this.inFlight.get(key);
    if (existing) {
      return existing;
    }
    const shared = guarded.pipe(
      finalize(() => this.inFlight.delete(key)),
      share(),
    );
    this.inFlight.set(key, shared);
    return shared;
  }

  private retryDelay(error: unknown, attempt: number): Observable<number> {
    if (!(error instanceof HttpErrorResponse) || (error.status !== 503 && error.status !== 409)) {
      return throwError(() => error);
    }
    const retryAfterSeconds = Number(error.headers.get('Retry-After'));
    const delayMs = retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : 300 * 2 ** (attempt - 1);
    return timer(Math.min(delayMs, 4000));
  }
}
