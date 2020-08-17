import { TestBed } from '@angular/core/testing';

import { TokenVerifyService } from './token-verify.service';

describe('TokenVerifyService', () => {
  let service: TokenVerifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TokenVerifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
