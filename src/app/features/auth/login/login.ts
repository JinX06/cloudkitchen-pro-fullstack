import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

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

  submit(form: NgForm) {
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }

    const payload = {
      email: this.form.email.trim(),
      password: this.form.password
    };

    this.auth.login(payload).subscribe(
      (response) => {
        this.auth.setCurrentUser(response.user);
        this.error = null;
        this.success = 'Logged in successfully.';
      },
      (err: HttpErrorResponse) => {
        this.success = null;
        this.error = err.error.error || 'Login failed.';
      }
    );
  }
}
