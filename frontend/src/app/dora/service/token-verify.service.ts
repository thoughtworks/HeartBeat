import { Injectable } from '@angular/core';
import { ValidationErrors, FormGroup, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class TokenVerifyService {
  constructor() {}

  verifyTokenValidator(): ValidatorFn {
    return (group: FormGroup): ValidationErrors | null => {
      console.log('========================');
      console.log(group.controls);
      const invalid = Object.keys(group.controls)
        .map((control) => group.get(control))
        .filter((instance) => instance instanceof FormGroup)
        .find((g) => {
          console.log('============11111============');
          return g.get('verifyToken').value === 'Verify';
        });
      return invalid ? { tokenVerify: true } : null;
    };
  }
}
