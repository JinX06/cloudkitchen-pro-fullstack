import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { RemoveInventory } from './remove-inventory';
import { InventoryService } from '../../../services/inventory.service';
import { UserContextService } from '../../../services/user-context.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

const inventoryServiceStub = {
  getById: () => of({ item: { inventoryId: 'INV-1' } }),
};

const userContextStub = {
  getUserId: () => 'U-TEST',
};

describe('RemoveInventory', () => {
  let component: RemoveInventory;
  let fixture: ComponentFixture<RemoveInventory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveInventory],
      providers: [
        { provide: InventoryService, useValue: inventoryServiceStub },
        { provide: UserContextService, useValue: userContextStub },
        { provide: NgbActiveModal, useValue: { close: () => {}, dismiss: () => {} } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveInventory);
    component = fixture.componentInstance;
    component.inventoryId = 'INV-1';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
