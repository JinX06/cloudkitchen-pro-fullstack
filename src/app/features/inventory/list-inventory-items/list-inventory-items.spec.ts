import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInventoryItems } from './list-inventory-items';

describe('ListInventoryItems', () => {
  let component: ListInventoryItems;
  let fixture: ComponentFixture<ListInventoryItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListInventoryItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListInventoryItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
