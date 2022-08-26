import { async, TestBed } from '@angular/core/testing';
import { CycleDoneService } from './cycle-done.service';

describe('CycleDoneService', () => {
  let cycleDoneService: CycleDoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    cycleDoneService = TestBed.inject(CycleDoneService);
  });

  it('should be created', () => {
    expect(cycleDoneService).toBeTruthy();
  });

  it('should get the same array when set a new array', async(() => {
    const testValue: string[] = ['ADM-212'];

    cycleDoneService.setValue(testValue);

    cycleDoneService.getValue().subscribe((res) => {
      expect(res).toEqual(testValue);
    });
  }));
});
