import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UtilsService } from './utils.service';

interface StepsFetchExtraParams {
  token: string;
  type: string;
  startTime: number;
  endTime: number;
}

@Injectable({
  providedIn: 'root',
})
export class StepsFetchService {
  private stepsFetchExtraParams: BehaviorSubject<StepsFetchExtraParams>;

  constructor(private utilsService: UtilsService) {
    this.stepsFetchExtraParams = new BehaviorSubject<StepsFetchExtraParams>({
      token: '',
      type: 'BuildKite',
      startTime: this.utilsService.convertStartTimeToTimestamp(new Date()),
      endTime: this.utilsService.convertStartTimeToTimestamp(new Date()),
    });
  }

  getVaule(): Observable<StepsFetchExtraParams> {
    return this.stepsFetchExtraParams.asObservable();
  }

  setValue(newValue): void {
    this.stepsFetchExtraParams.next(newValue);
  }
}
