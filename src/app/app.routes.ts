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

export const routes: Routes = [
  { path: '', redirectTo: '/welcome-34076352', pathMatch: 'full' },
  { path: 'welcome-34076352', component: Welcome, title: 'Welcome to Recipe Hub V3' },
  { path: 'login-34076352', component: Login, title: 'Login' },
  { path: 'register-34076352', component: Register, title: 'Register' },
  { path: 'home-34076352', component: Dashboard, canActivate: [authGuard], title: 'Home' },
  { path: 'recipes-34076352', component: ListRecipes, canActivate: [authGuard], title: 'Recipes' },
  { path: 'recipes-add-34076352', component: AddRecipe, canActivate: [authGuard], title: 'Add Recipe' },
  { path: 'recipes-view-34076352', component: ViewRecipe, canActivate: [authGuard], title: 'View Recipe' },
  { path: 'recipes-edit-34076352', component: EditRecipe, canActivate: [authGuard], title: 'Edit Recipe' },
  { path: "**", component: NotFound, title: "404 Not Found" }
];
