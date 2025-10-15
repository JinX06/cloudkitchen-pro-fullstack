import { Routes } from '@angular/router';
import { Welcome } from './features/welcome/welcome';
import { Dashboard } from './features/dashboard/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { NotFound } from './features/error/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: '/welcome-34076352', pathMatch: 'full' },
  { path: 'welcome-34076352', component: Welcome, title: 'Welcome to Recipe Hub V3' },
  { path: 'login-34076352', component: Login, title: 'Login' },
  { path: 'register-34076352', component: Register, title: 'Register' },
  { path: 'home-34076352', component: Dashboard, canActivate: [authGuard], title: 'Home' },
  { path: "**", component: NotFound, title: "404 Not Found" }
];
