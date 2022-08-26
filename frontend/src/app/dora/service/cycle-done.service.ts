import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CycleDoneService {
  private doneList: BehaviorSubject<string[]>;

  constructor() {
    this.doneList = new BehaviorSubject<string[]>([]);
  }

  getValue(): Observable<string[]> {
    return this.doneList.asObservable();
  }

  setValue(newValue): void {
    this.doneList.next(newValue);
  }
}
