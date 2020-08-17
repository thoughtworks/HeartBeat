import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImportConfigService {
  private importConfig;
  constructor() {}

  set(importConfig) {
    this.importConfig = importConfig ? JSON.parse(importConfig) : null;
  }

  get() {
    return this.importConfig;
  }
}
