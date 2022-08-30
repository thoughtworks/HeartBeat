import { async } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { TokenVerifyService } from './token-verify.service';

describe('TokenVerifyService', () => {
  const tokenVerifyService = new TokenVerifyService();
  let formGroup = new FormGroup({ first: new FormControl('first name') });
  let formGroupBig = new FormGroup({ first: new FormControl('first name') });

  beforeEach(async(() => {
    const verifyToken = new FormControl({
      asyncValidator: null,
      errors: null,
      pristine: true,
      status: 'VALID',
      touched: false,
      validator: null,
      value: 'no-Verify',
    });
    formGroup.addControl('verifyToken', verifyToken);
    formGroupBig.addControl('formGroup', formGroup);
  }));

  it('should be created', () => {
    expect(tokenVerifyService).toBeTruthy();
  });

  it('should verify token validator', () => {
    const res = tokenVerifyService.verifyTokenValidator()(formGroupBig);
    expect(res).toEqual(null);
  });
});
