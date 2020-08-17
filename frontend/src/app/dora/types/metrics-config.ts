import { AbstractControl, ValidationErrors } from '@angular/forms';

interface Control {
  [key: string]: ((control: AbstractControl) => ValidationErrors)[];
}

export interface ConfigGroup {
  [key: string]: Control;
}

export interface MetricsConfig {
  [key: string]: ConfigGroup;
}
