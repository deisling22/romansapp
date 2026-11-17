import { Injectable, Optional } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, TimeoutError, defer, finalize, retry, share, throwError, timeout, timer } from 'rxjs';
import { environment } from '../../environments/environment';
import { BackendStatusService } from './backend-status.service';

// Render's free instance can take minutes to wake after inactivity.
const REQUEST_TIMEOUT_MS = 90_000;
const MAX_RETRIES = 2;
/** Reads are repeated until the instance is awake: 4 attempts cover a wake-up of up to six minutes. */
const MAX_READ_RETRIES = 3;
const GATEWAY_ERRORS = [0, 502, 504];

/**
 * Shields the backend from bursts and the user from its cold starts: identical GETs that are still in
 * flight share one request; requests rejected because the server is busy (503) or hit a parallel change
 * (409) are retried with backoff; reads are additionally repeated after a timeout or gateway error,
 * because the sleeping instance answers the first request late or not at all. Writes are never repeated
 * after a timeout (they may have been applied), and uploads are left alone.
 */
@Injectable()
export class ResilienceInterceptor implements HttpInterceptor {
  private readonly inFlight = new Map<string, Observable<HttpEvent<unknown>>>();

  constructor(@Optional() private readonly backendStatus?: BackendStatusService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.url.startsWith(environment.apiUrl) || request.body instanceof FormData) {
      return next.handle(request);
    }
    const isRead = request.method === 'GET';
    const guarded = defer(() => {
      const finished = this.backendStatus?.track();
      // Deferred so that every attempt sends a fresh request.
      return defer(() => next.handle(request)).pipe(
        timeout(REQUEST_TIMEOUT_MS),
        retry({
          count: isRead ? MAX_READ_RETRIES : MAX_RETRIES,
          delay: (error, attempt) => this.retryDelay(error, attempt, isRead),
        }),
        finalize(() => finished?.()),
      );
    });
    if (!isRead) {
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

  private retryDelay(error: unknown, attempt: number, isRead: boolean): Observable<number> {
    if (error instanceof HttpErrorResponse && (error.status === 503 || error.status === 409)) {
      const retryAfterSeconds = Number(error.headers.get('Retry-After'));
      const delayMs = retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : 300 * 2 ** (attempt - 1);
      return timer(Math.min(delayMs, 4000));
    }
    const wakingUp = error instanceof TimeoutError
      || (error instanceof HttpErrorResponse && GATEWAY_ERRORS.includes(error.status) && navigator.onLine);
    if (isRead && wakingUp) {
      return timer(Math.min(1000 * attempt, 3000));
    }
    return throwError(() => error);
  }
}
