import { TestBed } from '@angular/core/testing';

import { CrystalService } from './crystal.service';

describe('CrystalsService', () => {
  let service: CrystalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrystalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
