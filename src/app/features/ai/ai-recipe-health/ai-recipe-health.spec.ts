import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiRecipeHealth } from './ai-recipe-health';

describe('Login', () => {
  let component: AiRecipeHealth;
  let fixture: ComponentFixture<AiRecipeHealth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiRecipeHealth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiRecipeHealth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
