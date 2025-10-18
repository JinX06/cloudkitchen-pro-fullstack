import { Routes } from '@angular/router';
import { Welcome } from './features/welcome/welcome';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { NotFound } from './features/error/not-found/not-found';
import { ListRecipes } from './features/recipes/list-recipes/list-recipes';
import { AddRecipe } from './features/recipes/add-recipe/add-recipe';
import { ViewRecipe } from './features/recipes/view-recipe/view-recipe';
import { EditRecipe } from './features/recipes/edit-recipe/edit-recipe';
import { ListInventory } from './features/inventory/list-inventory/list-inventory';
import { AddInventory } from './features/inventory/add-inventory/add-inventory';
import { ViewInventory } from './features/inventory/view-inventory/view-inventory';
import { EditInventory } from './features/inventory/edit-inventory/edit-inventory';
import { ChefGuard } from './guards/chef-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/welcome-34076352', pathMatch: 'full' },
  { path: 'welcome-34076352', component: Welcome, title: 'Welcome to Recipe Hub V3' },
  { path: 'login-34076352', component: Login, title: 'Login' },
  { path: 'register-34076352', component: Register, title: 'Register' },
  { path: 'home-34076352', component: Dashboard, canActivate: [authGuard], title: 'Home' },
  { path: 'recipes-34076352', component: ListRecipes, canActivate: [authGuard, ChefGuard], title: 'Recipes' },
  { path: 'recipes-add-34076352', component: AddRecipe, canActivate: [authGuard, ChefGuard], title: 'Add Recipe' },
  { path: 'recipes-view-34076352', component: ViewRecipe, canActivate: [authGuard, ChefGuard], title: 'View Recipe' },
  { path: 'recipes-edit-34076352', component: EditRecipe, canActivate: [authGuard, ChefGuard], title: 'Edit Recipe' },
  { path: 'inventory-34076352', component: ListInventory, canActivate: [authGuard], title: 'Inventory' },
  { path: 'inventory-add-34076352', component: AddInventory, canActivate: [authGuard], title: 'Add Inventory' },
  { path: 'inventory-view-34076352', component: ViewInventory, canActivate: [authGuard], title: 'View Inventory' },
  { path: 'inventory-edit-34076352', component: EditInventory, canActivate: [authGuard], title: 'Edit Inventory' },
  { path: "**", component: NotFound, title: "404 Not Found" }
];
