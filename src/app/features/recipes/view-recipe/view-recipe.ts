import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { RecipesService } from '../../../services/recipes.service';
import { Recipe, RecipeResponse } from '../../../models/recipe.model';
import { UserContextService } from '../../../services/user-context.service';

@Component({
  selector: 'app-view-recipe',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view-recipe.html',
  styleUrl: './view-recipe.css'
})
export class ViewRecipe implements OnInit {
  protected userId = '';
  protected recipeId = '';
  protected recipe!: Recipe;
  protected isLoading = false;
  protected error: string | null = null;
  protected queryParams = {};

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recipes = inject(RecipesService);
  private readonly userContext = inject(UserContextService);

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.queryParamMap.get('recipeId') || '';

    this.userId = this.userContext.getUserId() || '';
    this.queryParams = { userId: this.userId };

    if (!this.recipeId) {
      this.router.navigate(['/recipes-34076352'], { queryParams: this.queryParams });
      return;
    }

    if (!this.userId) {
      this.error = 'User information is unavailable.';
      return;
    }

    // Update the URL to include recipeId in query params
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...this.queryParams, recipeId: this.recipeId },
      replaceUrl: true,
    });

    this.loadRecipe();
  }

  protected goBack(): void {
    this.router.navigate(['/recipes-34076352'], { queryParams: this.queryParams });
  }

  private loadRecipe(): void {
    this.isLoading = true;
    this.error = null;

    this.recipes.getById(this.recipeId, this.userId).subscribe({
      next: (response: RecipeResponse) => {
        this.isLoading = false;

        // set the recipe data 
        this.recipe = response.item;
        if (!this.recipe) {
          this.error = 'Recipe not found.';}
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.error || 'Unable to load recipe.';
      },
    });
  }
}
