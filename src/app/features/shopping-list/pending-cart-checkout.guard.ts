import { CanDeactivateFn } from '@angular/router';
import type { ShoppingListComponent } from './shopping-list.component';

export const pendingCartCheckoutGuard: CanDeactivateFn<ShoppingListComponent> = (component) =>
  component.prepareForExit();
