import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { InventoryService } from '../../../services/inventory.service';
import { UserContextService } from '../../../services/user-context.service';

@Component({
  selector: 'app-remove-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './remove-inventory.html',
  styleUrl: './remove-inventory.css',
})
export class RemoveInventory implements OnInit {
  inventoryId = '';

  protected inventoryItem: any | null = null;
  protected isAcknowledged = false;
  protected isLoading = false;
  protected error: string | null = null;
  protected selectedInventoryId = '';

  private readonly activeModal = inject(NgbActiveModal);
  private readonly inventoryService = inject(InventoryService);
  private readonly userContext = inject(UserContextService);
  private userId = '';

  ngOnInit(): void {
    this.userId = this.userContext.getUserId() ?? '';

    if (!this.userId) {
      this.error = 'User information is unavailable.';
      return;
    }

    this.selectedInventoryId = this.inventoryId;
    this.fetchInventoryItem(this.selectedInventoryId);
  }

  protected onInventoryChanged(inventoryId: string): void {
    this.selectedInventoryId = inventoryId;
    this.isAcknowledged = false;
    if (!inventoryId) {
      this.inventoryItem = null;
      return;
    }
    this.fetchInventoryItem(inventoryId);
  }

  protected confirm(): void {
    if (!this.isAcknowledged || !this.inventoryItem?.inventoryId) {
      return;
    }
    this.activeModal.close('confirm');
  }

  protected cancel(): void {
    this.activeModal.dismiss('cancel');
  }

  private fetchInventoryItem(inventoryId: string): void {
    if (!this.userId) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.inventoryService.getById(inventoryId, this.userId).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.inventoryItem = response?.item || null;
        if (!this.inventoryItem) {
          this.error = 'Inventory item not found.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.error = 'Unable to load inventory details.';
        this.inventoryItem = null;
      },
    });
  }
}
