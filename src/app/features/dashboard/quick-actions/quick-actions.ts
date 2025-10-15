import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { UserContextService } from '../../../services/user-context.service';
import { AuthUser } from '../../../models/auth.model';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './quick-actions.html',
  styleUrl: './quick-actions.css'
})
export class QuickActions {
  private readonly userContext = inject(UserContextService);

  protected readonly currentUser = this.userContext.currentUser;
  user = this.userDetails();
  
  protected userDetails(): AuthUser {
    const user = this.currentUser();
    if (!user) {
      throw new Error('No active user in context.');
    }
    return user;
  }

}
