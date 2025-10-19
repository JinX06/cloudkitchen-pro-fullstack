import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { RecipesService } from '../../../services/recipes.service';
import { Recipe, RecipeListResponse } from '../../../models/recipe.model';
import { UserContextService } from '../../../services/user-context.service';
import { AiHealthService } from '../../../services/ai-health.service';

@Component({
  selector: 'app-ai-recipe-health',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ai-recipe-health.html',
  styleUrl: './ai-recipe-health.css'
})
export class AiRecipeHealth implements OnInit {
  protected userId = '';
  protected recipes: Recipe[] = [];
  protected selectedRecipeId = '';
  protected ingredientsText = '';
  protected loading = false;
  protected loadingRecipes = false;
  protected error: string | null = null;
  protected formError: string | null = null;
  protected result: any | null = null;
  protected queryParams: any = {};

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly recipesService = inject(RecipesService);
  private readonly aiHealth = inject(AiHealthService);
  private readonly userContext = inject(UserContextService);

  ngOnInit(): void {
    const contextUserId = this.userContext.getUserId() || '';
    this.userId = contextUserId || '';

    if (!this.userId) {
      this.error = 'User information is unavailable.';
      return;
    }

    this.queryParams = { userId: this.userId };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.queryParams,
      replaceUrl: true,
    });

    const preselectedId = this.route.snapshot.queryParamMap.get('recipeId') || '';
    this.loadRecipes(preselectedId);
  }

  protected analyze(): void {
    this.formError = null;
    this.error = null;

    const payload: any = {
      ingredients: this.ingredientsText.trim(),
    };

    // find selected recipe details
    const selectedRecipe = this.recipes.find((recipe) => recipe.recipeId === this.selectedRecipeId);
    if (selectedRecipe) {
      payload.recipeId = selectedRecipe.recipeId;
      payload.title = selectedRecipe.title;
    }

    this.loading = true;
    this.result = null;

    // pass to AI health analysis service
    this.aiHealth.analyze(this.userId, payload).subscribe({
      next: (response) => {
        this.loading = false;
        this.result = {
          healthScore: response.healthScore || null,
          concerns: Array.isArray(response.concerns) ? response.concerns : [],
          suggestions: Array.isArray(response.suggestions) ? response.suggestions : [],
        };
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.error || 'Unable to analyze recipe health.';
      },
    });
  }

  // handles recipe selection change
  protected onRecipeChange(recipeId: string): void {
    this.selectedRecipeId = recipeId;
    this.formError = null;
    this.error = null;
    this.result = null;

    const selected = this.recipes.find((recipe) => recipe.recipeId === recipeId);
    if (selected) {
      this.ingredientsText = (selected.ingredients || []).join('\n');
    } else if (!recipeId) {
      this.ingredientsText = '';
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...this.queryParams, recipeId: recipeId || null },
      replaceUrl: true,
    });
  }

  // sets bootsrap badge class based on score value
  protected getScoreBadge(score: number | null | undefined): string {
    const value = Number(score);
    if (!Number.isFinite(value)) {
      return 'badge bg-secondary';
    }

    if (value >= 75) {
      return 'badge bg-success';
    }
    if (value >= 50) {
      return 'badge bg-warning text-dark';
    }
    return 'badge bg-danger';
  }

  // loads recipes for the user
  private loadRecipes(selectedId: string): void {
    this.loadingRecipes = true;
    this.recipesService.list(this.userId).subscribe({
      next: (response: RecipeListResponse) => {
        this.loadingRecipes = false;
        this.recipes = response.items || [];

        // if preselected id exists in the list, select it
        if (selectedId) {
          const exists = this.recipes.find((recipe) => recipe.recipeId === selectedId);
          if (exists) {
            this.onRecipeChange(selectedId);
            return;
          }
        }

        // select the first recipe by default
        if (this.recipes.length && !this.selectedRecipeId) {
          this.onRecipeChange(this.recipes[0].recipeId);
        }
      },
      error: (err) => {
        this.loadingRecipes = false;
        this.error = err.error?.error || 'Unable to load recipes.';
      },
    });
  }
}
