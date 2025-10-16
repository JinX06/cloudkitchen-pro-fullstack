import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveRecipe } from './remove-recipe';

describe('RemoveRecipe', () => {
  let component: RemoveRecipe;
  let fixture: ComponentFixture<RemoveRecipe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveRecipe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveRecipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
