import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { InventoryService } from '../../../services/inventory.service';
import { UserContextService } from '../../../services/user-context.service';

@Component({
  selector: 'app-view-inventory',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-inventory.html',
  styleUrl: './view-inventory.css',
})
export class ViewInventory implements OnInit {
  protected userId = '';
  protected inventoryId = '';

  protected item: any | null = null;
  protected isLoading = false;
  protected error: string | null = null;

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly inventoryService = inject(InventoryService);
  private readonly userContext = inject(UserContextService);

  ngOnInit(): void {
    this.attachUser();
    this.inventoryId = this.route.snapshot.queryParamMap.get('inventoryId') || '';
    this.loadItem();
  }

  protected getQueryParams(){
    return { userId: this.userId, inventoryId: this.inventoryId };
  }

  protected goBack(): void {
    const queryParams = { userId: this.userId };
    this.router.navigate(['/inventory-34076352'], { queryParams });
  }

  private attachUser(): void {
    const contextUser = this.userContext.getUserId();
    this.userId = contextUser || '';
    if (!this.userId) {
      this.error = 'User information is unavailable.';
    }
  }

  private loadItem(): void {
    if (!this.userId || !this.inventoryId) {
      this.item = null;
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.inventoryService.getById(this.inventoryId, this.userId).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.item = response?.item || null;
        if (!this.item) {
          this.error = 'Inventory item not found.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.item = null;
        this.error = err?.error?.error || 'Unable to load inventory item.';
      },
    });
  }
}