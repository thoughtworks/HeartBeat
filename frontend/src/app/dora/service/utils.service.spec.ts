import { TestBed } from '@angular/core/testing';

import { UtilsService } from './utils.service';
import { setAttribute } from 'echarts/types/src/util/model';

describe('ExportService', () => {
  let service: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert start time to timestamp', () => {
    spyOn(service, 'convertToTimestamp').and.returnValue(1689080044001);
    expect(service.convertStartTimeToTimestamp(new Date())).toEqual(1689080044001);
  });

  it('should convert end time to timestamp', () => {
    spyOn(service, 'convertToTimestamp').and.returnValue(1689080044001);
    expect(service.convertEndTimeToTimestamp(new Date())).toEqual(1689080044001);
  });

  it('should export to json file', () => {
    const linkElement = jasmine.createSpyObj('a', ['click']);
    spyOn(document, 'createElement').and.returnValue(linkElement);
    service.exportToJsonFile({ fileName: 'testFileName', json: 'testJson' });
    expect(document.createElement).toHaveBeenCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(linkElement.click).toHaveBeenCalledTimes(1);
    expect(linkElement.click).toHaveBeenCalledWith();
  });
});
