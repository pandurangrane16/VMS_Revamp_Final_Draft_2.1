import { TestBed } from '@angular/core/testing';

import { IdletimeoutService } from './idletimeout.service';

describe('IdletimeoutService', () => {
  let service: IdletimeoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdletimeoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
