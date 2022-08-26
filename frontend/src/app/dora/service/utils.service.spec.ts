import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';

describe('ExportService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert end time to stamp', () => {
    spyOn(service, 'convertToTimestamp').and.returnValue(1689080044001);
    expect(service.convertEndTimeToTimestamp(new Date())).toEqual(1689080044001);
  });

  it('should export to json file', () => {
    expect(service.exportToJsonFile({fileName: "testFileName", json: "testJson"}));
  });
});
