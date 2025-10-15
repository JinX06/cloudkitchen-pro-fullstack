import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthResponse } from '../models/auth.model';

const API_BASE = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);

  login(credentials: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${API_BASE}/login-34076352`, credentials);
  }

  register(body: any) {
    return this.http.post<AuthResponse>(`${API_BASE}/register-34076352`, body);
  }

  logout(userId: string) {
    const params = new HttpParams().set('userId', userId);
    return this.http.post<void>(`${API_BASE}/logout-34076352`, null, { params });
  }

}
