import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RecipesService } from '../../../services/recipes.service';
import { UserContextService } from '../../../services/user-context.service';
import { Recipe } from '../../../models/recipe.model';

@Component({
  selector: 'app-remove-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './remove-recipe.html',
  styleUrl: './remove-recipe.css'
})
export class RemoveRecipe implements OnInit {
  recipeId = '';

  protected recipe: Recipe | null = null;
  protected isAcknowledged = false; // checkbox state for confirmation of delete
  protected isLoading = false;
  protected error: string | null = null;

  private readonly activeModal = inject(NgbActiveModal);
  private readonly recipesService = inject(RecipesService);
  private readonly userContext = inject(UserContextService);

  ngOnInit() {
    const userId = this.userContext.getUserId() ?? '';
    if (!this.recipeId) {
      this.error = 'Recipe details were not provided.';
      return;
    }

    if (!userId) {
      this.error = 'User information is unavailable.';
      return;
    }

    this.isLoading = true;
    this.recipesService.getById(this.recipeId, userId).subscribe({
      next: (response) => {
        this.recipe = response.item || response.recipe || null;
        this.isLoading = false;
        if (!this.recipe) {
          this.error = 'Recipe not found.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Unable to load recipe details.';
      },
    });
  }

  // confirm deletion of the recipe and pass control back to list-recipes component
  protected confirm(): void {
    if (!this.isAcknowledged) {
      return;
    }
    this.activeModal.close('confirm');
  }

  // cancel deletion of the recipe
  protected cancel(): void {
    this.activeModal.dismiss('cancel');
  }
}
