import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const API_BASE = '/api';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private readonly http = inject(HttpClient);

  analyzeTranslation(userId: string, payload: any){
    return this.http.post<any>(`${API_BASE}/translate-34076352?userId=${userId}`, payload);
  }
}
