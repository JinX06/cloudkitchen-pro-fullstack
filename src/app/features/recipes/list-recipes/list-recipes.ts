import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { RecipesService } from '../../../services/recipes.service';
import { Recipe, RecipeListResponse } from '../../../models/recipe.model';
import { RemoveRecipe } from '../remove-recipe/remove-recipe';
import { UserContextService } from '../../../services/user-context.service';

@Component({
  selector: 'app-list-recipes',
  standalone: true,
  imports: [CommonModule, RouterLink, NgbModalModule],
  templateUrl: './list-recipes.html',
})
export class ListRecipes implements OnInit {
  protected userId = '';
  protected queryParams: any;

  protected recipes: Recipe[] = [];
  protected isLoading = false;
  protected error: string | null = null;
  protected success: string | null = null;
  protected deletingId: string | null = null;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly recipesService = inject(RecipesService);
  private readonly modalService = inject(NgbModal);
  private readonly userContext = inject(UserContextService);

  ngOnInit(): void {
    if (this.attachUser()) {
      this.loadRecipes();
    }
  }
  private attachUser(): boolean {
    this.userId = this.userContext.getUserId() || '';
    this.queryParams = this.userId ? { userId: this.userId } : {};

    if (this.userId === '' || this.userId === null) {
      this.error = 'User context is unavailable.';
      return false;
    }

    // navigate to same page with userId query param
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.queryParams,
      replaceUrl: true,
    });

    return true;
  }
  
  private loadRecipes(): void {
    this.isLoading = true;
    this.error = null;

    this.recipesService.list(this.userId).subscribe({
      next: (response: RecipeListResponse) => this.handleListSuccess(response),
      error: (err) => this.handleListError(err),
    });
  }

  protected trackByRecipeId(recipe: Recipe): string {
    return recipe.recipeId;
  }

  protected getQueryParams(recipeId?: string) {
    return { userId: this.userId, recipeId: recipeId || '' };
  }

  // NgBootstrap modal to confirm deletion
  protected openDeleteModal(recipe: Recipe): void {
    const modalRef = this.modalService.open(RemoveRecipe, {
      backdrop: 'static',
      size: 'xl',
      centered: true,
    });

    modalRef.componentInstance.recipeId = recipe.recipeId;
    modalRef.closed.subscribe((result) => {
      if (result === 'confirm') {
        this.performDelete(recipe.recipeId);
      }
    });
  }

  // Gracefully handle list success and error
  private handleListSuccess(response: RecipeListResponse): void {
    this.isLoading = false;
    this.recipes = response.items || [];
  }

  // Gracefully handle list success and error
  private handleListError(err: any): void {
    this.isLoading = false;

    this.error = err.error?.error || 'Unable to load recipes.';
  }

  private performDelete(recipeId: string): void {
    if (!this.userId || !recipeId) {
      return;
    }

    this.deletingId = recipeId;
    this.success = null;
    this.error = null;

    this.recipesService.remove(recipeId, this.userId).subscribe({
      next: () => {
        this.deletingId = null;
        this.success = 'Recipe deleted successfully.';
        this.loadRecipes();
      },
      error: (err) => {
        this.deletingId = null;

        this.error = err.error?.error || 'Unable to delete recipe.';
      },
    });
  }
}