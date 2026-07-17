import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DishCreateComponent } from './features/dishes/dish-create.component';
import { DishCatalogComponent } from './features/dishes/dish-catalog.component';
import { DishDetailComponent } from './features/dishes/dish-detail.component';
import { PlanDetailComponent } from './features/plans/plan-detail.component';
import { PlanListComponent } from './features/plans/plan-list.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { SettingsComponent } from './features/settings/settings.component';
import { ShoppingListComponent } from './features/shopping-list/shopping-list.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'dishes', component: DishCatalogComponent },
  { path: 'dishes/:dishId', component: DishDetailComponent },
  { path: 'plans', component: PlanListComponent },
  { path: 'plans/:planId', component: PlanDetailComponent },
  { path: 'plans/:planId/dishes/new', component: DishCreateComponent },
  { path: 'plans/:planId/shopping-list', component: ShoppingListComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

