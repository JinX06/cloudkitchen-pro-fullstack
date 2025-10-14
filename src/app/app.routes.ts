import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Welcome } from './features/welcome/welcome';

export const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'welcome', component: Welcome, title: 'Welcome to Recipe Hub V3' },
  { path: 'auth/login', component: Login, title: 'Login' },
  { path: 'auth/register', component: Register, title: 'Register' }
];
