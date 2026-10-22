import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { pendingCartCheckoutGuard } from './features/shopping-list/pending-cart-checkout.guard';
import { AuthGuard } from './core/auth.guard';

const loadShoppingList = () =>
  import('./features/shopping-list/shopping-list.component').then((m) => m.ShoppingListComponent);
const loadPlanDetail = () => import('./features/plans/plan-detail.component').then((m) => m.PlanDetailComponent);
const loadDishCreate = () => import('./features/dishes/dish-create.component').then((m) => m.DishCreateComponent);
const loadRecipeScan = () => import('./features/recipe-scan/recipe-scan.component').then((m) => m.RecipeScanComponent);

// The start screen stays eager for a fast first paint; everything else is code-split and preloaded after startup.
const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardComponent },
  { path: 'settings', loadComponent: () => import('./features/settings/settings.component').then((m) => m.SettingsComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent) },
  {
    path: 'account',
    loadComponent: () => import('./features/auth/account.component').then((m) => m.AccountComponent),
    canActivate: [AuthGuard],
  },
  {
    path: 'progress',
    loadComponent: () => import('./features/progress/progress.component').then((m) => m.ProgressComponent),
    canActivate: [AuthGuard],
  },
  { path: 'dishes', loadComponent: () => import('./features/dishes/dish-catalog.component').then((m) => m.DishCatalogComponent) },
  { path: 'dishes/:dishId', loadComponent: () => import('./features/dishes/dish-detail.component').then((m) => m.DishDetailComponent) },
  { path: 'plans', loadComponent: () => import('./features/plans/plan-list.component').then((m) => m.PlanListComponent) },
  { path: 'local-plans/:clientId', loadComponent: loadPlanDetail },
  { path: 'local-plans/:clientId/dishes/new', loadComponent: loadDishCreate },
  { path: 'plans/:planId', loadComponent: loadPlanDetail },
  { path: 'plans/:planId/dishes/new', loadComponent: loadDishCreate },
  { path: 'plans/:planId/dishes/scan', loadComponent: loadRecipeScan },
  { path: 'recipe-scan', loadComponent: loadRecipeScan },
  { path: 'receipts', loadComponent: () => import('./features/receipts/receipts.component').then((m) => m.ReceiptsComponent) },
  { path: 'shopping-list', loadComponent: loadShoppingList, canDeactivate: [pendingCartCheckoutGuard] },
  { path: 'pantry', loadComponent: () => import('./features/pantry/pantry.component').then((m) => m.PantryComponent) },
  { path: 'creators', loadComponent: () => import('./features/creators/creator-feed.component').then((m) => m.CreatorFeedComponent) },
  {
    path: 'creators/:creatorId',
    loadComponent: () => import('./features/creators/creator-profile.component').then((m) => m.CreatorProfileComponent),
  },
  {
    path: 'creators/:creatorId/plans/:planId',
    loadComponent: () => import('./features/creators/creator-plan.component').then((m) => m.CreatorPlanComponent),
  },
  {
    path: 'ingredient-scan',
    loadComponent: () => import('./features/ingredient-scan/ingredient-scan.component').then((m) => m.IngredientScanComponent),
  },
  { path: 'plans/:planId/shopping-list', loadComponent: loadShoppingList, canDeactivate: [pendingCartCheckoutGuard] },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
