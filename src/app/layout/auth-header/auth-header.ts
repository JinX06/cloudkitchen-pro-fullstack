import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './auth-header.html',
  styleUrl: './auth-header.css'
})
export class AuthHeader {
  private readonly auth = inject(AuthService);

  protected queryParams() {
    const user = this.auth.currentUser();
    return user ? { userId: user.userId } : undefined;
  }
}
