import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  protected form: {
    fullname: string;
    phone: string;
    role: '' | 'chef' | 'manager' | 'admin';
    email: string;
    password: string;
  } = {
    fullname: '',
    phone: '',
    role: '',
    email: '',
    password: ''
  };

  protected error: string | null = null;

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // Interactive Password validation  (Like in A2)
  protected get passwordHasMinLength() {
    return (this.form.password || '').length >= 8;
  }

  protected get passwordHasUppercase() {
    return /[A-Z]/.test(this.form.password || '');
  }

  protected get passwordHasLowercase() {
    return /[a-z]/.test(this.form.password || '');
  }

  protected get passwordHasNumber() {
    return /\d/.test(this.form.password || '');
  }

  protected get passwordHasSpecial() {
    return /[^A-Za-z0-9]/.test(this.form.password || '');
  }

  // Handle form submission
  submit(form: any) {
    
    // if form is invalid, mark all fields as touched to show validation errors
    if (form.invalid) {
      form.form.markAllAsTouched();
      return;
    }

    const payload = {
      fullname: this.form.fullname.trim(),
      phone: this.form.phone.trim(),
      role: this.form.role,
      email: this.form.email.trim(),
      password: this.form.password
    };

    this.auth.register(payload).subscribe({
      next: () => {
        this.error = null;
        form.resetForm({ role: '' });
        this.router.navigate(['/login-34076352']);
      },
      error: (err) => {
        this.error = 'Unable to create the account.';
      }
    });
  }
}
