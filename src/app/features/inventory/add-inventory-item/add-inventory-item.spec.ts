import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInventoryItem } from './add-inventory-item';

describe('AddInventoryItem', () => {
  let component: AddInventoryItem;
  let fixture: ComponentFixture<AddInventoryItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInventoryItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInventoryItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
