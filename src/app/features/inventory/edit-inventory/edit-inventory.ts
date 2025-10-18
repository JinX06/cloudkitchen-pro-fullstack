import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { InventoryService } from '../../../services/inventory.service';
import { UserContextService } from '../../../services/user-context.service';

interface InventoryEditFormModel {
  inventoryId: string;
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
  selector: 'app-edit-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-inventory.html',
  styleUrl: './edit-inventory.css',
})
export class EditInventory implements OnInit {
  protected userId = '';
  protected inventoryId = '';

  protected inventoryItems: any[] = [];
  protected serverError: string | null = null;
  protected isLoadingItem = false;
  protected isSubmitting = false;
  protected success: string | null = null;

  // Options for select inputs in HTML form
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


  protected formModel: InventoryEditFormModel = this.createEmptyForm();

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly inventoryService = inject(InventoryService);
  private readonly userContext = inject(UserContextService);

  private listLoaded = false;

  ngOnInit(): void {
    this.attachUser();
    const userParam = this.userContext.getUserId();
    this.inventoryId = this.route.snapshot.queryParamMap.get('inventoryId') || '';
    if (this.inventoryId) {
      this.loadInventoryItem();
    } else {
      this.formModel = this.createEmptyForm();
    }

    // Load inventory list for selection dropdown
    this.loadInventory();
  }

  // Changes the selected inventory item and updates the URL
  protected onInventorySelected(inventoryId: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { userId: this.userId, inventoryId },
      replaceUrl: true,
    });
    this.inventoryId = inventoryId;
    if (this.inventoryId) {
      this.loadInventoryItem();
    } else {
      this.formModel = this.createEmptyForm();
    }
  }

  protected getQueryParams(): Record<string, string> {
    return this.inventoryId ? { userId: this.userId, inventoryId: this.inventoryId } : { userId: this.userId };
  }

  private attachUser(): void {
    const contextUser = this.userContext.getUserId();
    const queryUser = this.route.snapshot.queryParamMap.get('userId');
    this.userId = contextUser || queryUser || '';

    if (!this.userId) {
      this.serverError = 'User information is unavailable.';
    }
  }

  // For dropdown selection
  private loadInventory(): void {
    if (this.listLoaded || !this.userId) {
      return;
    }

    this.listLoaded = true;
    this.inventoryService.list(this.userId).subscribe({
      next: (response) => {
        this.inventoryItems = response?.items || [];
      },
      error: () => {
        this.serverError = 'Unable to load inventory options.';
        this.listLoaded = false;
      },
    });
  }

  // Load the selected inventory item details into the form
  private loadInventoryItem(): void {
    if (!this.userId || !this.inventoryId) {
      return;
    }

    this.isLoadingItem = true;
    this.serverError = null;

    this.inventoryService.getById(this.inventoryId, this.userId).subscribe({
      next: (response) => {
        this.isLoadingItem = false;
        const item = response?.item;
        if (!item) {
          this.formModel = this.createEmptyForm();
          this.serverError = 'Inventory item not found.';
          return;
        }
        this.formModel = {
          inventoryId: item.inventoryId || this.inventoryId,
          ingredientName: item.ingredientName,
          quantity: item.quantity,
          unit: item.unit,
          category: item.category,
          purchaseDate: this.normalizeDate(item.purchaseDate),
          expiryDate: this.normalizeDate(item.expirationDate),
          location: item.location,
          cost: item.cost,
        };
      },
      error: (err) => {
        this.isLoadingItem = false;
        this.serverError = err?.error?.error || 'Unable to load inventory item.';
        this.formModel = this.createEmptyForm();
      },
    });
  }

  private normalizeDate(dateStr: string): string {
    let date: any = new Date(dateStr);
    date = date.toISOString().split("T")[0];
    const year = date.split("-")[0];
    const month = date.split("-")[1];
    const day = date.split("-")[2];
    return `${year}-${month}-${day}`;
  }


  private createEmptyForm(): InventoryEditFormModel {
    return {
      inventoryId: this.inventoryId || '',
      ingredientName: '',
      quantity: '',
      unit: '',
      category: '',
      purchaseDate: '',
      expiryDate: '',
      location: '',
      cost: '',
    };
  }

    protected submit(form: any): void {
    if (this.isSubmitting || !form.valid || !this.userId || !this.formModel.inventoryId) {
      return;
    }

    this.isSubmitting = true;
    this.serverError = null;

    this.inventoryService.update(this.formModel, this.userId).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.success = 'Inventory item updated successfully.';
        this.loadInventoryItem();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.serverError = err?.error?.error || 'Unable to update inventory item.';
      },
    });
  }
}
