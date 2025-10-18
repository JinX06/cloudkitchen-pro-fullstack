import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { RecipesService } from '../../../services/recipes.service';
import { Recipe, RecipePayload, RecipeResponse } from '../../../models/recipe.model';
import { UserContextService } from '../../../services/user-context.service';

@Component({
  selector: 'app-edit-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-recipe.html',
  styleUrl: './edit-recipe.css'
})
export class EditRecipe implements OnInit {
  protected userId = '';
  protected queryParams: any= {};

  protected recipes: Recipe[] = [];
  protected selectedRecipeId = '';
  protected currentRecipe!: Recipe;

  protected formData = {
    recipeId: '',
    title: '',
    mealType: '',
    cuisineType: '',
    prepTime: 30,
    difficulty: '',
    servings: 2,
    ingredientsText: '',
    instructionsText: '',
  };

  protected isLoading = false;
  protected isSaving = false;
  protected serverError: string | null = null;
  protected success: string | null = null;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recipesService = inject(RecipesService);
  private readonly userContext = inject(UserContextService);

  ngOnInit(): void {
    if (!this.loadUserinfo()) {
      return;
    }

    this.loadRecipesForSelect();
  }

  // when user selects a different recipe from the dropdown
  protected onRecipeChange(recipeId: string): void {
    if (!recipeId) {
      return;
    }

    this.selectedRecipeId = recipeId;
    this.router.navigate(['/recipes-edit-34076352'], {
      queryParams: { ...this.queryParams, recipeId },
      replaceUrl: true,
    });
    this.fetchRecipe(recipeId);
  }

  protected submit(form: any): void {
    if (!this.userId || form.invalid || !this.selectedRecipeId) {
      form.form.markAllAsTouched();
      return;
    }

    const payload: RecipePayload = {
      chef: this.currentRecipe.chef,
      title: this.formData.title.trim(),
      mealType: this.formData.mealType as RecipePayload['mealType'],
      cuisineType: this.formData.cuisineType as RecipePayload['cuisineType'],
      prepTime: Number(this.formData.prepTime),
      difficulty: this.formData.difficulty as RecipePayload['difficulty'],
      servings: Number(this.formData.servings),
      ingredients: this.formData.ingredientsText,
      instructions: this.formData.instructionsText,
    };

    this.isSaving = true;
    this.serverError = null;
    this.success = null;
    
    this.recipesService
    .update({ ...payload, recipeId: this.selectedRecipeId }, this.userId)
    .subscribe({
      next: (response) => this.handleUpdateSuccess(response),
      error: (err) => this.handleUpdateError(err),
    });
  }
  
  private handleUpdateSuccess(response: RecipeResponse): void {
    this.isSaving = false;
    const updated = response.recipe || null;

    if (updated) {
      this.currentRecipe = updated;
      this.selectedRecipeId = updated.recipeId;
      this.formData = this.createStateFromRecipe(updated);
    }

    this.success = 'Recipe updated successfully.';
  }

  private handleUpdateError(err: any): void {
    this.isSaving = false;

    this.serverError = err.error?.error || 'Unable to update recipe.';
  }

  // Load user info from context and update query params
  private loadUserinfo(): boolean {
    this.userId = this.userContext.getUserId() || '';
    this.queryParams = { userId: this.userId };

    if (!this.userId) {
      this.serverError = 'User information is unavailable.';
      return false;
    }

    const params = { ...this.queryParams };
    if (this.selectedRecipeId) {
      params['recipeId'] = this.selectedRecipeId;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      replaceUrl: true,
    });

    return true;
  }

  // For the dropdown recipes loader
  private loadRecipesForSelect() {
    this.recipesService.list(this.userId).subscribe({
      next: (response) => {
        this.recipes = response.items;
        if (!this.selectedRecipeId && this.recipes.length > 0) {
          this.selectedRecipeId = this.recipes[0].recipeId;
          this.router.navigate(['/recipes-edit-34076352'], {
            queryParams: { userId: this.userId, recipeId: this.selectedRecipeId },
            replaceUrl: true,
          });
        }

        if (this.selectedRecipeId) {
          this.fetchRecipe(this.selectedRecipeId);
        }
      },
      error: (err) => {
        this.serverError = err.error?.error || 'Unable to load recipes.';
      },
    });
  }

  // Fetch recipe details by ID
  private fetchRecipe(recipeId: string): void {
    this.isLoading = true;
    this.serverError = null;

    this.recipesService.getById(recipeId, this.userId).subscribe({
      next: (response: RecipeResponse) => {
        this.isLoading = false;
        const recipe = response.item;
        this.currentRecipe = recipe;

        if (!this.currentRecipe) {
          this.serverError = 'Recipe not found.';
          return;
        }

        this.selectedRecipeId = this.currentRecipe.recipeId;
        this.formData = this.createStateFromRecipe(this.currentRecipe);
      },
      error: (err) => {
        this.isLoading = false;

        this.serverError = err.error?.error || 'Unable to load recipe.';
      },
    });
  }

  // Create form state using recipe data
  private createStateFromRecipe(recipe: Recipe) {
    return {
      recipeId: recipe.recipeId,
      title: recipe.title,
      mealType: recipe.mealType,
      cuisineType: recipe.cuisineType,
      prepTime: recipe.prepTime,
      difficulty: recipe.difficulty,
      servings: recipe.servings,
      ingredientsText: (recipe.ingredients).join('\n'),
      instructionsText: (recipe.instructions).join('\n'),
    };
  }
}
