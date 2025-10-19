import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE = '/api';

@Injectable({
  providedIn: 'root'
})
export class AiHealthService {
  private readonly http = inject(HttpClient);

  analyze(userId: string, payload: any): Observable<any> {
    return this.http.post<any>(`${API_BASE}/ai-health-34076352?userId=${userId}`, payload);
  }
}
