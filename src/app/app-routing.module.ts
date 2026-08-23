import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DishCreateComponent } from './features/dishes/dish-create.component';
import { DishCatalogComponent } from './features/dishes/dish-catalog.component';
import { DishDetailComponent } from './features/dishes/dish-detail.component';
import { PlanDetailComponent } from './features/plans/plan-detail.component';
import { PlanListComponent } from './features/plans/plan-list.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SettingsComponent } from './features/settings/settings.component';
import { pendingCartCheckoutGuard, ShoppingListComponent } from './features/shopping-list/shopping-list.component';
import { PantryComponent } from './features/pantry/pantry.component';
import { AccountComponent } from './features/auth/account.component';
import { LoginComponent } from './features/auth/login.component';
import { AuthGuard } from './core/auth.guard';
import { CreatorFeedComponent } from './features/creators/creator-feed.component';
import { CreatorPlanComponent } from './features/creators/creator-plan.component';
import { CreatorProfileComponent } from './features/creators/creator-profile.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
  { path: 'dishes', component: DishCatalogComponent },
  { path: 'dishes/:dishId', component: DishDetailComponent },
  { path: 'plans', component: PlanListComponent },
  { path: 'plans/:planId', component: PlanDetailComponent },
  { path: 'plans/:planId/dishes/new', component: DishCreateComponent },
  { path: 'shopping-list', component: ShoppingListComponent, canDeactivate: [pendingCartCheckoutGuard] },
  { path: 'pantry', component: PantryComponent },
  { path: 'creators', component: CreatorFeedComponent },
  { path: 'creators/:creatorId', component: CreatorProfileComponent },
  { path: 'creators/:creatorId/plans/:planId', component: CreatorPlanComponent },
  {
    path: 'plans/:planId/shopping-list',
    component: ShoppingListComponent,
    canDeactivate: [pendingCartCheckoutGuard],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

