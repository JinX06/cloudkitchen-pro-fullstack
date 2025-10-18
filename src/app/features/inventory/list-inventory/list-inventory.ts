import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { InventoryService } from '../../../services/inventory.service';
import { UserContextService } from '../../../services/user-context.service';
import { RemoveInventory } from '../remove-inventory/remove-inventory';

type SortKey = 'expiry' | 'category' | 'quantity' | null;

@Component({
  selector: 'app-list-inventory',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NgbModalModule],
  templateUrl: './list-inventory.html',
  styleUrl: './list-inventory.css',
})
export class ListInventory implements OnInit {
  protected userId = '';
  protected queryParams = {};

  protected inventory: any[] = [];
  protected displayInventory: any[] = [];

  protected isLoading = false;
  protected error: string | null = null;
  protected success: string | null = null;
  protected deletingId: string | null = null;

  protected lowStockOnly = false;
  protected lowStockThreshold = 5;
  protected selectedCategory = '';
  protected availableCategories: string[] = [];

  protected sortKey: SortKey = null;
  protected sortDir: 'asc' | 'desc' = 'asc';

  protected totalValue = 0;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly inventoryService = inject(InventoryService);
  private readonly userContext = inject(UserContextService);
  private readonly modalService = inject(NgbModal);

  // Initialize component with 
  ngOnInit(): void {
    if (this.attachUser()) {
      this.loadInventory();
    }
  }

  // Sets query parameters for navigation
  protected getQueryParams(inventoryId?: string) {
    if (inventoryId) {
      return { userId: this.userId, inventoryId };
    } else {
      return { userId: this.userId };
    } 
  }

  // Update sorting based on selected key
  protected updateSort(key: any): void {
    if (this.sortKey === key) {
      if (this.sortDir === 'asc') {
        this.sortDir = 'desc';
      } else {
        this.sortDir = 'asc';
      }
    } else {
      this.sortKey = key;
      this.sortDir = 'asc';
    }
    this.applyFilters();
  }

  // Reset all filters to default values
  protected resetFilters(): void {
    this.lowStockOnly = false;
    this.lowStockThreshold = 5;
    this.selectedCategory = '';
    this.sortKey = null;
    this.sortDir = 'asc';
    this.applyFilters();
  }

  private getToday(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  // Check if a date is expired
  protected isExpired(dateValue: any): boolean {
    if (!dateValue) {
      return false;
    }
    const target = new Date(dateValue);
    const now = this.getToday();
    return target < now;
  }

  // Check if a date is expiring soon (within 7 days)
  protected isExpiringSoon(dateValue: any): boolean {
    if (!dateValue) {
      return false;
    }
    const target = new Date(dateValue);
    const now = this.getToday();
    const diff = target.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days >= 0 && days <= 7;
  }

  // Get the number of days until expiry
  protected getDaysToExpiry(dateValue: any){
    const target = new Date(dateValue);

    // Calculate difference in days
    const now = this.getToday();
    const diff = target.getTime() - now.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  // Calculate total value for an inventory item
  protected getValuePerItem(item: any): number {
    const quantity = Number(item.quantity);
    const cost = Number(item.cost);
    return quantity * cost;
  }

  // Open the delete confirmation modal using NgbModal (Week 10)
  // NgBootstrap modal to confirm deletion
  protected openDeleteModal(item: any): void {
    const modalRef = this.modalService.open(RemoveInventory, {
      backdrop: 'static',
      size: 'xl',
      centered: true,
    });

    modalRef.componentInstance.inventoryList = this.inventory;
    modalRef.componentInstance.inventoryId = item.inventoryId;
    modalRef.closed.subscribe((result) => {
      if (result === 'confirm') {
        this.performDelete(item.inventoryId);
      }
    });
  }

  // Set badge label and style based on expiry status
  protected getExpiryBadge(item: any): { label: string; css: string } {
    const days = this.getDaysToExpiry(item.expirationDate);
    if (days < 0) {
      return { label: `Expired (${Math.abs(days)} days ago)`, css: 'badge bg-danger' };
    }
    if (days <= 7) {
      return { label: `Expiring Soon (${days} days)`, css: 'badge bg-warning text-dark' };
    }
    return { label: `Fresh (${days} days)`, css: 'badge bg-success' };
  }

  // for filter changes in html when user interacts
  protected onFiltersChanged(): void {
    this.applyFilters();
  }

  // Attach user context and set query parameters
  private attachUser(): boolean {
    const contextUserId = this.userContext.getUserId();
    this.userId = contextUserId || '';

    if (!this.userId) {
      this.error = 'User information is unavailable.';
      return false;
    }

    this.queryParams = { userId: this.userId };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.queryParams,
      replaceUrl: true,
    });

    return true;
  }

