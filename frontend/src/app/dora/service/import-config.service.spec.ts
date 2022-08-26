import { TestBed } from '@angular/core/testing';
import { ImportConfigService } from './import-config.service';

describe('ImportConfigService', () => {
  let importConfigService: ImportConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    importConfigService = TestBed.inject(ImportConfigService);
  });

  it('should be created', () => {
    expect(importConfigService).toBeTruthy();
  });

  it('should get the corresponding object when set json string', () => {
    const importConfig = '{"key": "value"}';
    const expected = { key: 'value' };

    importConfigService.set(importConfig);
    expect(importConfigService.get()).toEqual(expected);
  });

  it('should get null when set null in importConfigService', () => {
    const importConfig = null;
    importConfigService.set(importConfig);
    expect(importConfigService.get()).toEqual(importConfig);
  });
});
