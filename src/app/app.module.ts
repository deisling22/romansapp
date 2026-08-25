import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withXsrfConfiguration, withXhr } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DishCreateComponent } from './features/dishes/dish-create.component';
import { DishCatalogComponent } from './features/dishes/dish-catalog.component';
import { DishDetailComponent } from './features/dishes/dish-detail.component';
import { PlanDetailComponent } from './features/plans/plan-detail.component';
import { PlanListComponent } from './features/plans/plan-list.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SettingsComponent } from './features/settings/settings.component';
import { ShoppingListComponent } from './features/shopping-list/shopping-list.component';
import { PantryComponent } from './features/pantry/pantry.component';
import { AccountComponent } from './features/auth/account.component';
import { LoginComponent } from './features/auth/login.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StarRatingComponent } from './shared/star-rating.component';
import { CreatorFeedComponent } from './features/creators/creator-feed.component';
import { CreatorPlanComponent } from './features/creators/creator-plan.component';
import { CreatorProfileComponent } from './features/creators/creator-profile.component';
import { IngredientScanComponent } from './features/ingredient-scan/ingredient-scan.component';
import { RecipeScanComponent } from './features/recipe-scan/recipe-scan.component';
import { ProgressComponent } from './features/progress/progress.component';
import { OnboardingTourComponent } from './features/onboarding/onboarding-tour.component';

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
        PantryComponent,
        AccountComponent,
        LoginComponent,
        StarRatingComponent,
        CreatorFeedComponent,
        CreatorProfileComponent,
        CreatorPlanComponent,
        IngredientScanComponent,
        RecipeScanComponent,
        ProgressComponent,
        OnboardingTourComponent,
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
        })),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    ] })
export class AppModule { }

