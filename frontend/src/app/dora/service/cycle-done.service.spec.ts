import { TestBed } from '@angular/core/testing';

import { CycleDoneService } from './cycle-done.service';

describe('CycleDoneService', () => {
  let service: CycleDoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CycleDoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
