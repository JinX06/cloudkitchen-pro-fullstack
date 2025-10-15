import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { AuthService } from './services/auth.service';
import { AuthHeader } from './layout/auth-header/auth-header';
import { AppHeader } from './layout/app-header/app-header';
import { AppFooter } from './layout/app-footer/app-footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AuthHeader, AppHeader, AppFooter],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly auth = inject(AuthService);

  protected readonly currentUser = this.auth.currentUser;
}
