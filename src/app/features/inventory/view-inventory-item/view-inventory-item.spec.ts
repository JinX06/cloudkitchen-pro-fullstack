import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInventoryItem } from './view-inventory-item';

describe('ViewInventoryItem', () => {
  let component: ViewInventoryItem;
  let fixture: ComponentFixture<ViewInventoryItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewInventoryItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewInventoryItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
