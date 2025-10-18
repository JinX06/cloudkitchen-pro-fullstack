import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UserContextService } from '../../../services/user-context.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  protected form: {
    email: string;
    password: string;
  } = {
    email: '',
    password: ''
  };

  protected error: string | null = null;
  protected success: string | null = null;

  private readonly auth = inject(AuthService);
  private readonly userContext = inject(UserContextService);
  private readonly router = inject(Router);
  contextUserId = this.userContext.getUserId();
 

  protected readonly userId = this.contextUserId
  // protected readonly userId = this.route.snapshot.queryParamMap.get('userId');
  protected readonly queryParams = { userId: this.userId };

  submit(form: any) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }

    this.userContext.clear();

    const payload = {
      email: this.form.email.trim(),
      password: this.form.password
    };

    this.auth.login(payload).subscribe(
      (response) => {
        this.error = null;
        this.success = 'Logged in successfully.';

        this.userContext.setUser(response.user);

        this.router.navigate(['/home-34076352'], {
          queryParams: { userId: response.user.userId }
        });
      },
      (err) => {
        this.success = null;
        this.error = err.error.error || 'Login failed.';
      }
    );
  }
}
