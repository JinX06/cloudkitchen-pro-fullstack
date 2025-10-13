import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRecipes } from './list-recipes';

describe('ListRecipes', () => {
  let component: ListRecipes;
  let fixture: ComponentFixture<ListRecipes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRecipes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRecipes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
