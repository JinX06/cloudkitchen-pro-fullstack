import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInventoryItem } from './edit-inventory-item';

describe('EditInventoryItem', () => {
  let component: EditInventoryItem;
  let fixture: ComponentFixture<EditInventoryItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditInventoryItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInventoryItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
