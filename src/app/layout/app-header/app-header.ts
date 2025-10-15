import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './app-header.html',
  styleUrl: './app-header.css'
})
export class AppHeader {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly currentUser = this.auth.currentUser;

  protected userRole() {
    return this.currentUser()?.role ?? null;
  }

  protected queryParams() {
    const user = this.currentUser();
    return user ? { userId: user.userId } : undefined;
  }

  logout() {
    const user = this.currentUser();
    if (!user) {
      this.auth.clearCurrentUser();
      this.router.navigate(['/welcome']);
      return;
    }

    this.auth.logout(user.userId).subscribe({
      next: () => {
        this.auth.clearCurrentUser();
        this.router.navigate(['/welcome']);
      },
      error: () => {
        this.auth.clearCurrentUser();
        this.router.navigate(['/welcome']);
      }
    });
  }
}
