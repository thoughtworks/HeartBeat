import { BehaviorSubject } from 'rxjs';
import { StepsFetchService } from './steps-fetch.service';
import { UtilsService } from './utils.service';

describe('StepsFetchService', () => {
  interface StepsFetchExtraParams {
    token: string;
    type: string;
    startTime: number;
    endTime: number;
  }

  it('should get value', () => {
    const utilsServiceSpy = jasmine.createSpyObj('UtilsService', ['convertStartTimeToTimestamp']);

    const startTime = 1689080044001;
    const endTime = 1689080044001;
    utilsServiceSpy.convertStartTimeToTimestamp.and.returnValue(startTime);

    const service = new StepsFetchService(utilsServiceSpy);
    const stepsFetchExtraParams = new BehaviorSubject<StepsFetchExtraParams>({
      token: '',
      type: 'BuildKite',
      startTime,
      endTime,
    });

    expect(service.getValue()).toEqual(stepsFetchExtraParams.asObservable());
    expect(utilsServiceSpy.convertStartTimeToTimestamp.calls.count()).toBe(2);
  });

  it('should set value', () => {
    const utilsService: UtilsService = new UtilsService();
    const service: StepsFetchService = new StepsFetchService(utilsService);
    service.setValue('testValue');
    expect((service as any).stepsFetchExtraParams._value).toEqual('testValue');
  });
});
