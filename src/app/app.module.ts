import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withXsrfConfiguration, withXhr } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { ResilienceInterceptor } from './core/resilience.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { OnboardingTourComponent } from './features/onboarding/onboarding-tour.component';

@NgModule({ declarations: [AppComponent], bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        OnboardingTourComponent], providers: [provideHttpClient(withXhr(), withInterceptorsFromDi(), withXsrfConfiguration({
            cookieName: 'XSRF-TOKEN',
            headerName: 'X-XSRF-TOKEN',
        })),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ResilienceInterceptor, multi: true },
    ] })
export class AppModule { }

