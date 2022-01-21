import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleTimeReportComponent } from './cycle-time.component';

describe('CycleTimeComponent', () => {
  let component: CycleTimeReportComponent;
  let fixture: ComponentFixture<CycleTimeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CycleTimeReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CycleTimeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
