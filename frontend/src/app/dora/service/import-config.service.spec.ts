import { TestBed } from '@angular/core/testing';

import { ImportConfigService } from './import-config.service';

describe('ImportConfigService', () => {
  let service: ImportConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
