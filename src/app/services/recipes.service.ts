import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  RecipeListResponse,
  RecipeResponse,
  RecipeCreateRequest,
  RecipeUpdateRequest,
} from '../models/recipe.model';

const API_BASE = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private readonly http = inject(HttpClient);

  list(userId: string): Observable<RecipeListResponse> {
    return this.http.get<RecipeListResponse>(`${API_BASE}/recipes-list-34076352?userId=${userId}`);
  }

  getById(recipeId: string, userId: string): Observable<RecipeResponse> {
    return this.http.get<RecipeResponse>(`${API_BASE}/recipes-view-34076352/${recipeId}?userId=${userId}`);
  }

  create(payload: RecipeCreateRequest, userId: string): Observable<RecipeResponse> {
    return this.http.post<RecipeResponse>(`${API_BASE}/recipes-add-34076352?userId=${userId}`, payload);
  }

  update(payload: RecipeUpdateRequest, userId: string): Observable<RecipeResponse> {
    const { recipeId, ...body } = payload;
    return this.http.put<RecipeResponse>(`${API_BASE}/recipes-update-34076352/${recipeId}?userId=${userId}`, body);
  }

  remove(recipeId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${API_BASE}/recipes-delete-34076352?userId=${userId}&recipeId=${recipeId}`);
  }
}
