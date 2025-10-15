import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthResponse, AuthUser } from '../models/auth.model';

const API_BASE = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly currentUserSignal = signal<AuthUser | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();

  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${API_BASE}/auth/login-34076352`, credentials);
  }

  register(body: any) {
    return this.http.post<AuthResponse>(`${API_BASE}/auth/register-34076352`, body);
  }

  logout(userId: string) {
    const params = new HttpParams().set('userId', userId);
    return this.http.post<void>(`${API_BASE}/auth/logout-34076352`, null, { params });
  }

  setCurrentUser(user: AuthUser | null) {
    this.currentUserSignal.set(user);
  }

  clearCurrentUser() {
    this.currentUserSignal.set(null);
  }

  getCurrentUser() {
    return this.currentUserSignal();
  }
}
