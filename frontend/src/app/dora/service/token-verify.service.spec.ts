import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  it('should verify token validator', () => {
    const verifyToken = new FormControl('Verify', [Validators.required, Validators.maxLength(15)]);
    const control = new FormControl({
        asyncValidator: null,
        errors: null,
        pristine: true,
        status: "VALID",
        touched: false,
        validator: null,
        value: "Verify" })  

    const form = new FormGroup({
      verifyToken: verifyToken,
    })
    console.log("----------------control---------------");
    console.log(control); 
        service.verifyTokenValidator()(form);
  });
  
});
