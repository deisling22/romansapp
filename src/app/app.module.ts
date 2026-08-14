import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi, withXsrfConfiguration, withXhr } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DishCreateComponent } from './features/dishes/dish-create.component';
import { DishCatalogComponent } from './features/dishes/dish-catalog.component';
import { DishDetailComponent } from './features/dishes/dish-detail.component';
import { PlanDetailComponent } from './features/plans/plan-detail.component';
import { PlanListComponent } from './features/plans/plan-list.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SettingsComponent } from './features/settings/settings.component';
import { ShoppingListComponent } from './features/shopping-list/shopping-list.component';
import { AccountComponent } from './features/auth/account.component';
import { LoginComponent } from './features/auth/login.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StarRatingComponent } from './shared/star-rating.component';

@NgModule({ declarations: [
        AppComponent,
        PlanListComponent,
        PlanDetailComponent,
        DishCreateComponent,
        DishCatalogComponent,
        DishDetailComponent,
        DashboardComponent,
        SettingsComponent,
        ShoppingListComponent,
        AccountComponent,
        LoginComponent,
        StarRatingComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        })], providers: [provideHttpClient(withXhr(), withInterceptorsFromDi(), withXsrfConfiguration({
            cookieName: 'XSRF-TOKEN',
            headerName: 'X-XSRF-TOKEN',
        }))] })
export class AppModule { }

