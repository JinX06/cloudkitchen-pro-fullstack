import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { RecipesService } from '../../../services/recipes.service';
import { RecipePayload, RecipeResponse } from '../../../models/recipe.model';
import { UserContextService } from '../../../services/user-context.service';

@Component({
  selector: 'app-add-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-recipe.html',
  styleUrl: './add-recipe.css'
})

export class AddRecipe implements OnInit {
  protected userId = '';
  protected chefName = '';
  protected queryParams = {};

  protected serverError: string | null = null;
  protected isSaving = false;

  protected formData = this.defaultForm();

  private readonly router = inject(Router);
  private readonly recipes = inject(RecipesService);
  private readonly userContext = inject(UserContextService);

  // Initialize component
  ngOnInit(): void {
    const contextUser = this.userContext.getUser();
    if (contextUser) {
      this.userId = contextUser.userId;
      this.chefName = contextUser.fullname || contextUser.userId;
    } else {
      this.userId = this.userContext.getUserId() ?? '';
      this.chefName = this.userId || 'Current User';
    }

    this.queryParams = this.userId ? { userId: this.userId } : {};
  }

  // Handle form submission
  protected submit(form: any) {
    if (!this.userId || form.invalid) {
      form.form.markAllAsTouched();
      return;
    }

    const payload: RecipePayload = {
      chef: this.chefName,
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

    this.recipes.create(payload, this.userId).subscribe({
      next: (response) => this.handleSuccess(response),
      error: (err) => this.handleError(err),
    });
  }

  // Reset the form
  protected reset(form: any): void {
    this.formData = this.defaultForm();
    form.resetForm(this.formData);
    this.serverError = null;
  }

  // Handle success response
  private handleSuccess(response: any){
    this.isSaving = false;
    const created = response.recipe || response.item;

    // go to the created recipe view page if recipe created successfully
    if (created?.recipeId) {
      this.router.navigate(['/recipes-view-34076352'], {
        queryParams: { ...this.queryParams, recipeId: created.recipeId },
      });
      return;
    }

    // go back to recipes list if no recipeId returned
    this.router.navigate(['/recipes-34076352'], {
      queryParams: this.queryParams,
    });
  }

  // Handle error response
  private handleError(err: any) {
    this.isSaving = false;
    this.serverError = err.error?.error || 'Unable to add recipe.';
  }

  private defaultForm() {
    return {
      title: '',
      mealType: '',
      cuisineType: '',
      prepTime: 30,
      difficulty: '',
      servings: 2,
      ingredientsText: '',
      instructionsText: '',
    };
  }
}
