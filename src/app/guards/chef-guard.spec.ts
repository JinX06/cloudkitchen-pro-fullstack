import { TestBed } from '@angular/core/testing';

import { ChefGuard } from './chef-guard';

describe('ChefGuard', () => {
  let service: ChefGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChefGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
