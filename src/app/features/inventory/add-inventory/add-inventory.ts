import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { InventoryService } from '../../../services/inventory.service';
import { UserContextService } from '../../../services/user-context.service';

interface InventoryFormModel {
  ingredientName: string;
  quantity: number | string;
  unit: string;
  category: string;
  purchaseDate: string;
  expiryDate: string;
  location: string;
  cost: number | string;
}

@Component({
  selector: 'app-add-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-inventory.html',
  styleUrl: './add-inventory.css',
})
export class AddInventory implements OnInit {
  protected userId = '';
  protected serverError: string | null = null;
  protected isSubmitting = false;

  //options  for select inputs in html form
  protected readonly units = ['pieces', 'kg', 'g', 'liters', 'ml', 'cups', 'tbsp', 'tsp', 'dozen'];
  protected readonly categories = [
    'Vegetables',
    'Fruits',
    'Meat',
    'Dairy',
    'Grains',
    'Spices',
    'Beverages',
    'Frozen',
    'Canned',
    'Other',
  ];
  protected readonly locations = ['Fridge', 'Freezer', 'Pantry', 'Counter', 'Cupboard'];

  // default form model
  protected formModel: InventoryFormModel = {
    ingredientName: '',
    quantity: 1,
    unit: '',
    category: '',
    purchaseDate: '',
    expiryDate: '',
    location: '',
    cost: '',
  };

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly inventoryService = inject(InventoryService);
  private readonly userContext = inject(UserContextService);

  ngOnInit(): void {
    this.attachUser();
  }

  protected submit(form: any): void {
    if (this.isSubmitting || !form.valid || !this.userId) {
      return;
    }

    this.isSubmitting = true;
    this.serverError = null;

    this.inventoryService.create(this.formModel, this.userId).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/inventory-34076352'], {
          queryParams: { userId: this.userId },
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.serverError = err?.error?.error || 'Unable to add inventory item.';
      },
    });
  }

  protected resetForm(form: any): void {
    form.resetForm({
      ingredientName: '',
      quantity: 1,
      unit: '',
      category: '',
      purchaseDate: '',
      expiryDate: '',
      location: '',
      cost: '',
    });
    this.serverError = null;
  }

  protected getQueryParams(): Record<string, string> {
    return { userId: this.userId };
  }

  private attachUser(): void {
    const queryUser = this.route.snapshot.queryParamMap.get('userId');
    this.userId = queryUser || '';
    if (!this.userId) {
      this.serverError = 'User information is unavailable.';
    }
  }
}
