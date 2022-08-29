import { async, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { TokenVerifyService } from './token-verify.service';

describe('TokenVerifyService', () => {
  const tokenVerifyService = new TokenVerifyService();
  let formGroup: FormGroup;

  beforeEach(async(() => {
    const verifyToken = new FormControl();
    verifyToken.setValue({
      asyncValidator: null,
      errors: null,
      pristine: true,
      status: 'VALID',
      touched: false,
      validator: null,
      value: 'Verify',
    });
    formGroup = new FormGroup({
      verifyToken,
    });
  }));

  it('should be created', () => {
    expect(tokenVerifyService).toBeTruthy();
  });

  it('should verify token validator', () => {
    // const form = formGroup.patchValue({verifyToken})
    const res = tokenVerifyService.verifyTokenValidator()(formGroup);
    // expect(res).toEqual(true);
  });
});
