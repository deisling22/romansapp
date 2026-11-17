import { HttpErrorResponse } from '@angular/common/http';

export function pollError(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    const body: unknown = error.error;
    if (body && typeof body === 'object' && 'message' in body && typeof body.message === 'string') {
      return body.message;
    }
    if (error.status === 404) {
      return 'Diese Abfrage wurde gelöscht oder ist nach fünf Tagen abgelaufen.';
    }
    if (error.status === 401) {
      return 'Bitte melde dich erneut an, um deine Abfragen zu verwalten.';
    }
  }
  return fallback;
}
