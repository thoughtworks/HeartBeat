import { BehaviorSubject} from 'rxjs';
import { StepsFetchService } from './steps-fetch.service';
import { UtilsService } from './utils.service';

describe('StepsFetchService', () => {
  let utilsService: UtilsService = new UtilsService();
  let service: StepsFetchService = new StepsFetchService(utilsService);

  interface StepsFetchExtraParams {
    token: string;
    type: string;
    startTime: number;
    endTime: number;
  }

  it('should get value', () => {
    const utilsServiceSpy =
      jasmine.createSpyObj('UtilsService', ['convertStartTimeToTimestamp']);

    const startTime = 1689080044001;
    const endTime = 1689080044001;
    utilsServiceSpy.convertStartTimeToTimestamp.and.returnValue(startTime);

    service = new StepsFetchService(utilsServiceSpy);
    const stepsFetchExtraParams = new BehaviorSubject<StepsFetchExtraParams>({
      token: '',
      type: 'BuildKite',
      startTime,
      endTime,
    });
    
    expect(service.getVaule()).toEqual(stepsFetchExtraParams.asObservable());
    expect(utilsServiceSpy.convertStartTimeToTimestamp.calls.count())
      .toBe(2);
  });

  it('should set value', () => {
    service.setValue("testValue");
    expect((<any>service).stepsFetchExtraParams._value).toEqual("testValue");
  });
});
