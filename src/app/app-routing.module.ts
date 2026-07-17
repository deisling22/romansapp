import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DishCreateComponent } from './features/dishes/dish-create.component';
import { PlanDetailComponent } from './features/plans/plan-detail.component';
import { PlanListComponent } from './features/plans/plan-list.component';

const routes: Routes = [
  { path: 'plans', component: PlanListComponent },
  { path: 'plans/:planId', component: PlanDetailComponent },
  { path: 'plans/:planId/dishes/new', component: DishCreateComponent },
  { path: '', pathMatch: 'full', redirectTo: 'plans' },
  { path: '**', redirectTo: 'plans' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
