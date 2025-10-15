import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthUser } from '../models/auth.model';

const API_BASE = 'http://localhost:8080';

export interface DashboardStatsResponse {
  users: number;
  recipes: number;
  inventory: number;
  myRecipeCount: number;
  cuisineCount: number;
  inventoryValue: number;
  currentUser: AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);

  getStats(userId: string): Observable<DashboardStatsResponse> {
    const params = new HttpParams().set('userId', userId);
    return this.http.get<DashboardStatsResponse>(`${API_BASE}/dashboard-stats-34076352`, { params });
  }
}
