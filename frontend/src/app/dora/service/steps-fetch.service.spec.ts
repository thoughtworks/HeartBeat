import { TestBed } from '@angular/core/testing';

import { StepsFetchService } from './steps-fetch.service';

describe('StepsFetchService', () => {
  let service: StepsFetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StepsFetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
