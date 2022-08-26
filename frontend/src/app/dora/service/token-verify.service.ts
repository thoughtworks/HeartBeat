import { Injectable } from '@angular/core';
import { ValidationErrors, FormGroup, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class TokenVerifyService {
  constructor() {}

  verifyTokenValidator(): ValidatorFn {
    // const invalid = group.controls.verifyToken?.value === 'Verify';
    return (group: FormGroup): ValidationErrors | null => {
      console.log(group.controls);
      const invalid = Object.keys(group.controls)
        .map((control) => group.get(control))
        .filter((instance) => instance instanceof FormGroup)
        .find((g) => {
          return g.get('verifyToken').value === 'Verify';
        });
      return invalid ? { tokenVerify: true } : null;
    };
  }
}
