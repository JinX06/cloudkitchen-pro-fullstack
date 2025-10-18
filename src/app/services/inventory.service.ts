import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_BASE = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly http = inject(HttpClient);

  list(userId: string): Observable<any> {
    return this.http.get<any>(`${API_BASE}/inventory-list-34076352?userId=${userId}`);
  }

  getById(inventoryId: string, userId: string): Observable<any> {
    return this.http.get<any>(`${API_BASE}/inventory-view-34076352/${inventoryId}?userId=${userId}`);
  }

  create(payload: any, userId: string): Observable<any> {
    return this.http.post<any>(`${API_BASE}/inventory-add-34076352?userId=${userId}`, payload);
  }

  update(payload: any, userId: string): Observable<any> {
    const inventoryId = (payload.inventoryId || '').toString().trim();
    return this.http.post<any>(`${API_BASE}/inventory-update-34076352/${inventoryId}?userId=${userId}`,payload);
  }

  remove(inventoryId: string, userId: string): Observable<void> {
    return this.http.post<void>(`${API_BASE}/inventory-delete-34076352?userId=${userId}&itemID=${inventoryId}`, {});
  }
}
