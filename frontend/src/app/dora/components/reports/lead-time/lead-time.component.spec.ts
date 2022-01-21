import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadTimeReportComponent } from './lead-time.component';

describe('LeadTimeComponent', () => {
  let component: LeadTimeReportComponent;
  let fixture: ComponentFixture<LeadTimeReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeadTimeReportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadTimeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
