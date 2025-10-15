import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { UserContextService } from '../../services/user-context.service';

@Component({
  selector: 'app-app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css'
})
export class AppHeader {
  private readonly auth = inject(AuthService);
  private readonly userContext = inject(UserContextService);
  private readonly router = inject(Router);
  
  protected readonly currentUser = this.userContext.currentUser;
  user = this.currentUser()!;

  logout() {
    const { userId } = this.currentUser()!;

    this.auth.logout(userId).subscribe({
      next: () => {
        this.userContext.clear();
        this.router.navigate(['/welcome-34076352']);
      },
      error: () => {
        this.userContext.clear();
        this.router.navigate(['/welcome-34076352']);
      }
    });
  }
}