  // Perform deletion of an inventory item
  private performDelete(inventoryId: string): void {
    if (!this.userId) {
      return;
    }

    this.deletingId = inventoryId;
    this.error = null;
    this.success = null;

    this.inventoryService.remove(inventoryId, this.userId).subscribe({
      next: () => {
        this.deletingId = null;
        this.success = 'Inventory item deleted successfully.';
        this.loadInventory();
      },
      error: (err) => {
        this.deletingId = null;
        this.error = err?.error?.error || 'Unable to delete inventory item.';
      },
    });
  }

  // Load inventory items from the service
  private loadInventory(): void {
    if (!this.userId) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.inventoryService.list(this.userId).subscribe({
      next: (response) => this.handleListSuccess(response),
      error: (err) => this.handleListError(err),
    });
  }

  // Hnadle successful inventory list response
  private handleListSuccess(response: any): void {
    this.isLoading = false;
    this.inventory = response?.items || [];
    this.availableCategories = Array.from(
      new Set(
        this.inventory
          .map((item) => item?.category)
      )
    ).sort();

    this.totalValue = this.inventory.reduce((sum, item) => sum + this.getValuePerItem(item), 0);

    this.applyFilters();
  }

  // handle inventory list error response
  private handleListError(err: any): void {
    this.isLoading = false;
    this.inventory = [];
    this.displayInventory = [];
    this.availableCategories = [];
    this.error = err?.error?.error || 'Unable to load inventory.';
  }

  // Apply filters and sorting to the inventory list
  private applyFilters(): void {
    let items = [...this.inventory];

    const threshold = Math.max(0, Number(this.lowStockThreshold ?? 0));

    if (this.lowStockOnly) {
      items = items.filter((item) => Number(item?.quantity ?? 0) <= threshold);
    }

    if (this.selectedCategory) {
      items = items.filter((item) => item?.category === this.selectedCategory);
    }

    if (this.sortKey) {
      items.sort((a, b) => this.compareItems(a, b, this.sortKey!));
      if (this.sortDir === 'desc') {
        items.reverse();
      }
    }

    this.displayInventory = items;
  }

  // Compare two inventory items based on the specified key
  private compareItems(a: any, b: any, key: any): number {
    switch (key) {

      // Sort by expiry date
      case 'expiry': {
        const aTime = new Date(a?.expirationDate).getTime();
        const bTime = new Date(b?.expirationDate).getTime();
        return aTime - bTime;
      }

      // Sort by category
      case 'category': {
        const aCategory = (a?.category || '').toString().toLowerCase();
        const bCategory = (b?.category || '').toString().toLowerCase();
        if (aCategory < bCategory) {
          return -1;
        }
        if (aCategory > bCategory) {
          return 1;
        }
        return 0;
      }

      // Sort by quantity
      case 'quantity': {
        const aQuantity = Number(a?.quantity ?? 0);
        const bQuantity = Number(b?.quantity ?? 0);
        return aQuantity - bQuantity;
      }
      default:
        return 0;
    }
  }
}
